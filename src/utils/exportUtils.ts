import { Editor } from '@tiptap/react';
import { PageLayoutSettings, DocumentMetadata } from '../types/document';
export { exportAsDocx } from './docxExport';

/**
 * Downloads a file to the user's computer
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Export editor content as clean plain text (.txt)
 */
export function exportAsTxt(editor: Editor | null, title: string) {
  if (!editor) return;
  const text = editor.getText();
  const safeFilename = `${title.trim() || 'document'}.txt`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, text, 'text/plain;charset=utf-8');
}

/**
 * Export editor content as a self-contained HTML file (.html)
 */
export function exportAsHtml(editor: Editor | null, title: string, layout?: PageLayoutSettings) {
  if (!editor) return;
  const bodyHtml = editor.getHTML();
  const safeTitle = title.trim() || 'Untitled Document';
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.65;
      color: #000000;
      max-width: ${layout?.isLandscape ? '1000px' : '800px'};
      margin: 40px auto;
      padding: 0 32px;
      background-color: ${layout?.pageColor || '#ffffff'};
    }
    h1 { font-size: 2rem; color: #000000; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 700; }
    h2 { font-size: 1.5rem; color: #000000; margin-top: 1.25rem; margin-bottom: 0.5rem; font-weight: 600; }
    h3 { font-size: 1.25rem; color: #171717; margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600; }
    p { margin-bottom: 0.75rem; }
    ul, ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
    li { margin-bottom: 0.25rem; }
    blockquote { border-left: 3px solid #000000; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #262626; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 1.5rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; }
    th, td { border: 1px solid #d4d4d8; padding: 8px 12px; text-align: left; }
    th { background-color: #f4f4f5; font-weight: 600; }
    code { background-color: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
  const safeFilename = `${safeTitle}.html`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, fullHtml, 'text/html;charset=utf-8');
}

/**
 * Export document as Microsoft Word compatible file (.doc / .docx)
 */
export function exportAsWordDoc(editor: Editor | null, title: string) {
  if (!editor) return;
  const bodyHtml = editor.getHTML();
  const safeTitle = title.trim() || 'Untitled Document';
  const wordDocumentHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${safeTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, 'Plus Jakarta Sans', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; }
    h1 { font-size: 20pt; font-weight: bold; color: #000000; margin-top: 18pt; margin-bottom: 6pt; }
    h2 { font-size: 15pt; font-weight: bold; color: #000000; margin-top: 14pt; margin-bottom: 4pt; }
    h3 { font-size: 12pt; font-weight: bold; color: #171717; margin-top: 10pt; margin-bottom: 3pt; }
    p { margin-bottom: 6pt; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: 1pt solid #cbd5e1; padding: 6pt 8pt; }
    th { background-color: #f1f5f9; font-weight: bold; }
    blockquote { border-left: 3pt solid #000000; padding-left: 10pt; font-style: italic; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
  const safeFilename = `${safeTitle}.doc`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, wordDocumentHtml, 'application/msword;charset=utf-8');
}

/**
 * Basic Markdown export from TipTap HTML
 */
export function exportAsMarkdown(editor: Editor | null, title: string) {
  if (!editor) return;
  const html = editor.getHTML();
  const md = html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  const safeFilename = `${title.trim() || 'document'}.md`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, md.trim() + '\n', 'text/markdown;charset=utf-8');
}

/**
 * Export as Rich Text Format (.rtf)
 */
export function exportAsRtf(editor: Editor | null, title: string) {
  if (!editor) return;
  const plainText = editor.getText();
  // Basic standard 7-bit ASCII RTF document envelope
  const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}\n\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs22 ${plainText.replace(/\n/g, '\\par\n')}\n}`;
  const safeFilename = `${title.trim() || 'document'}.rtf`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, rtf, 'application/rtf;charset=utf-8');
}

/**
 * Export complete Document Bundle as JSON (.json) for sharing & backup
 */
export function exportAsJson(documentBundle: any, title: string) {
  const jsonStr = JSON.stringify(documentBundle, null, 2);
  const safeFilename = `${title.trim() || 'document'}.doceditor.json`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, jsonStr, 'application/json;charset=utf-8');
}

/**
 * Export as EPUB eBook (.epub HTML wrapper)
 */
export function exportAsEpub(editor: Editor | null, title: string) {
  if (!editor) return;
  const bodyHtml = editor.getHTML();
  const safeTitle = title.trim() || 'Untitled eBook';
  const epubHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${safeTitle}</title>
  <style>
    body { font-family: serif; font-size: 1.1em; line-height: 1.6; margin: 5%; color: #000; }
    h1 { text-align: center; margin-bottom: 2em; }
    p { text-indent: 1.5em; margin: 0; margin-bottom: 0.5em; }
    blockquote { font-style: italic; margin-left: 2em; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
  const safeFilename = `${safeTitle}.epub.html`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
  downloadFile(safeFilename, epubHtml, 'application/xhtml+xml;charset=utf-8');
}
