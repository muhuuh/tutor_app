import React, { useState, useEffect, useRef } from "react";
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
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TABS = [
  { id: "chat", label: "Chat Assistant" },
  { id: "reports", label: "Reports" },
];

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedPupilId, setSelectedPupilId] = useState("");
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [showAddPupil, setShowAddPupil] = useState(false);
  const [availableReports, setAvailableReports] = useState<
    Array<{ id: string; requested_at: string; report_title: string }>
  >([]);
  const { report, loading, error } = useReport(currentReportId || "");
  const {
    pupils,
    loading: loadingPupils,
    refetch: refetchPupils,
  } = usePupils();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

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
    if (!report) return;

    try {
      const content = [
        "# Performance Summary\n",
        report.performance_summary,
        "\n\n# Grading\n",
        report.grading,
        "\n\n# Misunderstood Concepts\n",
        report.misunderstood_concepts,
        "\n\n# Learning Materials\n",
        report.learning_material,
        "\n\n# Practice Exercises\n",
        report.practice_exercises,
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

  const handleUpdateTitle = async (newTitle: string) => {
    if (!currentReportId) return;

    try {
      const { error } = await supabase
        .from("reports")
        .update({ report_title: newTitle })
        .eq("id", currentReportId);

      if (error) throw error;

      setAvailableReports((prev) =>
        prev.map((report) =>
          report.id === currentReportId
            ? { ...report, report_title: newTitle }
            : report
        )
      );
      toast.success("Report title updated");
    } catch (error) {
      console.error("Error updating report title:", error);
      toast.error("Failed to update report title");
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

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

    if (!currentReportId || availableReports.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reports available for this student yet.
          </p>
        </div>
      );
    }

    if (currentReportId) {
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
    }

    if (!report) return null;

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
          <div className="flex-1 max-w-[21cm] mx-auto">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  if (editedTitle.trim() && editedTitle !== reportTitle) {
                    handleUpdateTitle(editedTitle.trim());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setEditedTitle(reportTitle);
                  }
                }}
                className="text-2xl font-semibold text-gray-900 w-full px-4 py-2 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-600 bg-transparent text-center"
              />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {reportTitle}
                </h2>
                <button
                  onClick={() => {
                    setEditedTitle(reportTitle);
                    setIsEditingTitle(true);
                  }}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label="Edit report title"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadReport}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              aria-label="Download report"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteReport}
              className="p-2 text-gray-700 hover:text-red-500 transition-colors"
              aria-label="Delete report"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report sections */}
        <div className="space-y-6 bg-white max-w-[21cm] mx-auto px-12 py-8 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] min-h-screen">
          {/* Performance Summary */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Performance Summary
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.performance_summary}</ReactMarkdown>
            </div>
          </div>

          {/* Grading */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Grading
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.grading}</ReactMarkdown>
            </div>
          </div>

          {/* Misunderstood Concepts */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Misunderstood Concepts
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.misunderstood_concepts}</ReactMarkdown>
            </div>
          </div>

          {/* Suggested Next Steps */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Suggested Next Steps
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.suggested_next_steps}</ReactMarkdown>
            </div>
          </div>

          {/* Learning Materials */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Learning Materials
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.learning_material}</ReactMarkdown>
            </div>
          </div>

          {/* Practice Exercises */}
          <div>
            <h3 className="text-lg font-medium text-indigo-600 mb-4 pb-2 border-b border-indigo-200">
              Practice Exercises
            </h3>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.practice_exercises}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
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
      <h2 className="text-4xl font-bold text-blue-900 text-center pt-10 tracking-wide">
        Grading and Report Creation
      </h2>
      <p className="text-lg text-gray-600 text-center mt-4 max-w-3xl mx-auto">
        Get handwritten answers from your pupils corrected, and receive
        personalised reports about concepts to focus on, resources and exercice
        propositions, and more
      </p>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-center gap-6">
              <label
                htmlFor="pupil"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Select Student
              </label>
              <div className="w-64">
                <select
                  id="pupil"
                  value={selectedPupilId}
                  onChange={handlePupilChange}
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  disabled={loadingPupils}
                >
                  <option value="" disabled>
                    Select Student
                  </option>
                  {pupils.map((pupil) => (
                    <option key={pupil.id} value={pupil.id}>
                      {pupil.name}
                    </option>
                  ))}
                </select>
              </div>
              {activeTab === "reports" && selectedPupilId && (
                <>
                  <label
                    htmlFor="report"
                    className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    Select Report
                  </label>
                  <div className="w-64">
                    <select
                      id="report"
                      value={currentReportId || ""}
                      onChange={(e) => setCurrentReportId(e.target.value)}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    >
                      {availableReports.map((report) => (
                        <option key={report.id} value={report.id}>
                          {report.report_title ||
                            new Date(report.requested_at).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <button
                onClick={() => setShowAddPupil(true)}
                className="px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
              >
                Or add New Student
              </button>
            </div>

            {/* Add Student Modal */}
            <Transition appear show={showAddPupil} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setShowAddPupil(false)}
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
                  <div className="fixed inset-0 bg-gray-500/75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-[500px] transform bg-white transition-all">
                        <div className="relative p-8">
                          <div className="flex items-center justify-between mb-8">
                            <Dialog.Title
                              as="h2"
                              className="text-2xl font-bold text-gray-900"
                            >
                              Add New Student
                            </Dialog.Title>
                            <button
                              onClick={() => setShowAddPupil(false)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <XMarkIcon className="w-6 h-6" />
                            </button>
                          </div>
                          <PupilForm
                            onSuccess={() => {
                              setShowAddPupil(false);
                              refetchPupils();
                            }}
                            onClose={() => setShowAddPupil(false)}
                          />
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
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
