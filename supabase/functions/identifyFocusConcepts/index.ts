import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting identifyFocusConcepts edge function");

    // Create regular client for auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create both clients - one for auth, one for service operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_KEY_SUPABASE") ?? ""
    );

    // Verify user with regular client
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      throw new Error("Invalid token");
    }

    const { studentId, teacherId, language = "en" } = await req.json();
    console.log(
      `Processing focus concepts for student: ${studentId}, language: ${language}`
    );

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Get the existing profile data to access concept scores
    console.log("Fetching existing profile data");
    const { data: profileData, error: profileError } =
      await supabaseServiceClient
        .from("profiles_dashboard")
        .select("*")
        .eq("student_id", studentId)
        .eq("teacher_id", teacherId)
        .single();

    if (profileError && profileError.code !== "PGRST116") {
      // Not found error
      throw new Error(`Failed to fetch profile data: ${profileError.message}`);
    }

    // Fetch teacher notes for context
    console.log("Fetching teacher notes");
    const { data: pupilData, error: pupilError } = await supabaseServiceClient
      .from("pupils")
      .select("teacher_notes")
      .eq("id", studentId)
      .single();

    if (pupilError) {
      console.warn(
        `Warning: Could not fetch pupil notes: ${pupilError.message}`
      );
      // Continue anyway as notes are optional context
    }

    // Simplify concept scores for easier n8n processing
    let conceptScoresText = "No concept scores available.";
    if (
      profileData?.concept_score &&
      Object.keys(profileData.concept_score).length > 0
    ) {
      conceptScoresText = Object.entries(profileData.concept_score)
        .map(([concept, scores]) => {
          // Format scores as a simple list
          const scoresList = Array.isArray(scores)
            ? scores
                .map(
                  (score) =>
                    `Score: ${score.score}, Exercise: ${score.exercise_id}`
                )
                .join("\n  ")
            : "No detailed scores";

          return `## Concept: ${concept}\n  ${scoresList}`;
        })
        .join("\n\n");
    }

    // Simplify executive summary for easier n8n processing
    let summaryText = "No executive summary available.";
    if (profileData?.executive_summary) {
      const summary = profileData.executive_summary;
      summaryText =
        `## Executive Summary\n\n` +
        `Overall Trend: ${summary.overall_trend_text || "Not available"}\n\n` +
        `Strengths & Weaknesses:\n${
          summary.strengths_weaknesses || "Not available"
        }`;
    }

    // Format teacher notes as text
    const teacherNotesText = Array.isArray(pupilData?.teacher_notes)
      ? pupilData.teacher_notes.join("\n\n")
      : pupilData?.teacher_notes || "No teacher notes available.";

    // Make the webhook call to n8n AI service
    console.log("Calling n8n webhook for focus concepts identification");
    const response = await fetch(
      Deno.env.get("N8N_FOCUS_CONCEPTS_WEBHOOK_URL") ??
        "https://placeholder-webhook-url.com/focus-concepts",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId,
          conceptScores: conceptScoresText,
          executiveSummary: summaryText,
          teacherNotes: teacherNotesText,
          language,
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Format the focus panel data
    const focusPanelData = {
      priority_concepts: webhookData.priority_concepts || [],
    };

    console.log(
      `Identified ${focusPanelData.priority_concepts.length} priority concepts`
    );

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table");
    const { data: updateData, error: updateError } = await supabaseServiceClient
      .from("profiles_dashboard")
      .upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          focus_panel: focusPanelData,
        },
        {
          onConflict: "teacher_id,student_id",
          ignoreDuplicates: false,
        }
      );

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(
        `Failed to update profile dashboard: ${updateError.message}`
      );
    }

    console.log("Focus concepts successfully identified and stored");
    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: focusPanelData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Format error message
    console.error("Error in identifyFocusConcepts:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        type: "general_error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
