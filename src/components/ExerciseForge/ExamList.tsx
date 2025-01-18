import React from "react";
import type { Exam } from "../../types/database";

interface ExamListProps {
  loading: boolean;
  exams: Exam[];
  selectedExam: Exam | null;
  isCreatingNew: boolean;
  onExamSelect: (examId: string | null) => void;
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
          <button
            onClick={() => onExamSelect(null)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              isCreatingNew
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
          >
            <h3 className="font-medium text-gray-900">Create New Exam</h3>
            <p className="text-sm text-gray-500 mt-1">
              Start a conversation with AI to create a new exam
            </p>
          </button>

          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => onExamSelect(exam.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedExam?.id === exam.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <h3 className="font-medium text-gray-900">{exam.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(exam.updated_at).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
