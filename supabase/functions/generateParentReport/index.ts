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
    console.log("Starting generateParentReport edge function");

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

    const {
      studentId,
      teacherId,
      reportTitle = "Parent Progress Report",
    } = await req.json();
    console.log(`Generating parent report for student: ${studentId}`);

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Get the existing profile data to use all available insights
    console.log("Fetching profile dashboard data");
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

    // Get student info
    console.log("Fetching student information");
    const { data: pupilData, error: pupilError } = await supabaseServiceClient
      .from("pupils")
      .select("*")
      .eq("id", studentId)
      .single();

    if (pupilError) {
      console.warn(
        `Warning: Could not fetch pupil data: ${pupilError.message}`
      );
      // Continue anyway with minimal pupil data
    }

    // Make the webhook call to n8n AI service
    console.log("Calling n8n webhook for parent report generation");
    const response = await fetch(
      Deno.env.get("N8N_PARENT_REPORT_WEBHOOK_URL") ??
        "https://placeholder-webhook-url.com/parent-report",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId,
          reportTitle,
          pupilData: pupilData || { id: studentId },
          profileData: profileData || {},
          timestamp: new Date().toISOString(),
        }),
      }
    );

    const webhookData = await response.json();
    console.log("Received webhook response for parent report");

    // Add the report to the standard reports table
    console.log("Adding report to reports table");
    const { data: reportData, error: reportError } = await supabaseServiceClient
      .from("reports")
      .insert({
        teacher_id: teacherId,
        pupil_id: studentId,
        report_title: reportTitle,
        content: webhookData.reportContent || "No report content generated",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (reportError) {
      console.error("Error creating report:", reportError);
      throw new Error(`Failed to create report: ${reportError.message}`);
    }

    // Get existing communication reports or initialize empty array
    console.log("Fetching existing communication reports");
    const { data: existingProfileData } = await supabaseServiceClient
      .from("profiles_dashboard")
      .select("communication_report")
      .eq("student_id", studentId)
      .eq("teacher_id", teacherId)
      .single();

    // Add the new report to the communication_report list
    const existingReports =
      existingProfileData?.communication_report?.reports_list || [];
    const newReportsList = [
      ...existingReports,
      {
        id: reportData.id,
        title: reportTitle,
        date: new Date().toISOString(),
      },
    ];

    const communicationReportData = {
      reports_list: newReportsList,
    };

    // Update the communication report data in the profile
    console.log("Updating profiles_dashboard with new communication report");
    const { data: updateData, error: updateError } = await supabaseServiceClient
      .from("profiles_dashboard")
      .upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          communication_report: communicationReportData,
        },
        {
          onConflict: "teacher_id,student_id",
          ignoreDuplicates: false,
        }
      );

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Continue anyway since the report is already in the reports table
    }

    console.log("Parent report successfully generated and stored");
    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          reportId: reportData.id,
          reportTitle: reportTitle,
          communicationReports: newReportsList,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Format error message
    console.error("Error in generateParentReport:", error);
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
