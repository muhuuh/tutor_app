// import { Document } from 'docx';
import TurndownService from "turndown";
import mammoth from "mammoth";

export async function convertWordToMarkdown(
  file: File
): Promise<{ title: string; content: string }> {
  try {
    // Use mammoth to convert docx to HTML
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    // Convert HTML to markdown using Turndown
    const turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });

    // Configure Turndown to handle Word-specific elements better
    turndownService.addRule("preserveLineBreaks", {
      filter: "p",
      replacement: (content) => content + "\n\n",
    });

    const markdown = turndownService.turndown(html);

    // Use the file name (without extension) as the title
    const title =
      file.name.replace(/\.(docx|doc)$/, "").trim() || "Untitled Document";

    return {
      title,
      content: markdown,
    };
  } catch (error) {
    console.error("Error converting Word to Markdown:", error);
    throw new Error(
      "Failed to convert Word document to Markdown. Please make sure you uploaded a valid Word document."
    );
  }
}
