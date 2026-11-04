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
