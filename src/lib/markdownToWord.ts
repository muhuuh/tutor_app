import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import katex from "katex";

function convertLatexToMathML(
  latex: string,
  options: { display: "block" | "inline" } = { display: "inline" }
): string {
  try {
    return katex.renderToString(latex, {
      output: "mathml",
      displayMode: options.display === "block",
      throwOnError: false,
      strict: false,
    });
  } catch (error) {
    console.error("Error converting LaTeX to MathML:", error);
    return latex; // Return original latex if conversion fails
  }
}

export async function convertMarkdownToWord(
  markdown: string,
  title: string
): Promise<Blob> {
  try {
    const lines = markdown.split("\n");
    const paragraphs = [];

    // Helper function to check if text contains LaTeX
    const containsLatex = (text: string) => {
      return text.includes("\\[") || text.includes("\\(") || text.includes("$");
    };

    // Helper function to process LaTeX content
    const processLatex = (text: string) => {
      // Handle display math mode \[ ... \]
      text = text.replace(/\\\[(.*?)\\\]/g, (match, latex) => {
        return convertLatexToMathML(latex, { display: "block" });
      });

      // Handle inline math mode \( ... \) or $ ... $
      text = text.replace(
        /\\\((.*?)\\\)|\$(.*?)\$/g,
        (match, latex1, latex2) => {
          const latex = latex1 || latex2;
          return convertLatexToMathML(latex, { display: "inline" });
        }
      );

      return text;
    };

    for (const line of lines) {
      if (!line.trim()) {
        paragraphs.push(new Paragraph({ text: "" }));
        continue;
      }

      if (containsLatex(line)) {
        // Process line with LaTeX content
        const processedLine = processLatex(line);
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: processedLine,
                math: {
                  type: "ooxml", // Use Office Open XML math format
                },
              }),
            ],
          })
        );
        continue;
      }

      // Handle headings
      if (line.startsWith("#")) {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s/, "");
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
        const text = line.replace(/^[-*]\s/, "");
        paragraphs.push(
          new Paragraph({
            text,
            bullet: {
              level: 0,
            },
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
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate blob
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    console.error("Error converting Markdown to Word:", error);
    throw new Error("Failed to convert document to Word format");
  }
}

export function downloadWordDocument(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
