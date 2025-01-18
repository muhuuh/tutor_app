import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FileUpload } from '../FileUpload';
import { config } from '../../lib/config';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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

export function ChatBox({ selectedPupilId, onReportGenerated }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ path: string; url: string }[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionBox[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when pupil is selected
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!selectedPupilId) {
        setMessages([]);
        return;
      }

      setIsLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('message')
          .eq('session_id', selectedPupilId)
          .order('id', { ascending: true });

        if (error) throw error;

        const formattedMessages = data.map((item) => ({
          id: crypto.randomUUID(),
          content: item.message.content,
          isUser: item.message.type === 'human'
        }));

        setMessages(formattedMessages);
        // Get initial suggestions based on loaded history
        updateSuggestions(formattedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast.error('Failed to load chat history');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [selectedPupilId]);

  const updateSuggestions = async (currentMessages: Message[]) => {
    if (!selectedPupilId || currentMessages.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Get last 10 messages
      const lastMessages = currentMessages.slice(-10).map(msg => ({
        content: msg.content,
        isUser: msg.isUser
      }));

      const response = await fetch('https://arani.app.n8n.cloud/webhook/8368aa31-c332-4dd1-99b9-83c36cb432bc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: lastMessages,
          pupilId: selectedPupilId,
          teacherId: user?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const data = await response.json();
      setSuggestions(data.output || []);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      // Don't show error toast as this is a background operation
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleFilesUploaded = (files: { path: string; url: string }[]) => {
    setPendingFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added to queue`);
  };

  const handleSuggestionClick = (prompt: string) => {
    setCurrentPrompt(prompt);
    if (inputRef.current) {
      inputRef.current.value = prompt;
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedPupilId) {
      toast.error('Please select a student first');
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setCurrentPrompt('');

    try {
      if (pendingFiles.length > 0) {
        // Handle file analysis workflow
        if (!reportTitle.trim()) {
          toast.error('Please enter a title for the report');
          setIsProcessing(false);
          return;
        }

        // Add immediate response message for file analysis
        const processingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm analyzing the files you've sent. You'll receive a notification when the report is ready. Feel free to continue chatting or switch to other tabs - I'll let you know when the analysis is complete.",
          isUser: false,
        };
        setMessages(prev => [...prev, processingMessage]);

        // Call file analysis webhook
        const response = await fetch(config.n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pupilId: selectedPupilId,
            teacherId: user?.id,
            imageUrls: pendingFiles.map(f => f.url),
            reportTitle: reportTitle.trim(),
            timestamp: Date.now(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process files');
        }

        const data = await response.json();
        onReportGenerated(data.reportId || '013eee03-6226-470d-ae9b-f9fe0a8948cd');
        setPendingFiles([]);
        setReportTitle('');

        // Add report ready message
        const reportReadyMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "Great news! The report is ready. You can view it in the Reports tab.",
          isUser: false,
        };
        setMessages(prev => [...prev, reportReadyMessage]);
        // Update suggestions with new messages
        updateSuggestions([...messages, userMessage, reportReadyMessage]);
        
        toast((t) => (
          <div className="flex items-start gap-4">
            <div className="text-2xl">📋</div>
            <div>
              <h3 className="font-medium text-base mb-1">Report Ready!</h3>
              <p className="text-sm text-gray-600">
                Your analysis report has been generated and is now available in the Reports tab.
              </p>
            </div>
          </div>
        ), {
          duration: 6000,
          style: {
            minWidth: '360px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
          },
        });
      } else {
        // Add typing indicator
        const typingMessage: Message = {
          id: 'typing',
          content: '...',
          isUser: false,
        };
        setMessages(prev => [...prev, typingMessage]);

        // Handle interactive chat
        const chatResponse = await fetch('https://arani.app.n8n.cloud/webhook/e505d62b-76a4-43d8-a461-187f7d6dc312/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: content,
            pupilId: selectedPupilId,
            teacherId: user?.id
          })
        });

        if (!chatResponse.ok) {
          console.error('Chat response not OK:', {
            status: chatResponse.status,
            statusText: chatResponse.statusText
          });
          throw new Error(`Chat request failed: ${chatResponse.statusText}`);
        }

        const chatData = await chatResponse.json();

        if (!chatData || typeof chatData.output !== 'string') {
          throw new Error('Invalid response format from chat service');
        }

        // Remove typing indicator and add AI response
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: chatData.output,
          isUser: false,
        };
        const updatedMessages = [...messages.filter(msg => msg.id !== 'typing'), userMessage, aiMessage];
        setMessages(updatedMessages);
        // Update suggestions with new messages
        updateSuggestions(updatedMessages);
      }
    } catch (error) {
      console.error('Processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      
      // Remove typing indicator if present
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but there was an error processing your message. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorChatMessage]);
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Correction of Handwritten Exercises
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload pictures of handwritten exam answers to receive a detailed correction report. 
              The analysis will highlight mistakes, identify misunderstood concepts, and provide 
              targeted resources and training exercises for improvement.
            </p>
            <FileUpload 
              selectedPupilId={selectedPupilId}
              onUploadComplete={handleFilesUploaded}
              showPupilSelect={false}
            />
            {pendingFiles.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-700 font-medium">
                    {pendingFiles.length} file(s) ready to process
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Please enter a title and send a message to start analysis
                  </p>
                </div>
                <div>
                  <label htmlFor="reportTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title
                  </label>
                  <input
                    type="text"
                    id="reportTitle"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter a title for this report"
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chat Suggestions Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Suggestions How to Continue
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your conversation, here are some suggested questions and topics 
              you might want to explore with the AI assistant.
            </p>
            {isLoadingSuggestions ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.content)}
                    className="w-full p-4 text-left rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {suggestion.prompt}
                    </p>
                  </button>
                ))}
              </div>
            ) : messages.length > 0 ? (
              <div className="text-center py-4 text-gray-500">
                Loading suggestions...
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col h-[500px] rounded-lg border border-gray-200 bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">Loading chat history...</p>
                </div>
              </div>
            ) : (
              messages.map(message => 
                message.id === 'typing' ? (
                  <div key="typing" className="flex justify-start mb-4">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    isUser={message.isUser}
                  />
                )
              )
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4">
            <ChatInput 
              onSend={handleSendMessage} 
              disabled={isProcessing || isLoadingHistory}
              ref={inputRef}
              initialValue={currentPrompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}