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
    console.log("Starting generateNotesSummary edge function");

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
      `Processing notes summary for student: ${studentId}, language: ${language}`
    );

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Fetch teacher notes
    console.log("Fetching teacher notes");
    const { data: pupilData, error: pupilError } = await supabaseServiceClient
      .from("pupils")
      .select("teacher_notes, id")
      .eq("id", studentId)
      .single();

    if (pupilError) {
      console.warn(
        `Warning: Could not fetch pupil notes: ${pupilError.message}`
      );
      // Still proceed, but will have empty notes
    }

    const teacherNotes = pupilData?.teacher_notes || [];
    console.log(`Found ${teacherNotes.length} teacher notes`);

    // If no notes are available, return a default structure
    if (!teacherNotes || teacherNotes.length === 0) {
      console.log("No teacher notes available to summarize");
      const emptyNotesData = {
        ai_summary: "No teacher notes available to summarize.",
      };

      // Update the profiles_dashboard table with empty notes data
      await supabaseServiceClient.from("profiles_dashboard").upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          notes: emptyNotesData,
        },
        {
          onConflict: "teacher_id,student_id",
          ignoreDuplicates: false,
        }
      );

      return new Response(
        JSON.stringify({
          ok: true,
          data: emptyNotesData,
          message: "No notes found to summarize",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Make the webhook call to n8n AI service
    console.log("Calling n8n webhook for notes summarization");
    const response = await fetch(
      Deno.env.get("N8N_NOTES_SUMMARY_WEBHOOK_URL") ??
        "https://placeholder-webhook-url.com/notes-summary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId,
          notes: teacherNotes,
          language,
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Format the notes data - only store the AI summary, not the notes themselves
    const notesData = {
      ai_summary: webhookData.summary || "No summary available.",
    };

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table with notes summary");
    const { data: updateData, error: updateError } = await supabaseServiceClient
      .from("profiles_dashboard")
      .upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          notes: notesData,
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

    console.log("Notes summary successfully generated and stored");
    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          ai_summary: notesData.ai_summary,
          pupil_id: pupilData?.id, // Return pupil ID to reference for fetching actual notes
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Format error message
    console.error("Error in generateNotesSummary:", error);
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
