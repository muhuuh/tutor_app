import React, { useState } from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface PersonalNotesProps {
  data?: {
    notes_list: string[];
    ai_summary: string;
  } | null;
  isRefreshing?: boolean;
  onRefresh: () => Promise<void>;
}

export const PersonalNotes: React.FC<PersonalNotesProps> = ({
  data,
  isRefreshing = false,
  onRefresh,
}) => {
  const [showSummary, setShowSummary] = useState(true);

  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Notes</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm space-x-1">
            <button
              onClick={() => setShowSummary(true)}
              className={`px-3 py-1 rounded-md ${
                showSummary
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className={`px-3 py-1 rounded-md ${
                !showSummary
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Notes
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isRefreshing ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Refreshing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {data ? (
        <div>
          {showSummary ? (
            <div className="p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                AI-Generated Summary
              </h4>
              <div className="prose prose-sm max-w-none text-blue-800">
                {data.ai_summary}
              </div>

              {data.notes_list && data.notes_list.length > 0 && (
                <button
                  onClick={() => setShowSummary(false)}
                  className="mt-3 text-xs text-blue-700 hover:text-blue-900 underline"
                >
                  View all {data.notes_list.length} notes
                </button>
              )}
            </div>
          ) : (
            <div>
              {data.notes_list && data.notes_list.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {data.notes_list.map((note, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{note}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No notes found.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No notes available. Click refresh to fetch and analyze notes.
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {data?.notes_list ? `${data.notes_list.length} notes` : "No notes"}
        </p>

        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PersonalNotes;
