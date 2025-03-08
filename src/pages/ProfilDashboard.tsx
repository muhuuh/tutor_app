import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ExecutiveSummary } from "../components/Profil/ExecutiveSummary";
import { ConceptMasteryChart } from "../components/Profil/ConceptMasteryChart";
import { FocusPanel } from "../components/Profil/FocusPanel";
import { PersonalNotes } from "../components/Profil/PersonalNotes";
import { CommunicationTools } from "../components/Profil/CommunicationTools";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";

interface ProfileData {
  id: string;
  teacher_id: string;
  student_id: string;
  report_ids: string[];
  executive_summary: {
    overall_trend_numeric: number;
    overall_trend_text: string;
    strengths_weaknesses: string;
  };
  concept_score: Record<
    string,
    Array<{ score: number; exercise_id: string; report_title?: string }>
  >;
  focus_panel: {
    priority_concepts: Array<{
      concept: string;
      priority: number;
    }>;
  };
  notes:
    | {
        ai_summary: string;
      }
    | string;
  communication_report: {
    reports_list: Array<{
      id: string;
      title: string;
      date: string;
      content: string;
    }>;
  };
}

interface ProfilDashboardProps {
  pupilId: string;
}

export function ProfilDashboard({ pupilId }: ProfilDashboardProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [generatingReport, setGeneratingReport] = useState(false);
  // Get current UI language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    // Try to get the language from localStorage or use browser language preference
    return (
      localStorage.getItem("language") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  });

  useEffect(() => {
    if (pupilId) {
      fetchProfileData(pupilId);
    }
  }, [pupilId]);

  if (!pupilId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please select a student to view their profile
        </p>
      </div>
    );
  }

  const fetchProfileData = async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if profile exists
      const { data, error } = await supabase
        .from("profiles_dashboard")
        .select("*")
        .eq("student_id", studentId)
        .eq("teacher_id", user.id)
        .single();

      if (error) {
        console.log("No existing profile found, initializing new one");
        // If the profile doesn't exist yet, we'll initialize with placeholders
        setProfileData({
          id: "",
          teacher_id: user.id,
          student_id: studentId,
          report_ids: [],
          executive_summary: {
            overall_trend_numeric: 0,
            overall_trend_text:
              "No data available yet. Click refresh to generate.",
            strengths_weaknesses: "",
          },
          concept_score: {},
          focus_panel: {
            priority_concepts: [],
          },
          notes: {
            ai_summary: "",
          },
          communication_report: {
            reports_list: [],
          },
        });
      } else {
        setProfileData(data as ProfileData);
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const refreshExecutiveSummary = async () => {
    try {
      setRefreshing((prev) => ({ ...prev, executiveSummary: true }));
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "generateExecutiveSummary",
        {
          body: {
            studentId: pupilId,
            teacherId: user.id,
            language,
          },
        }
      );

      if (error) throw error;

      console.log("Executive summary refreshed successfully");
      // Refresh the profile data after update
      fetchProfileData(pupilId);
    } catch (err) {
      console.error("Failed to refresh executive summary:", err);
      setError("Failed to refresh executive summary");
    } finally {
      setRefreshing((prev) => ({ ...prev, executiveSummary: false }));
    }
  };

  const refreshConceptScores = async () => {
    try {
      setRefreshing((prev) => ({ ...prev, conceptScores: true }));
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "gatherConceptScores",
        {
          body: {
            studentId: pupilId,
            teacherId: user.id,
            language,
          },
        }
      );

      if (error) throw error;

      console.log("Concept scores refreshed successfully");
      // Refresh the profile data after update
      fetchProfileData(pupilId);
    } catch (err) {
      console.error("Failed to refresh concept scores:", err);
      setError("Failed to refresh concept scores");
    } finally {
      setRefreshing((prev) => ({ ...prev, conceptScores: false }));
    }
  };

  const refreshFocusConcepts = async () => {
    try {
      setRefreshing((prev) => ({ ...prev, focusConcepts: true }));
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "identifyFocusConcepts",
        {
          body: {
            studentId: pupilId,
            teacherId: user.id,
            language,
          },
        }
      );

      if (error) throw error;

      console.log("Focus concepts refreshed successfully");
      // Refresh the profile data after update
      fetchProfileData(pupilId);
    } catch (err) {
      console.error("Failed to refresh focus concepts:", err);
      setError("Failed to identify focus concepts");
    } finally {
      setRefreshing((prev) => ({ ...prev, focusConcepts: false }));
    }
  };

  const refreshNotesSummary = async () => {
    try {
      setRefreshing((prev) => ({ ...prev, notesSummary: true }));
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "generateNotesSummary",
        {
          body: {
            studentId: pupilId,
            teacherId: user.id,
            language,
          },
        }
      );

      if (error) throw error;

      console.log("Notes summary refreshed successfully");
      // Refresh the profile data after update
      fetchProfileData(pupilId);
    } catch (err) {
      console.error("Failed to refresh notes summary:", err);
      setError("Failed to generate notes summary");
    } finally {
      setRefreshing((prev) => ({ ...prev, notesSummary: false }));
    }
  };

  const generateParentReport = async (reportTitle: string) => {
    try {
      setGeneratingReport(true);
      setError(null);

      // Get the current user (teacher)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "generateParentReport",
        {
          body: {
            studentId: pupilId,
            teacherId: user.id,
            reportTitle: reportTitle,
            language,
          },
        }
      );

      if (error) throw error;

      console.log("Parent report generated successfully");
      // Refresh the profile data after update
      fetchProfileData(pupilId);
    } catch (err) {
      console.error("Failed to generate parent report:", err);
      setError("Failed to generate parent report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleViewReport = (reportId: string) => {
    // Redirect to the report view page
    window.open(`/reports/${reportId}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>

      {loading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>{error}</p>
          <button
            onClick={() => fetchProfileData(pupilId)}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecutiveSummary
              data={profileData?.executive_summary}
              isRefreshing={refreshing.executiveSummary}
              onRefresh={refreshExecutiveSummary}
            />

            <FocusPanel
              data={profileData?.focus_panel}
              isRefreshing={refreshing.focusConcepts}
              onRefresh={refreshFocusConcepts}
            />
          </div>

          <ConceptMasteryChart
            data={profileData?.concept_score}
            isRefreshing={refreshing.conceptScores}
            onRefresh={refreshConceptScores}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonalNotes
              data={profileData?.notes}
              studentId={pupilId}
              isRefreshing={refreshing.notesSummary}
              onRefresh={refreshNotesSummary}
            />

            <CommunicationTools
              data={profileData?.communication_report}
              isGenerating={generatingReport}
              studentId={pupilId}
              onGenerateReport={generateParentReport}
              onViewReport={handleViewReport}
            />
          </div>
        </div>
      )}
    </div>
  );
}
