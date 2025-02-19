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
} from "@floating-ui/react";
import { FiTrash2, FiDownload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface ExamListProps {
  loading: boolean;
  exams: Exam[];
  selectedExam: Exam | null;
  onExamSelect: (examId: string) => void;
  onExamDelete: (examId: string) => void;
  onExamDownload: (examId: string) => void;
  newExamId: string | null;
  showTitle?: boolean;
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
    open: 600, // 1 second delay before opening
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
            className="z-50 max-w-md p-4 bg-white/95 backdrop-blur-sm rounded-xl 
              shadow-lg ring-1 ring-gray-100 border border-gray-100/20
              opacity-0 animate-[fadeIn_200ms_ease-out_forwards]"
          >
            <div className="text-sm text-gray-700">{contentPreview}</div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
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

export function ExamList({
  loading,
  exams,
  selectedExam,
  onExamSelect,
  onExamDelete,
  onExamDownload,
  newExamId,
}: ExamListProps) {
  return (
    <div className="col-span-1">
      {/* Show title only on mobile */}
      <div className="sm:hidden flex items-center gap-2 justify-center mb-4">
        <h2 className="text-lg font-semibold text-blue-900">Your Exams</h2>
        <div className="-mt-0.5">
          <InfoTooltip content="Overview of the exams you have uploaded and edited in the past." />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-24 sm:h-32">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2 sm:pr-4"
            style={{ scrollbarGutter: "stable" }}
          >
            {exams.slice(0, 5).map((exam) => (
              <ExamTooltip key={exam.id} content={exam.content} formatted>
                <div className="relative group">
                  <button
                    onClick={() => onExamSelect(exam.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                      selectedExam?.id === exam.id
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50"
                        : newExamId === exam.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 flex items-center gap-2">
                      {exam.title}
                      {newExamId === exam.id && (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Last updated:{" "}
                      {new Date(exam.updated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </button>

                  <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExamDownload(exam.id);
                      }}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      aria-label="Download exam"
                    >
                      <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExamDelete(exam.id);
                      }}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      aria-label="Delete exam"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </ExamTooltip>
            ))}
            {exams.length > 5 && (
              <div className="pt-3 sm:pt-4 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  Scroll to see {exams.length - 5} more exams
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
