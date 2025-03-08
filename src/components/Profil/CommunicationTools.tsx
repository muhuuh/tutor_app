import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
  onDeleteReport?: (reportId: string) => Promise<void>;
}

// Helper function to process markdown content
const processContent = (content: string) => {
  // Convert \[ ... \] to $$ ... $$
  content = content.replace(/\\\[(.*?)\\\]/g, (_, match) => `$$${match}$$`);

  // Convert \( ... \) to $ ... $
  content = content.replace(/\\\((.*?)\\\)/g, (_, match) => `$${match}$`);

  // Convert scientific notation (e.g., 6.674×10^-11)
  content = content.replace(
    /(\d+\.?\d*)\s*[×x]\s*10\^(-?\d+)/g,
    (_, base, exp) => `$${base} \\times 10^{${exp}}$`
  );

  // Convert units with superscripts (e.g., m²)
  content = content.replace(/([a-zA-Z])²/g, (_, unit) => `$${unit}^2$`);
  content = content.replace(/([a-zA-Z])³/g, (_, unit) => `$${unit}^3$`);

  return content;
};

export const CommunicationTools: React.FC<CommunicationToolsProps> = ({
  data,
  isGenerating = false,
  studentId,
  onGenerateReport,
  onViewReport,
  onDeleteReport,
}) => {
  const [reportTitle, setReportTitle] = useState("Progress Report");
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get latest report
  const latestReport = data?.reports_list?.length ? data.reports_list[0] : null;

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
    setIsModalOpen(true);
  };

  const handleDeleteReportClick = async (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      if (onDeleteReport) {
        await onDeleteReport(reportId);

        // If the deleted report was the selected one, close the modal
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
          setIsModalOpen(false);
        }
      }
    }
  };

  // Get a preview of content (first ~200 characters)
  const getContentPreview = (content: string) => {
    const previewLength = 200;
    if (content.length <= previewLength) return content;
    return content.substring(0, previewLength) + "...";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">Shareable Reports</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
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
        <div className="p-5 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
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
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 flex items-center"
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

      <div className="p-5">
        {data && data.reports_list && data.reports_list.length > 0 ? (
          <div>
            {/* Latest Report Preview */}
            {latestReport && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Latest Report
                  </h4>
                  <div className="text-xs text-gray-500">
                    {formatDate(latestReport.date)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {latestReport.title}
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-600 max-h-24 overflow-hidden">
                    <ReactMarkdown>
                      {getContentPreview(latestReport.content)}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewReportDetails(latestReport)}
                    className="px-3 py-1.5 text-xs text-blue-600 bg-white border border-blue-300 rounded-md shadow-sm hover:bg-blue-50"
                  >
                    View Full Report
                  </button>
                  <button
                    onClick={() => onViewReport(latestReport.id)}
                    className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                  >
                    Export
                  </button>
                  {onDeleteReport && (
                    <button
                      onClick={() => handleDeleteReportClick(latestReport.id)}
                      className="px-3 py-1.5 text-xs text-red-600 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 flex items-center"
                    >
                      <TrashIcon className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Previous Reports List */}
            {data.reports_list.length > 1 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Previous Reports
                </h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <div className="divide-y divide-gray-200">
                    {data.reports_list.slice(1).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between py-3 px-4 hover:bg-gray-50"
                      >
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">
                            {report.title}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {formatDate(report.date)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReportDetails(report)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onViewReport(report.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Export
                          </button>
                          {onDeleteReport && (
                            <button
                              onClick={() => handleDeleteReportClick(report.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-2">No reports generated yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first report
            </button>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">
          Reports are saved and can be shared with parents via email or PDF
          download.
        </p>
      </div>

      {/* Full Screen Modal for Report Viewing */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  {selectedReport && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium text-gray-900"
                        >
                          {selectedReport.title}
                        </Dialog.Title>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-500">
                            {formatDate(selectedReport.date)}
                          </div>
                          <button
                            onClick={() => onViewReport(selectedReport.id)}
                            className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 mr-2"
                          >
                            Export
                          </button>
                          {onDeleteReport && (
                            <button
                              onClick={() =>
                                handleDeleteReportClick(selectedReport.id)
                              }
                              className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => {
                              return <p className="my-1">{children}</p>;
                            },
                          }}
                        >
                          {processContent(selectedReport.content)}
                        </ReactMarkdown>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CommunicationTools;
