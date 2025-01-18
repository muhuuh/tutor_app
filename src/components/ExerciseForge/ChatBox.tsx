import React, { useRef, useEffect } from "react";

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
  mode: "edit" | "correction";
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="mt-8 bg-gray-50 rounded-lg shadow-sm"
      style={{ height: messages.length > 0 ? height : "auto" }}
    >
      {messages.length > 0 && (
        <>
          <div
            ref={chatResizeRef}
            className="h-1 w-full cursor-ns-resize bg-gray-200 hover:bg-gray-300 transition-colors rounded-t-lg"
            onMouseDown={onResize}
          />
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[100px] border border-gray-200 m-3 rounded-lg bg-white">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                      msg.isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    {"id" in msg ? (
                      <div className="flex gap-1 py-2">
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </>
      )}
      <form
        onSubmit={onSendMessage}
        className={`pb-3 bg-white ${
          messages.length > 0 ? "border-t border-gray-100" : ""
        } rounded-lg`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isCreatingNew
                ? "Describe the exam you'd like to create..."
                : mode === "correction"
                ? "Ask about the correction..."
                : "Ask AI anything about this exam, how to improve it for a specific usecase, etc..."
            }
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-50"
            disabled={isSendingMessage}
          />
          <button
            type="submit"
            disabled={isSendingMessage}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSendingMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
