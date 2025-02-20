import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ChatFileUpload } from "./ChatFileUpload";
import { database } from "../../lib/database";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useCreditWarning } from "../../hooks/useCreditWarning";
import { CreditWarningModal } from "../UI/CreditWarningModal";
import { ReportSubmissionModal } from "../UI/ReportSubmissionModal";
import { ChatSuggestions } from "./ChatSuggestions";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  isUser: boolean;
}

interface ChatBoxProps {
  height: number;
  selectedPupilId: string;
  onReportGenerated: (reportId: string) => void;
}

interface SuggestionBox {
  title: string;
  content: string;
  prompt: string;
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <div className="relative group">
      <InformationCircleIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-500 cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        {content}
      </div>
    </div>
  );
}

const DEFAULT_SUGGESTIONS = [
  {
    title: "What do you know about this student",
    content:
      "Please tell me if you know something about this student, based on the information stored about him (report, notes, pupil info, etc).",
  },
  {
    title: "General info about my pupils",
    content:
      "Tell me more about the pupils that are currently have (how many, which class, etc) and more specifically what are the topics that seem to be the most misunderstood based on latest reports",
  },
  {
    title: "Summary of latest report",
    content:
      "Please give me a summary of the latest report and clear next steps that were defined",
  },
];

export function ChatBox({
  height,
  selectedPupilId,
  onReportGenerated,
}: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<
    { path: string; url: string }[]
  >([]);
  const [reportTitle, setReportTitle] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionBox[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    showCreditWarning,
    setShowCreditWarning,
    requiredCredits,
    handleCreditError,
  } = useCreditWarning();
  const [showReportSubmissionModal, setShowReportSubmissionModal] =
    useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when pupil is selected
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!selectedPupilId || !user?.id) {
        setMessages([]);
        return;
      }

      setIsLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("chat_history")
          .select("message")
          .eq("session_id", selectedPupilId)
          .or(`teacher_id.eq.${user.id},teacher_id.is.null`)
          .order("id", { ascending: true });

        if (error) throw error;

        const formattedMessages = data.map((item) => {
          const messageRole =
            item.message.type === "human" ? "user" : "assistant";
          return {
            id: crypto.randomUUID(),
            content: item.message.content,
            role: messageRole as "user" | "assistant",
            isUser: item.message.type === "human",
          };
        });

        setMessages(formattedMessages);
        // Get initial suggestions based on loaded history
        updateSuggestions(formattedMessages);

        // Scroll to bottom after messages are loaded
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast.error("Failed to load chat history");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [selectedPupilId, user?.id]);

  const updateSuggestions = async (currentMessages: Message[]) => {
    if (!selectedPupilId || currentMessages.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Get last 10 messages
      const lastMessages = currentMessages.slice(-10).map((msg) => ({
        content: msg.content,
        isUser: msg.isUser,
      }));

      // Use Supabase function instead of direct n8n webhook
      const { data } = await supabase.functions.invoke("suggestions", {
        body: {
          messages: lastMessages,
          pupilId: selectedPupilId,
          teacherId: user?.id,
        },
      });

      setSuggestions(data.output || []);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleFilesUploaded = (files: { path: string; url: string }[]) => {
    setPendingFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to queue`);
  };

  const handleSuggestionClick = (prompt: string) => {
    setCurrentPrompt(prompt);
    if (inputRef.current) {
      inputRef.current.value = prompt;
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleSendMessage");

    if (!selectedPupilId) {
      toast.error("Please select a student first");
      return;
    }

    const content = currentPrompt.trim();
    // Only check for content if there are no pending files
    if (!content && pendingFiles.length === 0) return;

    setIsProcessing(true);
    setCurrentPrompt("");

    // Make sure the user message is defined (avoiding null values)
    let userMessage: Message | undefined;
    if (content) {
      userMessage = {
        id: Date.now().toString(),
        content,
        role: "user",
        isUser: true,
      };
      setMessages((prev) =>
        [...prev, userMessage].filter(
          (msg): msg is Message => msg !== undefined
        )
      );
    }

    try {
      if (pendingFiles.length > 0) {
        // Show the modal immediately when files are submitted
        setShowReportSubmissionModal(true);

        // Generate Report
        const { data } = await supabase.functions.invoke("generate-report", {
          body: {
            pupilId: selectedPupilId,
            teacherId: user?.id,
            imageUrls: pendingFiles.map((f) => f.url),
            reportTitle: reportTitle.trim(),
            timestamp: Date.now(),
          },
        });

        if (
          data &&
          data.ok === false &&
          data.errorType === "subscription_error"
        ) {
          handleCreditError(data);
          setShowReportSubmissionModal(false);
          return;
        }

        // Clear the files and title immediately
        setPendingFiles([]);
        setReportTitle("");

        // We'll keep the modal visible until the user is redirected to the report
        // The redirect will happen automatically when the report is ready
        // through the existing notification system

        if (data && !data.ok === false) {
          onReportGenerated(data.reportId);
        }
      } else {
        // ---- Regular Chat Branch ----

        // Add typing indicator
        const typingMessage: Message = {
          id: "typing",
          content: "...",
          role: "assistant",
          isUser: false,
        };
        setMessages((prev) => [...prev, typingMessage]);

        // Invoke the edge function "chat" instead of using the direct webhook URL
        const { data: chatData, error: chatError } =
          await supabase.functions.invoke("chat", {
            body: {
              content: content,
              pupilId: selectedPupilId,
              teacherId: user?.id,
              timestamp: Date.now(),
            },
          });

        if (
          chatData &&
          chatData.ok === false &&
          chatData.errorType === "subscription_error"
        ) {
          handleCreditError(chatData);
          setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
          return;
        }
        if (chatError) {
          throw new Error(`Chat request failed: ${chatError.message}`);
        }
        if (!chatData || typeof chatData.output !== "string") {
          throw new Error("Invalid response format from chat service");
        }

        // Remove typing indicator and add AI response
        setMessages((prev) => {
          const newMessages = prev
            .filter((msg) => msg.id !== "typing")
            .concat({
              id: (Date.now() + 1).toString(),
              content: chatData.output,
              role: "assistant",
              isUser: false,
            });
          updateSuggestions(newMessages);
          return newMessages;
        });

        // Store the user's message in the database (if it was sent)
        if (userMessage) {
          await database.chat.insertMessage({
            content: content,
            type: "human",
            session_id: selectedPupilId,
            teacher_id: user!.id,
          });
        }
        // After getting the AI response, store that too
        await database.chat.insertMessage({
          content: chatData.output,
          type: "ai",
          session_id: selectedPupilId,
          teacher_id: user!.id,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );

      // Remove typing indicator if present
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but there was an error processing your message. Please try again.",
        role: "assistant",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Left Column - File Upload & Suggestions */}
        <div className="w-full lg:w-1/3 space-y-4 sm:space-y-8 lg:h-[800px] flex flex-col">
          {/* File Upload Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 justify-center">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900">
                  Correction of Exercises
                </h3>
                <InfoTooltip content="Upload pictures of handwritten exam answers to receive a detailed correction report." />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">
                Get instant feedback, personalized recommendations, and targeted
                exercises
              </p>
            </div>

            <ChatFileUpload
              selectedPupilId={selectedPupilId}
              onUploadComplete={handleFilesUploaded}
              setIsUploading={setIsUploading}
            />

            {pendingFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 font-medium">
                    {pendingFiles.length} file(s) ready to process
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Please enter a title for the report to continue
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    id="reportTitle"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter report title..."
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur text-sm"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Suggestions - Hidden on mobile */}
          <div className="hidden lg:block flex-1 overflow-y-auto overflow-x-hidden">
            {selectedPupilId && pendingFiles.length === 0 && (
              <ChatSuggestions
                isLoadingSuggestions={isLoadingSuggestions}
                suggestions={suggestions}
                messages={messages}
                handleSuggestionClick={handleSuggestionClick}
                DEFAULT_SUGGESTIONS={DEFAULT_SUGGESTIONS}
              />
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden max-h-[400px] lg:max-h-none lg:h-[800px]">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">
                    Loading chat history...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">
                  {!selectedPupilId
                    ? "Select a student to start chatting"
                    : pendingFiles.length > 0
                    ? ""
                    : "No messages yet. Start a conversation!"}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) =>
                  message.id === "typing" ? (
                    <div key="typing" className="flex justify-start">
                      <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
                        <div className="flex gap-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 150}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                          message.isUser
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow"
                            : "bg-gray-50/95 backdrop-blur-sm border border-gray-100 shadow"
                        }`}
                      >
                        <div
                          className={`prose prose-sm ${
                            message.isUser ? "prose-invert" : ""
                          } max-w-none`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ children }) => (
                                <p className="m-0 text-sm leading-relaxed whitespace-pre-wrap">
                                  {children}
                                </p>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="flex gap-2 sm:gap-3 items-center">
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder={
                    !selectedPupilId
                      ? "Select a student before sending a message"
                      : pendingFiles.length > 0
                      ? reportTitle.trim()
                        ? "Send files to create report"
                        : "Please enter a title to create a report"
                      : "Type your message..."
                  }
                  className="flex-1 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none transition-all disabled:opacity-50"
                  disabled={
                    isProcessing ||
                    isLoadingHistory ||
                    !selectedPupilId ||
                    isUploading ||
                    pendingFiles.length > 0
                  }
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={
                    isProcessing ||
                    isLoadingHistory ||
                    !selectedPupilId ||
                    (!currentPrompt.trim() && pendingFiles.length === 0) ||
                    (pendingFiles.length > 0 && !reportTitle.trim()) ||
                    isUploading
                  }
                  className="flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Send message"
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
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
        </div>
      </div>

      {/* Mobile Suggestions - Hidden on desktop */}
      <div className="lg:hidden overflow-x-hidden">
        {selectedPupilId && pendingFiles.length === 0 && (
          <ChatSuggestions
            isLoadingSuggestions={isLoadingSuggestions}
            suggestions={suggestions}
            messages={messages}
            handleSuggestionClick={handleSuggestionClick}
            DEFAULT_SUGGESTIONS={DEFAULT_SUGGESTIONS}
          />
        )}
      </div>

      <CreditWarningModal
        isOpen={showCreditWarning}
        onClose={() => setShowCreditWarning(false)}
        requiredCredits={requiredCredits}
      />

      <ReportSubmissionModal
        isOpen={showReportSubmissionModal}
        onClose={() => setShowReportSubmissionModal(false)}
      />
    </div>
  );
}
