export interface Section {
  title: string;
  content: string;
}

export function parseMarkdownSections(markdown: string): Section[] {
  // Split the markdown into lines
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line starts with ##
    if (line.startsWith("## ")) {
      // If we have a current section, save it
      if (currentSection) {
        currentSection.content = currentContent.join("\n");
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        title: line.replace("## ", ""),
        content: "",
      };
      currentContent = [];
    } else if (currentSection) {
      // Add line to current section content
      currentContent.push(line);
    }
  }

  // Don't forget to add the last section
  if (currentSection) {
    currentSection.content = currentContent.join("\n");
    sections.push(currentSection);
  }

  return sections;
}
