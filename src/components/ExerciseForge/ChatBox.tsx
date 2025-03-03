import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { processContent } from "./ExamEditor";
import { useTranslation } from "react-i18next";

interface Message {
  content: string;
  isUser: boolean;
  id?: string;
  timestamp?: Date;
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
  const { t } = useTranslation();
  const chatResizeRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-col bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all"
      style={{ height: messages.length > 0 ? height : "auto" }}
    >
      {messages.length > 0 && (
        <>
          <div
            ref={chatResizeRef}
            className="h-3 sm:h-2 w-full cursor-ns-resize bg-gray-100/50 hover:bg-gray-200/50 transition-colors group relative"
            onMouseDown={onResize}
            aria-label={t("exerciseChatBox.resizingHandleLabel")}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
              <div className="h-1 w-12 bg-gray-300/50 rounded-full group-hover:bg-gray-400/50 transition-colors" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
                    msg.isUser
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                      : "bg-gray-50/80 backdrop-blur-sm border border-gray-100 shadow-sm"
                  }`}
                >
                  {"id" in msg ? (
                    <div className="flex gap-1.5 sm:gap-2 py-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div
                        className={`prose prose-sm ${
                          msg.isUser ? "prose-invert" : ""
                        } max-w-none [&>p]:text-sm [&>p]:leading-relaxed`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => {
                              return <p className="my-1">{children}</p>;
                            },
                          }}
                        >
                          {processContent(msg.content)}
                        </ReactMarkdown>
                      </div>
                      {msg.timestamp && (
                        <div className="mt-1.5 sm:mt-2 flex justify-end">
                          <span
                            className={`text-[10px] sm:text-xs ${
                              msg.isUser ? "text-white/70" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString(
                              t("exerciseChatBox.timestampFormat"),
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </>
      )}

      <form
        onSubmit={onSendMessage}
        className="border-t border-gray-100 bg-white/50 backdrop-blur-sm p-3 sm:p-4"
      >
        <div className="flex gap-2 sm:gap-3 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isCreatingNew
                ? t("exerciseChatBox.placeholderNewExam")
                : mode === "correction"
                ? t("exerciseChatBox.placeholderCorrection")
                : t("exerciseChatBox.placeholderEdit")
            }
            className="flex-1 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none transition-all disabled:opacity-50"
            disabled={isSendingMessage}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSendingMessage}
            className="flex-shrink-0 flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            aria-label={t("exerciseChatBox.sendButtonAria")}
          >
            {isSendingMessage ? (
              <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
