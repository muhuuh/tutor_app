import React from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface PriorityConcept {
  concept: string;
  priority: number;
}

interface FocusPanelProps {
  data?: {
    priority_concepts: PriorityConcept[];
  } | null;
  isRefreshing?: boolean;
  onRefresh: () => Promise<void>;
}

export const FocusPanel: React.FC<FocusPanelProps> = ({
  data,
  isRefreshing = false,
  onRefresh,
}) => {
  const handleRefresh = async () => {
    await onRefresh();
  };

  // Function to get priority label and color
  const getPriorityInfo = (priority: number) => {
    if (priority >= 8) {
      return { label: "High", color: "bg-red-100 text-red-800" };
    } else if (priority >= 5) {
      return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { label: "Low", color: "bg-green-100 text-green-800" };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Focus Areas</h3>
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

      {data && data.priority_concepts && data.priority_concepts.length > 0 ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            These concepts need attention based on recent performance and
            importance:
          </p>

          <ul className="space-y-3">
            {data.priority_concepts.map((item, index) => {
              const priorityInfo = getPriorityInfo(item.priority);

              return (
                <li
                  key={index}
                  className="flex items-start p-3 border rounded-md"
                >
                  <div className="flex-shrink-0 mr-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">{item.concept}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${priorityInfo.color}`}
                      >
                        {priorityInfo.label} Priority
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Priority score: {item.priority}/10
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Priority is calculated based on recent performance, concept
              importance, and upcoming curriculum needs.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No focus areas identified. Click refresh to analyze and generate
            recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default FocusPanel;
