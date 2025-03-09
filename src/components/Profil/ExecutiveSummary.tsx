import React from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
          <svg
            className="w-4 h-4"
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
          <span className="font-medium">
            {t("executiveSummary.trend.improving")}
          </span>
        </div>
      );
    } else if (trendValue < 0 || data.trend_icon === "negative") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm">
          <svg
            className="w-4 h-4"
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
          <span className="font-medium">
            {t("executiveSummary.trend.declining")}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm">
          <svg
            className="w-4 h-4"
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
          <span className="font-medium">
            {t("executiveSummary.trend.stable")}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">
          {t("executiveSummary.title")}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-full transition-colors ${
            isRefreshing ? "text-blue-400" : "text-blue-600 hover:bg-blue-100"
          }`}
          title={t("executiveSummary.refreshTitle")}
        >
          {isRefreshing ? (
            <LoadingSpinner size="small" />
          ) : (
            <svg
              className="w-5 h-5"
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
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="p-5">
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Overall Performance */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    {t("executiveSummary.overallPerformance")}
                  </h4>
                  {renderTrendIcon(data)}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-700 text-sm">
                    {data.general_performance || data.overall_trend_text}
                  </p>
                </div>
              </div>

              {/* Latest Trends & Key Observations */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {t("executiveSummary.latestTrendsTitle")}
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 h-full">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (
                          (data.latest_trends
                            ? `<p><strong class="text-blue-700">${t(
                                "executiveSummary.latestTrends"
                              )}:</strong> ${data.latest_trends}</p>`
                            : "") +
                            (data.standout_points
                              ? `<p><strong class="text-blue-700">${t(
                                  "executiveSummary.standoutPoints"
                                )}:</strong> ${data.standout_points}</p>`
                              : "") || data.strengths_weaknesses
                        ).replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Column Title */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t("executiveSummary.focusAreas")}
                </h4>
              </div>

              {/* Top Concepts */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center pl-5">
                  <svg
                    className="w-4 h-4 mr-1.5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("executiveSummary.strengths")}
                </h4>
                <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100">
                  {data.top_concepts && data.top_concepts.length > 0 ? (
                    <ul className="space-y-2">
                      {data.top_concepts.map((concept, index) => (
                        <li
                          key={`top-${index}`}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {concept.concept}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-medium">
                            {(concept.score * 100).toFixed(0)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      {t("executiveSummary.noStrengths")}
                    </p>
                  )}
                </div>
              </div>

              {/* Worst Concepts */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center pl-5">
                  <svg
                    className="w-4 h-4 mr-1.5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {t("executiveSummary.improvements")}
                </h4>
                <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg border border-red-100">
                  {data.worst_concepts && data.worst_concepts.length > 0 ? (
                    <ul className="space-y-2">
                      {data.worst_concepts.map((concept, index) => (
                        <li
                          key={`worst-${index}`}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {concept.concept}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md font-medium">
                            {(concept.score * 100).toFixed(0)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      {t("executiveSummary.noImprovements")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500">{t("executiveSummary.noData")}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end items-center text-xs text-gray-500">
        <p>
          {t("executiveSummary.footer", {
            date: new Date().toLocaleDateString(),
          })}
        </p>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
