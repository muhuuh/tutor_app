import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function convertMarkdownToWord(markdown: string, title: string): Promise<Blob> {
  try {
    // Split markdown into lines
    const lines = markdown.split('\n');
    const paragraphs = [];

    // Convert markdown lines to docx paragraphs
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) {
        paragraphs.push(new Paragraph({ text: '' }));
        continue;
      }

      // Handle headings
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s/, '');
        paragraphs.push(
          new Paragraph({
            text,
            heading: HeadingLevel[`HEADING_${level}`],
          })
        );
        continue;
      }

      // Handle lists
      if (line.match(/^[-*]\s/)) {
        const text = line.replace(/^[-*]\s/, '');
        paragraphs.push(
          new Paragraph({
            text,
            bullet: {
              level: 0
            }
          })
        );
        continue;
      }

      // Regular paragraph
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
            }),
          ],
        })
      );
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }],
    });

    // Generate blob
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    console.error('Error converting Markdown to Word:', error);
    throw new Error('Failed to convert document to Word format');
  }
}

export function downloadWordDocument(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}