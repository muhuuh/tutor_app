import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useReport } from "../hooks/useReport";
import { usePupils } from "../hooks/usePupils";
import { ChatBox } from "../components/Chat/ChatBox";
import { Tabs } from "../components/Tabs/Tabs";
import { PupilForm } from "../components/PupilForm";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import {
  downloadWordDocument,
  convertMarkdownToWord,
} from "../lib/markdownToWord";

const DEFAULT_REPORT_ID = "013eee03-6226-470d-ae9b-f9fe0a8948cd";

const TABS = [
  { id: "chat", label: "Chat Assistant" },
  { id: "reports", label: "Reports" },
];

interface ReportData {
  performance_summary: string;
  incorrect_questions: string;
  misunderstood_concepts: string;
  learning_material: string;
  practice_exercises: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedPupilId, setSelectedPupilId] = useState("");
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [showAddPupil, setShowAddPupil] = useState(false);
  const [availableReports, setAvailableReports] = useState<
    Array<{ id: string; requested_at: string; report_title: string }>
  >([]);
  const { report, loading, error } = useReport(
    currentReportId || DEFAULT_REPORT_ID
  );
  const {
    pupils,
    loading: loadingPupils,
    refetch: refetchPupils,
  } = usePupils();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("reports")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reports",
          filter: `teacher_id=eq.${user.id}`,
        },
        (payload) => {
          toast.success("New report is ready!", {
            duration: 5000,
            icon: "📋",
          });
          fetchReports(selectedPupilId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedPupilId]);

  const fetchReports = async (pupilId: string) => {
    if (!pupilId) return;

    const { data, error } = await supabase
      .from("reports")
      .select("id, requested_at, report_title")
      .eq("pupil_id", pupilId)
      .order("requested_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      return;
    }

    setAvailableReports(data);
    if (data.length > 0) {
      setCurrentReportId(data[0].id);
    } else {
      setCurrentReportId(null);
    }
  };

  useEffect(() => {
    fetchReports(selectedPupilId);
  }, [selectedPupilId]);

  const handlePupilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPupilId(e.target.value);
  };

  const handleDownloadReport = async () => {
    if (!report?.report) return;

    try {
      const content = [
        "# Performance Summary\n",
        report.report.performance_summary,
        "\n\n# Incorrect Questions\n",
        report.report.incorrect_questions,
        "\n\n# Misunderstood Concepts\n",
        report.report.misunderstood_concepts,
        "\n\n# Learning Materials\n",
        report.report.learning_material,
        "\n\n# Practice Exercises\n",
        report.report.practice_exercises,
      ].join("\n");

      const title =
        report.report_title ||
        `Report ${new Date(report.requested_at).toLocaleDateString()}`;
      const wordBlob = await convertMarkdownToWord(content, title);
      downloadWordDocument(wordBlob, title);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const handleDeleteReport = async () => {
    if (
      !currentReportId ||
      !window.confirm("Are you sure you want to delete this report?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", currentReportId);

      if (error) throw error;

      toast.success("Report deleted successfully");
      fetchReports(selectedPupilId);
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const renderReportContent = () => {
    if (!selectedPupilId) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Please select a student to view their reports.
          </p>
        </div>
      );
    }

    if (!currentReportId) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reports available for this student yet.
          </p>
        </div>
      );
    }

    if (!report?.report) return null;

    const currentReport = availableReports.find(
      (r) => r.id === currentReportId
    );
    const reportTitle =
      currentReport?.report_title ||
      `Report from ${new Date(
        currentReport?.requested_at || ""
      ).toLocaleDateString()}`;

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{reportTitle}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadReport}
              className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Download report"
            >
              <FiDownload className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteReport}
              className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500"
              aria-label="Delete report"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.performance_summary}</ReactMarkdown>
          </div>
        </div>

        {/* Incorrect Questions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.incorrect_questions}</ReactMarkdown>
          </div>
        </div>

        {/* Misunderstood Concepts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>
              {report.report.misunderstood_concepts}
            </ReactMarkdown>
          </div>
        </div>

        {/* Learning Materials */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.learning_material}</ReactMarkdown>
          </div>
        </div>

        {/* Practice Exercises */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4"></h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{report.report.practice_exercises}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-600 p-4">
          Failed to load report data. Please try again later.
        </div>
      );
    }

    switch (activeTab) {
      case "chat":
        return (
          <ChatBox
            selectedPupilId={selectedPupilId}
            onReportGenerated={(reportId) => {
              setCurrentReportId(reportId);
              fetchReports(selectedPupilId);
            }}
          />
        );
      case "reports":
        return <>{renderReportContent()}</>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex justify-center items-end gap-6 mb-4">
              {!showAddPupil && (
                <div className="w-64">
                  <label
                    htmlFor="pupil"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Student
                  </label>
                  <select
                    id="pupil"
                    value={selectedPupilId}
                    onChange={handlePupilChange}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                    disabled={loadingPupils}
                  >
                    <option value="">Choose a student...</option>
                    {pupils.map((pupil) => (
                      <option key={pupil.id} value={pupil.id}>
                        {pupil.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "reports" &&
                selectedPupilId &&
                availableReports.length > 0 && (
                  <div className="w-64">
                    <label
                      htmlFor="report"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Report
                    </label>
                    <select
                      id="report"
                      value={currentReportId || ""}
                      onChange={(e) => setCurrentReportId(e.target.value)}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    >
                      {availableReports.map((report) => (
                        <option key={report.id} value={report.id}>
                          {report.report_title ||
                            `Report from ${new Date(
                              report.requested_at
                            ).toLocaleString()}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {!showAddPupil && (
                <button
                  onClick={() => setShowAddPupil(!showAddPupil)}
                  className="px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Or add New Student
                </button>
              )}
            </div>

            {showAddPupil && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-left">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Add New Student
                  </h2>
                  <button
                    onClick={() => setShowAddPupil(!showAddPupil)}
                    className="px-4 mb-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Cancel
                  </button>
                </div>
                <PupilForm
                  onSuccess={() => {
                    setShowAddPupil(false);
                    refetchPupils();
                  }}
                />
              </div>
            )}
          </div>

          <div className="px-6">
            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </main>
    </div>
  );
}
