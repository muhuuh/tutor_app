import React from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface ExecutiveSummaryProps {
  data?: {
    overall_trend_numeric: number;
    overall_trend_text: string;
    strengths_weaknesses: string;
  } | null;
  isRefreshing?: boolean;
  onRefresh: () => Promise<void>;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  data,
  isRefreshing = false,
  onRefresh,
}) => {
  const handleRefresh = async () => {
    await onRefresh();
  };

  // Function to render trend icon based on numeric value
  const renderTrendIcon = (trendValue: number) => {
    if (trendValue > 0) {
      return (
        <span className="text-green-500 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          Improving
        </span>
      );
    } else if (trendValue < 0) {
      return (
        <span className="text-red-500 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          Declining
        </span>
      );
    } else {
      return (
        <span className="text-yellow-500 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
          </svg>
          Stable
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Executive Summary</h3>
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

      {data ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-500">
              Overall Performance Trend
            </h4>
            {renderTrendIcon(data.overall_trend_numeric)}
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">{data.overall_trend_text}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Strengths & Weaknesses
            </h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.strengths_weaknesses.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No summary available. Click refresh to generate.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
