import React, { useState } from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface Report {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface CommunicationToolsProps {
  data?: {
    reports_list: Report[];
  } | null;
  isGenerating?: boolean;
  studentId: string;
  onGenerateReport: (title: string) => Promise<void>;
  onViewReport: (reportId: string) => void;
}

export const CommunicationTools: React.FC<CommunicationToolsProps> = ({
  data,
  isGenerating = false,
  studentId,
  onGenerateReport,
  onViewReport,
}) => {
  const [reportTitle, setReportTitle] = useState("Progress Report");
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportTitle.trim()) {
      await onGenerateReport(reportTitle);
      setReportTitle("Progress Report");
      setShowForm(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleViewReportDetails = (report: Report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Communication Tools
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
          disabled={isGenerating}
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Report
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Generate New Report
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="reportTitle"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                Report Title
              </label>
              <input
                type="text"
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="small" color="text-white" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedReport ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              {selectedReport.title}
            </h4>
            <button
              onClick={closeReportDetails}
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

          <div className="text-xs text-gray-500 mb-3">
            Generated on: {formatDate(selectedReport.date)}
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <div className="prose prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedReport.content.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onViewReport(selectedReport.id)}
              className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            >
              Export Report
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">
            Recent Reports
          </h4>

          {data && data.reports_list && data.reports_list.length > 0 ? (
            <div className="overflow-hidden border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th scope="col" className="relative px-4 py-2">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.reports_list.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReportDetails(report)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onViewReport(report.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 border border-gray-200 rounded-md">
              <p className="text-gray-500">No reports generated yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Create your first report
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Reports are saved and can be shared with parents via email or PDF
          download.
        </p>
      </div>
    </div>
  );
};

export default CommunicationTools;
