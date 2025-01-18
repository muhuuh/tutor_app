import React, { useRef, useEffect } from 'react';

interface Message {
  content: string;
  isUser: boolean;
  id?: string;
}

interface ChatBoxProps {
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  isSendingMessage: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  height: number;
  onResize: (e: React.MouseEvent) => void;
  isCreatingNew: boolean;
  mode: 'edit' | 'correction';
}

export function ChatBox({
  messages,
  message,
  setMessage,
  isSendingMessage,
  onSendMessage,
  height,
  onResize,
  isCreatingNew,
  mode,
}: ChatBoxProps) {
  const chatResizeRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className="mt-8 border-t pt-4"
      style={{ height }}
    >
      <div 
        ref={chatResizeRef}
        className="h-2 w-full cursor-ns-resize bg-gray-100 hover:bg-gray-200 transition-colors mb-2"
        onMouseDown={onResize}
      />
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                {'id' in msg ? (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={onSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isCreatingNew
                  ? "Describe the exam you'd like to create..."
                  : mode === 'correction'
                  ? "Ask about the correction..."
                  : "Ask about this exam..."
              }
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isSendingMessage}
            />
            <button
              type="submit"
              disabled={isSendingMessage}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSendingMessage ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}