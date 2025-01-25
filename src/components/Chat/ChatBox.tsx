import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { FileUpload } from "../FileUpload";
import { config } from "../../lib/config";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ChatFileUpload } from "./ChatFileUpload";
import { database } from "../../lib/database";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface ChatBoxProps {
  selectedPupilId: string;
  onReportGenerated: (reportId: string) => void;
}

interface SuggestionBox {
  title: string;
  prompt: string;
}

function SuggestionTooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const delay = {
    open: 400,
    close: 200, // small delay before closing to prevent flickering
  };

  const hover = useHover(context, {
    delay,
    move: false, // Disable moving to prevent unwanted triggers
    handleClose: null, // Use default close handling
  });

  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 max-w-md p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {content}
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <div className="relative group">
      <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
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

export function ChatBox({ selectedPupilId, onReportGenerated }: ChatBoxProps) {
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
  const isFirstLoad = useRef(true);

  // Scroll to bottom when new messages arrive, but not on initial load
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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

        const formattedMessages = data.map((item) => ({
          id: crypto.randomUUID(),
          content: item.message.content,
          isUser: item.message.type === "human",
        }));

        setMessages(formattedMessages);
        // Get initial suggestions based on loaded history
        updateSuggestions(formattedMessages);
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

      const response = await fetch(
        "https://arani.app.n8n.cloud/webhook/8368aa31-c332-4dd1-99b9-83c36cb432bc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: lastMessages,
            pupilId: selectedPupilId,
            teacherId: user?.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get suggestions");

      const data = await response.json();
      setSuggestions(data.output || []);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      // Don't show error toast as this is a background operation
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

    if (!selectedPupilId) {
      toast.error("Please select a student first");
      return;
    }

    const content = currentPrompt.trim();
    if (!content) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    setCurrentPrompt("");

    try {
      if (pendingFiles.length > 0) {
        // Handle file analysis workflow
        if (!reportTitle.trim()) {
          toast.error("Please enter a title for the report");
          setIsProcessing(false);
          return;
        }

        // Add immediate response message for file analysis
        const processingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "I'm analyzing the files you've sent. You'll receive a notification when the report is ready. Feel free to continue chatting or switch to other tabs - I'll let you know when the analysis is complete.",
          isUser: false,
        };
        setMessages((prev) => [...prev, processingMessage]);

        // Call file analysis webhook
        const response = await fetch(config.n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pupilId: selectedPupilId,
            teacherId: user?.id,
            imageUrls: pendingFiles.map((f) => f.url),
            reportTitle: reportTitle.trim(),
            timestamp: Date.now(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process files");
        }

        const data = await response.json();
        onReportGenerated(
          data.reportId || "013eee03-6226-470d-ae9b-f9fe0a8948cd"
        );
        setPendingFiles([]);
        setReportTitle("");

        // Add report ready message
        const reportReadyMessage: Message = {
          id: (Date.now() + 2).toString(),
          content:
            "Great news! The report is ready. You can view it in the Reports tab.",
          isUser: false,
        };
        setMessages((prev) => [...prev, reportReadyMessage]);
        // Update suggestions with new messages
        updateSuggestions([...messages, userMessage, reportReadyMessage]);

        toast(
          (t) => (
            <div className="flex items-start gap-4">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="font-medium text-base mb-1">Report Ready!</h3>
                <p className="text-sm text-gray-600">
                  Your analysis report has been generated and is now available
                  in the Reports tab.
                </p>
              </div>
            </div>
          ),
          {
            duration: 6000,
            style: {
              minWidth: "360px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
            },
          }
        );

        // Store the user's message in the database
        await database.chat.insertMessage({
          content: content,
          type: "human",
          session_id: selectedPupilId,
          teacher_id: user!.id,
        });

        // After getting the AI response, store that too
        await database.chat.insertMessage({
          content: data.output,
          type: "ai",
          session_id: selectedPupilId,
          teacher_id: user!.id,
        });
      } else {
        // Add typing indicator
        const typingMessage: Message = {
          id: "typing",
          content: "...",
          isUser: false,
        };
        setMessages((prev) => [...prev, typingMessage]);

        // Handle interactive chat
        const chatResponse = await fetch(config.chatWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message: content,
            pupilId: selectedPupilId,
            teacherId: user?.id,
            timestamp: Date.now(),
          }),
        });

        if (!chatResponse.ok) {
          console.error("Chat response not OK:", {
            status: chatResponse.status,
            statusText: chatResponse.statusText,
          });
          throw new Error(`Chat request failed: ${chatResponse.statusText}`);
        }

        const chatData = await chatResponse.json();

        if (!chatData || typeof chatData.output !== "string") {
          throw new Error("Invalid response format from chat service");
        }

        // Remove typing indicator and add AI response
        setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: chatData.output,
          isUser: false,
        };
        const updatedMessages = [
          ...messages.filter((msg) => msg.id !== "typing"),
          userMessage,
          aiMessage,
        ];
        setMessages(updatedMessages);
        // Update suggestions with new messages
        updateSuggestions(updatedMessages);

        // Store the user's message in the database
        await database.chat.insertMessage({
          content: content,
          type: "human",
          session_id: selectedPupilId,
          teacher_id: user!.id,
        });

        // After getting the AI response, store that too
        await database.chat.insertMessage({
          content: chatData.output,
          type: "ai",
          session_id: selectedPupilId,
          teacher_id: user!.id,
        });
      }
    } catch (error) {
      console.error("Processing error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);

      // Remove typing indicator if present
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but there was an error processing your message. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="w-1/3 space-y-6">
          {/* File Upload Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-medium text-gray-900">
                Correction of Handwritten Exercises
              </h3>
              <InfoTooltip content="Upload pictures of handwritten exam answers to receive a detailed correction report. The analysis will highlight mistakes, identify misunderstood concepts, and provide targeted resources and training exercises for improvement." />
            </div>

            <ChatFileUpload
              selectedPupilId={selectedPupilId}
              onUploadComplete={handleFilesUploaded}
              setIsUploading={setIsUploading}
            />
            {/* ... rest of file upload UI ... */}
          </div>

          {/* Suggestions Section */}
          <div>{/* ... keep suggestions section ... */}</div>
        </div>

        {/* Chat Section - Updated with conditional height */}
        <div
          className={`flex-1 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
            messages.length === 0 ? "h-min" : "h-[500px]"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    : "No messages yet. Start a conversation!"}
                </p>
              </div>
            ) : (
              messages.map((message) =>
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
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-gray-50 border border-gray-100 shadow-sm"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          message.isUser ? "text-white" : "text-gray-800"
                        } whitespace-pre-wrap`}
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                )
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section - Updated Styling */}
          <div className="border-t border-gray-100 bg-white p-4">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder={
                    !selectedPupilId
                      ? "Select a student before sending a message"
                      : "Type your message..."
                  }
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-400"
                  disabled={
                    isProcessing ||
                    isLoadingHistory ||
                    !selectedPupilId ||
                    isUploading
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
                  className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
    </div>
  );
}
