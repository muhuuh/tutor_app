import React from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";

// Define concept interface for top/worst concepts
interface Concept {
  concept: string;
  score: number;
}

interface ExecutiveSummaryProps {
  data?: {
    // Original fields for backward compatibility
    overall_trend_numeric: number;
    overall_trend_text: string;
    strengths_weaknesses: string;

    // New fields from the updated n8n response
    trend_icon?: string;
    general_performance?: string;
    latest_trends?: string;
    standout_points?: string;
    top_concepts?: Concept[];
    worst_concepts?: Concept[];
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

  // Function to render trend icon based on numeric value or trend_icon string
  const renderTrendIcon = (data: ExecutiveSummaryProps["data"]) => {
    if (!data) return null;

    // Use trend_icon string if available, otherwise use numeric value
    const trendValue = data.trend_icon
      ? data.trend_icon === "positive"
        ? 1
        : data.trend_icon === "negative"
        ? -1
        : 0
      : data.overall_trend_numeric;

    if (trendValue > 0 || data.trend_icon === "positive") {
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
    } else if (trendValue < 0 || data.trend_icon === "negative") {
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
            {renderTrendIcon(data)}
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">
              {data.general_performance || data.overall_trend_text}
            </p>
          </div>

          {/* Strengths & Weaknesses / Latest Trends */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Latest Trends & Key Observations
            </h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: (
                      (data.latest_trends
                        ? `<p><strong>Latest Trends:</strong> ${data.latest_trends}</p>`
                        : "") +
                        (data.standout_points
                          ? `<p><strong>Standout Points:</strong> ${data.standout_points}</p>`
                          : "") || data.strengths_weaknesses
                    ).replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Concepts */}
          {data.top_concepts && data.top_concepts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Strengths - Top Performing Concepts
              </h4>
              <div className="p-4 bg-gray-50 rounded-md">
                <ul className="space-y-2">
                  {data.top_concepts.map((concept, index) => (
                    <li key={`top-${index}`} className="flex justify-between">
                      <span>{concept.concept}</span>
                      <span className="text-green-600 font-medium">
                        {(concept.score * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Worst Concepts */}
          {data.worst_concepts && data.worst_concepts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Areas for Improvement
              </h4>
              <div className="p-4 bg-gray-50 rounded-md">
                <ul className="space-y-2">
                  {data.worst_concepts.map((concept, index) => (
                    <li key={`worst-${index}`} className="flex justify-between">
                      <span>{concept.concept}</span>
                      <span className="text-red-600 font-medium">
                        {(concept.score * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
