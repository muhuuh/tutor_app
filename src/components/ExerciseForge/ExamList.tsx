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

interface ExamListProps {
  loading: boolean;
  exams: Exam[];
  selectedExam: Exam | null;
  isCreatingNew: boolean;
  onExamSelect: (examId: string | null) => void;
}

function ExamTooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentPreview =
    content.length > 150 ? content.slice(0, 150).trim() + "..." : content;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
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
              {contentPreview}
            </div>
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
}: ExamListProps) {
  return (
    <div className="col-span-1 border-r pr-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Exams</h2>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <ExamTooltip key={exam.id} content={exam.content}>
              <button
                onClick={() => onExamSelect(exam.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedExam?.id === exam.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <h3 className="font-medium text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated:{" "}
                  {new Date(exam.updated_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </button>
            </ExamTooltip>
          ))}
        </div>
      )}
    </div>
  );
}
