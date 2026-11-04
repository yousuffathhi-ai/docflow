import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { Editor } from '@tiptap/react';

/**
 * Strips leading '#' from hex colors and validates for docx (which requires 6-char hex).
 */
function cleanHexColor(colorStr?: string): string | undefined {
  if (!colorStr) return undefined;
  const cleaned = colorStr.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    // Expand 3-char hex to 6-char
    return cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return undefined;
}

/**
 * Extracts clean font family name from CSS font-family string.
 */
function cleanFontFamily(fontStr?: string): string | undefined {
  if (!fontStr) return undefined;
  const first = fontStr.split(',')[0].replace(/['"]/g, '').trim();
  return first || undefined;
}

/**
 * Parses font size string (e.g. '12pt', '16px') to docx half-points.
 * 12pt = 24 half-points.
 */
function parseFontSizeToHalfPoints(sizeStr?: string): number | undefined {
  if (!sizeStr) return undefined;
  const num = parseFloat(sizeStr);
  if (isNaN(num)) return undefined;
  if (sizeStr.includes('px')) {
    // 1px approx 0.75pt -> half-points = px * 1.5
    return Math.round(num * 1.5);
  }
  // Default is pt
  return Math.round(num * 2);
}

/**
 * Converts TipTap JSON node marks into docx TextRun options.
 */
function convertMarksToTextRun(node: any): TextRun {
  const text = node.text || '';
  const marks = node.marks || [];

  let bold = false;
  let italics = false;
  let underline: { type: typeof UnderlineType.SINGLE } | undefined = undefined;
  let strike = false;
  let subScript = false;
  let superScript = false;
  let color: string | undefined = undefined;
  let font: string | undefined = undefined;
  let size: number | undefined = undefined;

  for (const mark of marks) {
    if (mark.type === 'bold') bold = true;
    if (mark.type === 'italic') italics = true;
    if (mark.type === 'underline') underline = { type: UnderlineType.SINGLE };
    if (mark.type === 'strike') strike = true;
    if (mark.type === 'subscript') subScript = true;
    if (mark.type === 'superscript') superScript = true;

    if (mark.type === 'textStyle') {
      if (mark.attrs?.color) {
        color = cleanHexColor(mark.attrs.color);
      }
      if (mark.attrs?.fontFamily) {
        font = cleanFontFamily(mark.attrs.fontFamily);
      }
      if (mark.attrs?.fontSize) {
        size = parseFontSizeToHalfPoints(mark.attrs.fontSize);
      }
    }
  }

  return new TextRun({
    text,
    bold,
    italics,
    underline,
    strike,
    subScript,
    superScript,
    color,
    font,
    size,
  });
}

/**
 * Converts TipTap children nodes (in paragraph or heading) into docx TextRuns.
 */
function convertInlineChildren(children?: any[]): TextRun[] {
  if (!children || children.length === 0) {
    return [new TextRun('')];
  }

  const runs: TextRun[] = [];
  for (const child of children) {
    if (child.type === 'text') {
      runs.push(convertMarksToTextRun(child));
    } else if (child.type === 'hardBreak') {
      runs.push(new TextRun({ break: 1 }));
    } else if (child.type === 'image') {
      runs.push(new TextRun({ text: `[Image: ${child.attrs?.title || child.attrs?.alt || 'Picture'}]` }));
    }
  }
  return runs.length > 0 ? runs : [new TextRun('')];
}

/**
 * Maps alignment attribute to docx AlignmentType.
 */
function getAlignment(textAlign?: string): typeof AlignmentType[keyof typeof AlignmentType] {
  switch (textAlign) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}

/**
 * Converts a TipTap AST node into docx Document elements (Paragraphs, Tables).
 */
function convertNodeToDocxElements(node: any): (Paragraph | Table)[] {
  switch (node.type) {
    case 'paragraph': {
      const alignment = getAlignment(node.attrs?.textAlign);
      const runs = convertInlineChildren(node.content);
      return [
        new Paragraph({
          children: runs,
          alignment,
          spacing: { after: 120, line: 276 },
        }),
      ];
    }

    case 'heading': {
      const level = node.attrs?.level || 1;
      let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1;
      let fontSizeHalfPoints = 40; // 20pt

      if (level === 2) {
        headingLevel = HeadingLevel.HEADING_2;
        fontSizeHalfPoints = 30; // 15pt
      } else if (level === 3) {
        headingLevel = HeadingLevel.HEADING_3;
        fontSizeHalfPoints = 24; // 12pt
      }

      const alignment = getAlignment(node.attrs?.textAlign);
      const runs = convertInlineChildren(node.content).map((r) => {
        // Ensure headings are bold
        return new TextRun({
          text: (r as any).text || '',
          bold: true,
          size: fontSizeHalfPoints,
          color: '000000',
        });
      });

      return [
        new Paragraph({
          heading: headingLevel,
          children: runs,
          alignment,
          spacing: { before: 240, after: 120 },
        }),
      ];
    }

    case 'bulletList': {
      const items: Paragraph[] = [];
      if (node.content) {
        for (const listItem of node.content) {
          if (listItem.content) {
            for (const childNode of listItem.content) {
              const runs = convertInlineChildren(childNode.content);
              items.push(
                new Paragraph({
                  children: runs,
                  bullet: { level: 0 },
                  spacing: { after: 60 },
                })
              );
            }
          }
        }
      }
      return items;
    }

    case 'orderedList': {
      const items: Paragraph[] = [];
      let index = 1;
      if (node.content) {
        for (const listItem of node.content) {
          if (listItem.content) {
            for (const childNode of listItem.content) {
              const runs = convertInlineChildren(childNode.content);
              items.push(
                new Paragraph({
                  children: [new TextRun({ text: `${index}. `, bold: true }), ...runs],
                  spacing: { after: 60 },
                })
              );
            }
          }
          index++;
        }
      }
      return items;
    }

    case 'blockquote': {
      const items: Paragraph[] = [];
      if (node.content) {
        for (const childNode of node.content) {
          const runs = convertInlineChildren(childNode.content).map((r) => {
            return new TextRun({
              text: (r as any).text || '',
              italics: true,
              color: '3F3F46',
            });
          });
          items.push(
            new Paragraph({
              children: runs,
              indent: { left: 720 },
              spacing: { before: 120, after: 120 },
            })
          );
        }
      }
      return items;
    }

    case 'table': {
      const rows: TableRow[] = [];
      if (node.content) {
        for (const tr of node.content) {
          const cells: TableCell[] = [];
          if (tr.content) {
            for (const cell of tr.content) {
              const cellParagraphs: Paragraph[] = [];
              if (cell.content && cell.content.length > 0) {
                for (const cellChild of cell.content) {
                  const runs = convertInlineChildren(cellChild.content);
                  cellParagraphs.push(
                    new Paragraph({
                      children: runs,
                      spacing: { after: 60 },
                    })
                  );
                }
              } else {
                cellParagraphs.push(new Paragraph({ children: [new TextRun('')] }));
              }

              const isHeader = cell.type === 'tableHeader';
              cells.push(
                new TableCell({
                  children: cellParagraphs,
                  shading: isHeader ? { fill: 'F4F4F5' } : undefined,
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: 'D4D4D8' },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D4D4D8' },
                    left: { style: BorderStyle.SINGLE, size: 1, color: 'D4D4D8' },
                    right: { style: BorderStyle.SINGLE, size: 1, color: 'D4D4D8' },
                  },
                })
              );
            }
          }
          rows.push(new TableRow({ children: cells }));
        }
      }

      return [
        new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
        new Paragraph({ spacing: { after: 120 } }),
      ];
    }

    case 'horizontalRule': {
      return [
        new Paragraph({
          children: [new TextRun('____________________________________________________')],
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
        }),
      ];
    }

    default:
      // For any unhandled block, if it has content, attempt inline conversion
      if (node.content) {
        const elements: (Paragraph | Table)[] = [];
        for (const child of node.content) {
          elements.push(...convertNodeToDocxElements(child));
        }
        return elements;
      }
      return [];
  }
}

/**
 * Generates and downloads a real .docx file from TipTap editor content using the 'docx' library.
 */
export async function exportAsDocx(editor: Editor | null, title: string): Promise<boolean> {
  if (!editor) return false;

  try {
    const json = editor.getJSON();
    const childrenElements: (Paragraph | Table)[] = [];

    if (json.content && json.content.length > 0) {
      for (const node of json.content) {
        childrenElements.push(...convertNodeToDocxElements(node));
      }
    } else {
      childrenElements.push(new Paragraph({ children: [new TextRun('Empty Document')] }));
    }

    const doc = new Document({
      title: title || 'Document',
      creator: 'DocEditor Web Word Processor',
      description: 'Created with DocEditor Word Processor',
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 22, // 11pt
              color: '000000',
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: childrenElements,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const safeTitle = (title.trim() || 'Document').replace(/[^a-zA-Z0-9-_\.]/g, '_');
    const filename = `${safeTitle}.docx`;

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to export .docx with docx library:', error);
    return false;
  }
}
