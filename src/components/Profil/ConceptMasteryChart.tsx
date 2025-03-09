import React, { useMemo, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { useTranslation } from "react-i18next";

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ConceptScore {
  score: number;
  exercise_id: string;
  report_title?: string;
}

interface ConceptMasteryChartProps {
  data: Record<string, Array<ConceptScore>> | null | undefined;
  isRefreshing?: boolean;
  onRefresh: () => Promise<void>;
}

export const ConceptMasteryChart: React.FC<ConceptMasteryChartProps> = ({
  data,
  isRefreshing = false,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  // Calculate the average score for each concept
  const averageScores = useMemo(() => {
    if (!data) return {};

    const averages: Record<string, number> = {};

    Object.entries(data).forEach(([concept, scores]) => {
      if (scores.length === 0) {
        averages[concept] = 0;
      } else {
        const sum = scores.reduce((acc, curr) => acc + curr.score, 0);
        averages[concept] = Math.round((sum / scores.length) * 100) / 100; // Round to 2 decimal places
      }
    });

    return averages;
  }, [data]);

  // Prepare data for chart
  const chartData = useMemo(() => {
    const concepts = Object.keys(averageScores);
    const scores = Object.values(averageScores);

    return {
      labels: concepts,
      datasets: [
        {
          label: t("conceptMasteryChart.chart.label"),
          data: scores,
          backgroundColor: "rgba(59, 130, 246, 0.4)", // More opacity for better visual
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(59, 130, 246)",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [averageScores, t]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.08)", // Lighter lines
        },
        grid: {
          color: "rgba(0, 0, 0, 0.03)", // Lighter grid
          circular: true,
        },
        ticks: {
          backdropColor: "transparent", // Transparent background
          color: "rgba(0, 0, 0, 0.5)", // Darker text
          showLabelBackdrop: false, // Hide label backdrop
        },
        pointLabels: {
          color: "rgba(0, 0, 0, 0.7)",
        },
        suggestedMin: 0,
        suggestedMax: 10,
        beginAtZero: true, // Start from zero
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend as it's redundant
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#333",
        bodyColor: "#666",
        displayColors: false,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            return t("conceptMasteryChart.chart.tooltip", {
              score: context.raw,
            });
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3, // Add more curve
      },
    },
  };

  const handleRefresh = async () => {
    await onRefresh();
  };

  const handleConceptClick = (concept: string) => {
    setSelectedConcept(concept === selectedConcept ? null : concept);
  };

  // Render the detail view for a selected concept
  const renderConceptDetail = () => {
    if (!selectedConcept || !data || !data[selectedConcept]) return null;

    const scores = data[selectedConcept];

    // Calculate stats
    const avgScore = averageScores[selectedConcept];
    const maxScore = Math.max(...scores.map((s) => s.score));
    const minScore = Math.min(...scores.map((s) => s.score));

    return (
      <div className="mt-5 bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-blue-800 flex items-center">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {selectedConcept}
          </h4>
          <button
            onClick={() => setSelectedConcept(null)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={t("conceptMasteryChart.detail.close")}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              {t("conceptMasteryChart.detail.averageScore")}
            </div>
            <div className="font-semibold text-lg text-blue-600">
              {avgScore.toFixed(2)}
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              {t("conceptMasteryChart.detail.highestScore")}
            </div>
            <div className="font-semibold text-lg text-green-600">
              {maxScore.toFixed(2)}
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              {t("conceptMasteryChart.detail.lowestScore")}
            </div>
            <div className="font-semibold text-lg text-red-600">
              {minScore.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
          <div className="text-sm font-medium text-gray-700 px-4 py-3 bg-gray-50 border-b border-gray-100">
            {t("conceptMasteryChart.detail.exerciseHistory")}
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("conceptMasteryChart.detail.score")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("conceptMasteryChart.detail.reportTitle")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {scores.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                          item.score > 7
                            ? "bg-green-100 text-green-800"
                            : item.score > 4
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.score.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {item.report_title || `Exercise ${item.exercise_id}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">
          {t("conceptMasteryChart.title")}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-full transition-colors ${
            isRefreshing ? "text-blue-400" : "text-blue-600 hover:bg-blue-100"
          }`}
          title={t("conceptMasteryChart.refreshTitle")}
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
        {data && Object.keys(data).length > 0 ? (
          <div>
            <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-100 flex justify-center items-center mb-5">
              <div className="w-full max-w-lg aspect-square max-h-80 relative">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>

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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                {t("conceptMasteryChart.selectConcept")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(averageScores).map((concept) => (
                  <button
                    key={concept}
                    onClick={() => handleConceptClick(concept)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedConcept === concept
                        ? "bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                        : "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>

            {selectedConcept && renderConceptDetail()}
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
            <p className="text-gray-500">{t("conceptMasteryChart.noData")}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end items-center text-xs text-gray-500">
        <p>
          {t("conceptMasteryChart.footer", {
            date: new Date().toLocaleDateString(),
          })}
        </p>
      </div>
    </div>
  );
};

export default ConceptMasteryChart;
