import React from "react";
import type { Exam, Correction } from "../../types/database";
import { FiEye, FiEyeOff, FiDownload, FiSave } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

interface ExamEditorProps {
  selectedExam: Exam | null;
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
  onDownload: () => void;
  onCreateCorrection: () => void;
  onSave: () => void;
}

export function ExamEditor({
  selectedExam,
  isCreatingNew,
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
  onDownload,
  onCreateCorrection,
  onSave,
}: ExamEditorProps) {
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
        <div className="flex flex-col items-center justify-center my-8 space-y-4">
          <p className="text-gray-700 text-center">
            No correction exists yet for this exam.
          </p>
          <button
            onClick={onCreateCorrection}
            disabled={isSendingMessage}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSendingMessage ? "Creating..." : "Create Correction"}
          </button>
          <p className="text-xs text-gray-500 max-w-md text-center">
            This will request a specialized AI to create the perfect solution
            and step-by-step explanation for the selected exam.
          </p>
        </div>
      );
    }

    return (
      <>
        {showPreview && !isCreatingNew && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
            <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg border border-gray-200">
              <ReactMarkdown>{editableContent}</ReactMarkdown>
            </div>
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full h-96 p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
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
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          {isCreatingNew ? "Create New Exam" : selectedExam?.title}
        </h2>
      </div>

      {(mode === "edit" || (mode === "correction" && correction)) && (
        <div className="flex justify-between ">
          <div>
            {!isCreatingNew && (
              <div className="relative flex rounded-lg border border-gray-200 p-1 bg-gray-50 w-fit">
                <div
                  className="absolute inset-y-1 w-[96px] bg-indigo-600 rounded transition-all duration-200"
                  style={{
                    left: mode === "edit" ? "4px" : "100px",
                  }}
                />
                <button
                  onClick={() => setMode("edit")}
                  className={`relative z-10 px-4 py-1.5 text-sm font-medium w-24 rounded transition-colors duration-200 ${
                    mode === "edit" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setMode("correction")}
                  className={`relative z-10 px-4 py-1.5 text-sm font-medium w-24 rounded transition-colors duration-200 ${
                    mode === "correction" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Correction
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <div className="relative group">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {showPreview ? "Hide Preview" : "Show Preview"}
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={onDownload}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Download"
              >
                <FiDownload className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Download
              </div>
            </div>

            {((mode === "edit" && !isCreatingNew) ||
              (mode === "correction" && correction)) && (
              <div className="relative group">
                <button
                  onClick={onSave}
                  className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  aria-label="Save Changes"
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Save Changes
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCreatingNew && mode === "edit" && (
        <>
          {showPreview && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Preview
              </h3>
              <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg border border-gray-200">
                <ReactMarkdown>{editableContent}</ReactMarkdown>
              </div>
            </div>
          )}
          <div className="prose prose-sm max-w-none">
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-96 p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </>
      )}

      {!isCreatingNew && mode === "correction" && renderCorrectionSection()}
    </div>
  );
}
