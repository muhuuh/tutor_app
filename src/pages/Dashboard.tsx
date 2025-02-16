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
import {
  FiDownload,
  FiTrash2,
  FiMessageSquare,
  FiFileText,
} from "react-icons/fi";
import {
  downloadWordDocument,
  convertMarkdownToWord,
} from "../lib/markdownToWord";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import html2pdf from "html2pdf.js";
import { AuroraBackground } from "../components/UI/aurora-background";

const TABS = [
  {
    id: "chat",
    label: "Chat Assistant",
    icon: <FiMessageSquare className="w-5 h-5" />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FiFileText className="w-5 h-5" />,
  },
];

// Add this type for the ReactMarkdown components prop
type Components = {
  [key: string]: React.ComponentType<any>;
};

// Add this function near the top of the file, after imports
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

  // Convert simple exponential notation (e.g., 10^24)
  content = content.replace(
    /(\d+)\^(-?\d+)/g,
    (_, base, exp) => `$${base}^{${exp}}$`
  );

  // Convert units with superscripts (e.g., m²)
  content = content.replace(/([a-zA-Z])²/g, (_, unit) => `$${unit}^2$`);
  content = content.replace(/([a-zA-Z])³/g, (_, unit) => `$${unit}^3$`);

  // Convert compound units (e.g., N·m²/kg²)
  content = content.replace(/([A-Z]·[a-zA-Z²³]+\/[a-zA-Z²³]+)/g, (match) => {
    return `$\\text{${match
      .replace("·", "\\cdot ")
      .replace("²", "^2")
      .replace("³", "^3")}$`;
  });

  // Convert single capital letters that likely represent variables
  content = content.replace(/\s([A-Z])\s/g, (_, letter) => ` $${letter}$ `);

  return content;
};

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
  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchReports = async (pupilId: string) => {
    if (!pupilId) return;

    try {
      console.log("Fetching reports for pupil:", pupilId);
      const { data, error } = await supabase
        .from("reports")
        .select("id, requested_at, report_title")
        .eq("pupil_id", pupilId)
        .order("requested_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to load reports. Please try again.");
        return;
      }

      console.log("Reports fetched:", data);
      setAvailableReports(data || []);

      if (data && data.length > 0 && !currentReportId) {
        console.log("Setting initial report ID:", data[0].id);
        setCurrentReportId(data[0].id);
      }
    } catch (error) {
      console.error("Error in fetchReports:", error);
      toast.error("Failed to load reports. Please try again.");
    }
  };

  useEffect(() => {
    fetchReports(selectedPupilId);
  }, [selectedPupilId]);

  useEffect(() => {
    if (!user?.id) return;

    console.log("Setting up Supabase subscription for user:", user.id);

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
        async (payload) => {
          console.log("New report detected:", payload);

          // Update available reports list
          console.log("Fetching updated reports for pupil:", selectedPupilId);
          await fetchReports(selectedPupilId);

          // Set the current report ID and update the UI
          console.log("Setting current report ID:", payload.new.id);
          setCurrentReportId(payload.new.id);
          setActiveTab("reports");

          // Show success notification based on Supabase signal
          toast(
            (t) => (
              <div className="flex items-start gap-4">
                <div className="text-2xl">📋</div>
                <div>
                  <h3 className="font-medium text-base mb-1">Report Ready!</h3>
                  <p className="text-sm text-gray-600">
                    Your analysis report has been generated and is now available
                    in the Reports tab.
                  </p>
                </div>
              </div>
            ),
            {
              duration: 6000,
              style: {
                minWidth: "360px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
              },
            }
          );
        }
      )
      .subscribe((status) => {
        console.log("Supabase subscription status:", status);
      });

    return () => {
      console.log("Cleaning up Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedPupilId]);

  const handlePupilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPupilId(e.target.value);
  };

  const handleDownloadReport = async () => {
    if (!report || !pdfRef.current) return;

    try {
      const combinedReport = report.reduce((acc, section) => {
        const key = Object.keys(section)[0];
        return acc + section[key] + "\n\n";
      }, "");

      const processedContent = processContent(combinedReport);

      const currentReport = availableReports.find(
        (r) => r.id === currentReportId
      );
      const title =
        currentReport?.report_title ||
        `Report from ${new Date(
          currentReport?.requested_at || ""
        ).toLocaleDateString()}`;

      const opt = {
        margin: 20,
        filename: `${title}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(pdfRef.current).save();
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

    if (!report) return null;

    const currentReport = availableReports.find(
      (r) => r.id === currentReportId
    );
    const reportTitle =
      currentReport?.report_title ||
      `Report from ${new Date(
        currentReport?.requested_at || ""
      ).toLocaleDateString()}`;

    // Combine all report sections from the array of outputs
    const combinedReport = report.reduce((acc, section) => {
      // Get the first key (output1, output2, etc) from the section
      const key = Object.keys(section)[0];
      return acc + section[key] + "\n\n";
    }, "");

    console.log("combinedReport", combinedReport);

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
                <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
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

        {/* Report content */}
        <div className="space-y-6 bg-white max-w-[21cm] mx-auto px-12 py-16 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] min-h-screen">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ node, children }) => {
                  return <p className="my-2">{children}</p>;
                },
              }}
            >
              {processContent(combinedReport)}
            </ReactMarkdown>
          </div>
        </div>

        {/* Add this hidden div for PDF generation */}
        <div className="hidden">
          <div ref={pdfRef} className="p-8 bg-white">
            <h1 className="text-2xl font-bold mb-6">{reportTitle}</h1>
            <div
              className="prose prose-sm max-w-none"
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Handle paragraphs with page break control
                  p: ({ node, children }) => {
                    return (
                      <p
                        className="my-2"
                        style={{
                          pageBreakInside: "avoid",
                          breakInside: "avoid",
                        }}
                      >
                        {children}
                      </p>
                    );
                  },
                  // Handle headings with page break control
                  h1: ({ children }) => (
                    <h1
                      style={{
                        pageBreakBefore: "always",
                        pageBreakAfter: "avoid",
                        breakAfter: "avoid",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        pageBreakAfter: "avoid",
                        breakAfter: "avoid",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                }}
              >
                {processContent(combinedReport)}
              </ReactMarkdown>
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
    <AuroraBackground>
      <div className="relative w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 text-center pt-10 tracking-wide">
              Grading and Report Creation
            </h2>
            <p className="text-lg text-gray-600 text-center mt-4 max-w-3xl mx-auto">
              Get handwritten answers from your pupils corrected, and receive
              personalised reports about concepts to focus on, resources and
              exercice propositions, and more
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-center gap-6">
                <div className="w-64 shadow-sm rounded-xl">
                  <select
                    id="pupil"
                    value={selectedPupilId}
                    onChange={handlePupilChange}
                    className="w-full rounded-xl border-gray-200 bg-white/50 backdrop-blur px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:opacity-50"
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
                    <div className="w-64 shadow-sm rounded-xl">
                      <select
                        id="report"
                        value={currentReportId || ""}
                        onChange={(e) => setCurrentReportId(e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-white/50 backdrop-blur px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      >
                        {availableReports.map((report) => (
                          <option key={report.id} value={report.id}>
                            {report.report_title ||
                              new Date(
                                report.requested_at
                              ).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <button
                  onClick={() => setShowAddPupil(true)}
                  className="px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  Add New Student
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
                        <Dialog.Panel className="w-full max-w-[500px] transform bg-white rounded-2xl shadow-xl transition-all">
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

            <div className="px-6 border-b border-gray-100">
              <Tabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
