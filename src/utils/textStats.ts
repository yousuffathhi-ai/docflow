import { DocumentStats } from '../types/document';

/**
 * Calculates document statistics from plain text and raw HTML
 */
export function calculateStats(plainText: string, htmlContent: string): DocumentStats {
  const trimmed = plainText.trim();
  
  if (!trimmed) {
    return {
      words: 0,
      characters: 0,
      charactersWithoutSpaces: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeMinutes: 0,
      estimatedPages: 1,
    };
  }

  // Word count (split on whitespace)
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  
  // Character count
  const characters = plainText.length;
  const charactersWithoutSpaces = plainText.replace(/\s/g, '').length;

  // Paragraph count
  const paragraphs = htmlContent.match(/<(p|h1|h2|h3|li|blockquote)[\s>]/gi)?.length || 1;

  // Lines count (rough estimation or newlines)
  const lines = Math.max(1, Math.ceil(words / 12));

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // A4 Page estimation (roughly 450-500 words or ~3,000 characters per standard formatted page)
  const estimatedPages = Math.max(1, Math.ceil(words / 450));

  return {
    words,
    characters,
    charactersWithoutSpaces,
    paragraphs,
    lines,
    readingTimeMinutes,
    estimatedPages,
  };
}

/**
 * Calculates section-by-section word count breakdown based on heading tags
 */
export function calculateSectionStats(htmlContent: string): import('../types/document').SectionWordCount[] {
  if (typeof window === 'undefined' || !htmlContent) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;
  if (!body) return [];

  const rawSections: { title: string; level: number; text: string; paragraphs: number }[] = [];
  let currentSection = {
    title: 'Introduction / Overview',
    level: 1,
    text: '',
    paragraphs: 0,
  };

  const childNodes = Array.from(body.children);
  if (childNodes.length === 0) {
    const plain = body.textContent || '';
    const words = plain.trim() ? plain.trim().split(/\s+/).filter(Boolean).length : 0;
    return [{
      id: 'sec-0',
      title: 'Full Document',
      level: 1,
      wordCount: words,
      characterCount: plain.length,
      paragraphCount: 1,
      percentage: 100,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    }];
  }

  let foundHeading = false;
  for (const child of childNodes) {
    const tag = child.tagName.toLowerCase();
    if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
      foundHeading = true;
      if (currentSection.text.trim() || currentSection.title !== 'Introduction / Overview') {
        rawSections.push({ ...currentSection });
      }
      const level = parseInt(tag.replace('h', ''), 10) || 1;
      currentSection = {
        title: child.textContent?.trim() || `Section (${tag.toUpperCase()})`,
        level,
        text: '',
        paragraphs: 0,
      };
    } else {
      currentSection.text += ' ' + (child.textContent || '');
      currentSection.paragraphs += 1;
    }
  }
  rawSections.push({ ...currentSection });

  // If no headings found at all
  if (!foundHeading && rawSections.length === 1) {
    rawSections[0].title = 'Main Body';
  }

  // Filter out leading empty introduction if document starts with a heading
  const filtered = rawSections.filter((s, idx) => {
    if (idx === 0 && s.title === 'Introduction / Overview' && !s.text.trim() && rawSections.length > 1) {
      return false;
    }
    return true;
  });

  const totalWords = filtered.reduce((sum, s) => {
    const w = s.text.trim() ? s.text.trim().split(/\s+/).filter(Boolean).length : 0;
    return sum + w;
  }, 0) || 1;

  return filtered.map((s, idx) => {
    const words = s.text.trim() ? s.text.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = s.text.trim().length;
    const pct = Math.round((words / totalWords) * 100);
    return {
      id: `sec-${idx}`,
      title: s.title || `Section ${idx + 1}`,
      level: s.level,
      wordCount: words,
      characterCount: chars,
      paragraphCount: Math.max(1, s.paragraphs),
      percentage: pct,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    };
  });
}
