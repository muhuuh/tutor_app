import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Section {
  title: string;
  content: string;
}

interface CollapsibleSectionProps {
  section: Section;
  isExpanded?: boolean;
}

export function CollapsibleSection({ section }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false); // Default all sections to closed

  return (
    <div className="group relative border-b border-gray-200/50 last:border-b-0 overflow-hidden">
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full px-6 py-4 flex items-center justify-between text-left transition-all duration-300"
      >
        <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-blue-600 group-hover:to-violet-600 transition-all duration-300">
          {section.title}
        </h2>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-all duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated content section */}
      <div
        className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-700 prose-p:text-gray-600">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => (
                  <p className="my-2 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 space-y-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600">{children}</li>
                ),
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
