import React, { useState, useRef, useEffect, Fragment } from "react";
import type { Exam, Correction } from "../../types/database";
import { FiEye, FiEyeOff, FiDownload, FiSave, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";

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
  onDelete: () => void;
  title: string;
  onTitleChange: (newTitle: string) => void;
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
  onDelete,
  title,
  onTitleChange,
}: ExamEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
    }
  }, [isEditingTitle]);

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
      <div className="flex items-center justify-center gap-2 mb-6">
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
            className="text-2xl font-semibold text-center text-gray-900 w-full max-w-2xl px-4 py-1 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-600"
          />
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={() => {
                setEditedTitle(title);
                setIsEditingTitle(true);
              }}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setMode("edit")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "edit"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setMode("correction")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === "correction"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Correction
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Show Preview"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Show Preview
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
          {!isCreatingNew && (
            <div className="relative group">
              <button
                onClick={onDelete}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                aria-label="Delete Exam"
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

      {mode === "correction" && !correction && !isWaitingForCorrection ? (
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
      ) : (
        <div className="space-y-4">{renderCorrectionSection()}</div>
      )}

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
                      Preview
                    </Dialog.Title>
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
                    <ReactMarkdown>{editableContent}</ReactMarkdown>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
