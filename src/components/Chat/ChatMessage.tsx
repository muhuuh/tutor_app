import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 border border-gray-200 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}