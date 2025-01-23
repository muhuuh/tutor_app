import React, { useState } from "react";
import type { Exam } from "../../types/database";
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
  useDelayGroup,
} from "@floating-ui/react";
import { FiTrash2, FiDownload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

interface ExamListProps {
  loading: boolean;
  exams: Exam[];
  selectedExam: Exam | null;
  isCreatingNew: boolean;
  onExamSelect: (examId: string | null) => void;
  onExamDelete: (examId: string) => void;
  newExamId?: string;
  onExamDownload: (examId: string) => void;
}

function ExamTooltip({
  content,
  children,
  formatted = false,
}: {
  content: string;
  children: React.ReactNode;
  formatted?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentPreview = formatted ? (
    <div className="prose prose-sm max-w-none">
      <div className="[&>*]:my-1 [&>p]:leading-normal text-xs">
        <ReactMarkdown>
          {content.length > 300
            ? content.slice(0, 300).trim() + "..."
            : content}
        </ReactMarkdown>
      </div>
    </div>
  ) : (
    <div className="whitespace-pre-wrap text-xs">
      {content.length > 150 ? content.slice(0, 150).trim() + "..." : content}
    </div>
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const delay = {
    open: 400, // 1 second delay before opening
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
            className="z-50 max-w-md p-3 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div className="text-xs text-gray-700">{contentPreview}</div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

export function ExamList({
  loading,
  exams,
  selectedExam,
  isCreatingNew,
  onExamSelect,
  onExamDelete,
  newExamId,
  onExamDownload,
}: ExamListProps) {
  return (
    <div className="col-span-1 border-r pr-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Exams</h2>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {exams.slice(0, 5).map((exam) => (
            <ExamTooltip key={exam.id} content={exam.content} formatted>
              <div className="relative group">
                <button
                  onClick={() => onExamSelect(exam.id)}
                  className={`w-full text-left p-4 pr-20 rounded-lg border transition-colors ${
                    selectedExam?.id === exam.id
                      ? "border-indigo-500 bg-indigo-50"
                      : newExamId === exam.id
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    {exam.title}
                    {newExamId === exam.id && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated:{" "}
                    {new Date(exam.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </button>
                <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExamDownload(exam.id);
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    aria-label="Download exam"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExamDelete(exam.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete exam"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ExamTooltip>
          ))}
          {exams.length > 5 && (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-500 text-center">
                Scroll to see {exams.length - 5} more exams
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
