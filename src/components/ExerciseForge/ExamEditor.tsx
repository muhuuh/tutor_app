import { useState, useRef, useEffect, Fragment } from "react";
import type { Exam, Correction } from "../../types/database";
import {
  FiEye,
  FiDownload,
  FiSave,
  FiTrash2,
  FiMaximize,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import "katex/dist/katex.min.css";
import html2pdf from "html2pdf.js";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ExamEditorProps {
  selectedExam?: Exam | null;
  isCreatingNew: boolean;
  mode: "edit" | "correction";
  setMode: (mode: "edit" | "correction") => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  editableContent: string;
  setEditableContent: (content: string) => void;
  correction: Correction | null;
  isSendingMessage: boolean;
  isLoadingContent: boolean;
  isWaitingForCorrection: boolean;
  onDownload?: () => void;
  onCreateCorrection: () => void;
  onSave: () => void;
  onDelete: () => void;
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const processContent = (content: string) => {
  // Handle square brackets with LaTeX content
  content = content.replace(/\[(.*?)\]/g, (_, match) => `$${match}$`);

  // Convert \[ ... \] to $$ ... $$
  content = content.replace(/\\\[(.*?)\\\]/g, (_, match) => `$$${match}$$`);

  // Convert \( ... \) to $ ... $
  content = content.replace(/\\\((.*?)\\\)/g, (_, match) => `$${match}$`);

  // Handle \text{...} expressions that aren't already in math mode
  content = content.replace(/\\text\{([^}]+)\}/g, (match) => `$${match}$`);

  // Convert scientific notation (e.g., 6.674×10^-11)
  content = content.replace(
    /(\d+\.?\d*)\s*[×x]\s*10\^(-?\d+)/g,
    (_, base, exp) => `$${base} \\times 10^{${exp}}$`
  );

  // Convert simple exponential notation (e.g., 10^24)
  content = content.replace(
    /(\d+)\^(-?\d+)/g,
    (_, base, exp) => `$${base}^{${exp}}$`
  );

  // Convert units with superscripts (e.g., m²)
  content = content.replace(/([a-zA-Z])²/g, (_, unit) => `$${unit}^2$`);
  content = content.replace(/([a-zA-Z])³/g, (_, unit) => `$${unit}^3$`);

  // Convert compound units (e.g., N·m²/kg²)
  content = content.replace(/([A-Z]·[a-zA-Z²³]+\/[a-zA-Z²³]+)/g, (match) => {
    return `$\\text{${match
      .replace("·", "\\cdot ")
      .replace("²", "^2")
      .replace("³", "^3")}$`;
  });

  // Convert single capital letters that likely represent variables
  content = content.replace(/\s([A-Z])\s/g, (_, letter) => ` $${letter}$ `);

  return content;
};

export function ExamEditor({
  mode,
  setMode,
  showPreview,
  setShowPreview,
  editableContent,
  setEditableContent,
  correction,
  isSendingMessage,
  isLoadingContent,
  isWaitingForCorrection,
  onCreateCorrection,
  onSave,
  onDelete,
  title,
  onTitleChange,
  isCreatingNew = false,
}: ExamEditorProps) {
  const { t } = useTranslation();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
    }
  }, [isEditingTitle]);

  const processedContent = processContent(editableContent);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const element = previewRef.current;
      const opt = {
        margin: 20,
        filename: `${title || "exam"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("examEditor.pdfGenerationError"));
    }
  };

  const renderCorrectionSection = () => {
    if (isLoadingContent) {
      return (
        <div className="flex items-center justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      );
    }

    if (mode === "correction" && !correction) {
      if (isWaitingForCorrection) {
        return (
          <div className="flex flex-col items-center justify-center my-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-4" />
            <p className="text-gray-700 text-center">
              Creating correction... You will be notified when it's ready.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Feel free to continue working on other tasks. We'll let you know
              when the correction is complete.
            </p>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Correction Available
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Would you like to generate an AI-powered correction for this exam?
          </p>
          <button
            onClick={onCreateCorrection}
            disabled={isSendingMessage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Correction"
            )}
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="relative">
          {showPreview ? (
            // Formatted view with height constraint and scroll
            <div className="prose prose-sm max-w-none p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <FiMaximize className="w-4 h-4" />
                  Full Screen
                </button>
              </div>
              <div className="h-[500px] overflow-y-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            // Edit view
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-[500px] rounded-lg border border-gray-200 p-4 text-sm font-mono resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Start typing your exam content..."
              disabled={isLoadingContent}
            />
          )}
        </div>
      </>
    );
  };

  if (isLoadingContent && mode === "edit") {
    return (
      <div className="flex items-center justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => {
              setIsEditingTitle(false);
              if (editedTitle.trim() && editedTitle !== title) {
                onTitleChange(editedTitle.trim());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              } else if (e.key === "Escape") {
                setIsEditingTitle(false);
                setEditedTitle(title);
              }
            }}
            className="text-2xl font-semibold text-center text-gray-900 w-full max-w-2xl px-4 py-2 rounded-lg border-2 border-indigo-500 focus:outline-none  focus:ring-indigo-500 transition-all"
          />
        ) : (
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {title}
            </h2>
            <button
              onClick={() => {
                setEditedTitle(title);
                setIsEditingTitle(true);
              }}
              className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg transition-all hover:bg-indigo-50"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
        <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200 w-full sm:w-auto">
          <div className="flex justify-between sm:justify-start">
            <button
              onClick={() => setMode("edit")}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === "edit"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {t("examEditor.editModeButton")}
            </button>
            <button
              onClick={() => setMode("correction")}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === "correction"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {t("examEditor.correctionTabLabel")}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="grid grid-flow-col gap-2 auto-cols-min">
            <div className="relative group">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label={showPreview ? "Edit" : "Show Preview"}
              >
                {showPreview ? (
                  <PencilIcon className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden sm:block">
                {showPreview ? "Edit" : "Show Preview"}
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Download"
                title={t("examEditor.downloadPdfTooltip")}
              >
                <FiDownload className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Download PDF
              </div>
            </div>
            {((mode === "edit" && !isCreatingNew) ||
              (mode === "correction" && correction)) && (
              <div className="relative group">
                <button
                  onClick={onSave}
                  className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  aria-label="Save Changes"
                  title={t("examEditor.saveChangesTooltip")}
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Save Changes
                </div>
              </div>
            )}
            {!isCreatingNew && (
              <div className="relative group">
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  aria-label="Delete Exam"
                  title={t("examEditor.deleteExamTooltip")}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Delete Exam
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-4 md:pb-6">
        {mode === "correction" && !correction && !isWaitingForCorrection ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Correction Available
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Would you like to generate an AI-powered correction for this
                exam?
              </p>
              <button
                onClick={onCreateCorrection}
                disabled={isSendingMessage}
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSendingMessage ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("examEditor.generatingLabel")}
                  </>
                ) : (
                  t("examEditor.generateCorrectionButton")
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">{renderCorrectionSection()}</div>
        )}
      </div>

      {/* Preview Modal */}
      <Transition appear show={isPreviewOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsPreviewOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-gray-900"
                    >
                      {t("examEditor.examPreviewTitle")}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => {
                          return <p className="my-1">{children}</p>;
                        },
                      }}
                    >
                      {processedContent}
                    </ReactMarkdown>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add a hidden div for PDF generation */}
      <div className="hidden">
        <div ref={previewRef} className="p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => {
                  return <p className="my-1">{children}</p>;
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
