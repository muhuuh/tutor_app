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
  report_title: string;
}

interface ConceptMasteryChartProps {
  data?: Record<string, Array<ConceptScore>> | null;
  isRefreshing?: boolean;
  onRefresh: () => Promise<void>;
}

export const ConceptMasteryChart: React.FC<ConceptMasteryChartProps> = ({
  data,
  isRefreshing = false,
  onRefresh,
}) => {
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
          label: "Concept Mastery",
          data: scores,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(54, 162, 235)",
        },
      ],
    };
  }, [averageScores]);

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10,
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

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-700">
            {selectedConcept} Details
          </h4>
          <button
            onClick={() => setSelectedConcept(null)}
            className="text-gray-500 hover:text-gray-700"
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

        <div className="text-sm text-gray-600 mb-2">
          Average Score:{" "}
          <span className="font-medium">{averageScores[selectedConcept]}</span>
        </div>

        <div className="text-xs text-gray-500 mb-1">Individual Scores:</div>

        <div className="max-h-40 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Title
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scores.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap">{item.score}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.report_title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Concept Mastery</h3>
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

      {data && Object.keys(data).length > 0 ? (
        <div>
          <div className="aspect-w-16 aspect-h-9 max-h-80">
            <Radar data={chartData} options={chartOptions} />
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(averageScores).map((concept) => (
                <button
                  key={concept}
                  onClick={() => handleConceptClick(concept)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedConcept === concept
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No concept data available. Click refresh to generate.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConceptMasteryChart;
