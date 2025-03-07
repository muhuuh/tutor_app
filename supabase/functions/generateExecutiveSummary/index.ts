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
    console.log("Starting generateExecutiveSummary edge function");
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

    const { studentId, teacherId } = await req.json();
    console.log(`Processing executive summary for student: ${studentId}`);

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Fetch existing reports for this student to analyze trends
    const { data: reports, error: reportsError } = await supabaseServiceClient
      .from("reports")
      .select("*")
      .eq("pupil_id", studentId)
      .order("created_at", { ascending: false });

    if (reportsError) {
      throw new Error("Failed to fetch student reports");
    }

    console.log(`Found ${reports?.length || 0} reports for analysis`);

    // Make the webhook call to n8n AI service
    console.log("Calling n8n webhook for executive summary generation");
    const response = await fetch(
      Deno.env.get("N8N_EXECUTIVE_SUMMARY_WEBHOOK_URL") ??
        "https://placeholder-webhook-url.com/executive-summary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId,
          reports: reports || [],
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Format the executive summary data
    const executiveSummaryData = {
      overall_trend_numeric: webhookData.overall_trend_numeric || 0,
      overall_trend_text:
        webhookData.overall_trend_text || "No trend data available",
      strengths_weaknesses:
        webhookData.strengths_weaknesses ||
        "No strengths/weaknesses data available",
    };

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table");
    const { data: profileData, error: profileError } =
      await supabaseServiceClient.from("profiles_dashboard").upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          executive_summary: executiveSummaryData,
        },
        {
          onConflict: "teacher_id,student_id",
          ignoreDuplicates: false,
        }
      );

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw new Error(
        `Failed to update profile dashboard: ${profileError.message}`
      );
    }

    console.log("Executive summary successfully generated and stored");
    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: executiveSummaryData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Format error message
    console.error("Error in generateExecutiveSummary:", error);
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
