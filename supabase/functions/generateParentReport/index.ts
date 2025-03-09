import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CREDIT_COSTS } from "https://gist.githubusercontent.com/muhuuh/b23ffa4bec5475f446476a511e2cb100/raw/creditCosts.ts";
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
      language = "en",
    } = await req.json();
    console.log(
      `Generating parent report for student: ${studentId}, language: ${language}`
    );

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Use service client for subscription check
    const { data: subscription, error: subscriptionError } =
      await supabaseServiceClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (subscriptionError) {
      throw new Error("Failed to check subscription status");
    }

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Check if subscription is valid
    const now = new Date();
    const validUntil = new Date(subscription.valid_until);
    if (validUntil < now) {
      console.log("Subscription expired:", {
        validUntil: validUntil.toISOString(),
        now: now.toISOString(),
      });
      return new Response(
        JSON.stringify({
          ok: false,
          errorType: "subscription_error",
          message: "Your subscription has expired",
          requiredCredits: CREDIT_COSTS.PROFILE_UPDATE,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if user has enough credits
    const requiredCredits = CREDIT_COSTS.PROFILE_UPDATE;
    if (
      subscription.used_credits + requiredCredits >
      subscription.max_credits
    ) {
      console.log("Credit check:", {
        used: subscription.used_credits,
        required: requiredCredits,
        max: subscription.max_credits,
      });
      console.log("Insufficient credits, returning error payload");
      return new Response(
        JSON.stringify({
          ok: false,
          errorType: "subscription_error",
          message: "Insufficient credits",
          requiredCredits: CREDIT_COSTS.PROFILE_UPDATE,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
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

    // Format profile data as text for the webhook
    console.log("Formatting profile data for parent report generation");

    // Executive Summary
    let summaryText = "No executive summary available.";
    if (profileData?.executive_summary) {
      const summary = profileData.executive_summary;
      summaryText =
        `### Executive Summary\n\n` +
        `Overall Trend: ${
          summary.overall_trend_text ||
          summary.general_performance ||
          "Not available"
        }\n\n` +
        `Strengths & Weaknesses:\n${
          summary.strengths_weaknesses || "Not available"
        }`;
    }

    // Concept Scores
    let conceptScoresText = "No concept mastery data available.";
    if (
      profileData?.concept_score &&
      Object.keys(profileData.concept_score).length > 0
    ) {
      conceptScoresText =
        `### Concept Mastery\n\n` +
        Object.entries(profileData.concept_score)
          .map(([concept, scores]) => {
            const avgScore =
              Array.isArray(scores) && scores.length > 0
                ? scores.reduce((sum, item) => sum + item.score, 0) /
                  scores.length
                : "N/A";

            return `- ${concept}: Average score ${
              typeof avgScore === "number" ? avgScore.toFixed(2) : avgScore
            }`;
          })
          .join("\n");
    }

    // Focus Panel
    let focusAreasText = "No focus areas identified.";
    if (profileData?.focus_panel?.priority_concepts?.length > 0) {
      focusAreasText =
        `### Priority Areas for Improvement\n\n` +
        profileData.focus_panel.priority_concepts
          .map(
            (item, index) =>
              `${index + 1}. ${item.concept} (Priority: ${item.priority}/10)`
          )
          .join("\n");
    }

    // Notes
    let notesText = "No teacher notes available.";
    if (typeof profileData?.notes === "string" && profileData.notes) {
      notesText = `### Teacher Notes Summary\n\n${profileData.notes}`;
    } else if (profileData?.notes?.ai_summary) {
      notesText = `### Teacher Notes Summary\n\n${profileData.notes.ai_summary}`;
    }

    // Combine all data into a structured format
    const formattedProfileData = `
# Student Profile: ${pupilData?.name || "Unknown Student"}

${summaryText}

${conceptScoresText}

${focusAreasText}

${notesText}
`;

    console.log("Formatted profile data into a simplified text format");

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
          pupilName: pupilData?.name || "Unknown Student",
          pupilLevel: pupilData?.pupil_level || "Unknown Level",
          profileData: formattedProfileData,
          timestamp: new Date().toISOString(),
          language,
        }),
      }
    );

    const webhookData = await response.json();
    console.log("Received webhook response for parent report");

    // Extract the report content from the webhook response
    let reportContent = "";

    // First try to handle the most common case - direct output field containing markdown
    if (
      webhookData &&
      webhookData.output &&
      typeof webhookData.output === "string"
    ) {
      console.log("Found 'output' field with markdown content");
      reportContent = webhookData.output;
    }
    // If no output field is found, use a fallback message
    else {
      console.log("No direct 'output' field found in webhook response");
      reportContent =
        "Unable to generate report content. Please try again later.";
    }

    console.log("Report content length:", reportContent.length);
    console.log(
      "Report content preview:",
      reportContent.substring(0, 100) + "..."
    );

    // Generate a unique ID for the report
    const reportId = crypto.randomUUID();
    const reportTimestamp = new Date().toISOString();

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
        id: reportId,
        title: reportTitle,
        date: reportTimestamp,
        content: reportContent,
      },
    ];

    const communicationReportData = {
      reports_list: newReportsList,
    };

    // Update the communication report data in the profile
    console.log("Updating profiles_dashboard with new parent report");

    // First check if the record already exists
    const { data: existingProfile, error: checkError } =
      await supabaseServiceClient
        .from("profiles_dashboard")
        .select("id")
        .eq("teacher_id", teacherId)
        .eq("student_id", studentId)
        .maybeSingle();

    let updateResult;
    if (existingProfile) {
      // If record exists, update it
      console.log("Updating existing profile record:", existingProfile.id);
      updateResult = await supabaseServiceClient
        .from("profiles_dashboard")
        .update({
          communication_report: communicationReportData,
        })
        .eq("teacher_id", teacherId)
        .eq("student_id", studentId);
    } else {
      // If no record exists, insert a new one
      console.log("Creating new profile record");
      updateResult = await supabaseServiceClient
        .from("profiles_dashboard")
        .insert({
          teacher_id: teacherId,
          student_id: studentId,
          communication_report: communicationReportData,
        });
    }

    const { error: updateError } = updateResult;

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(`Failed to save parent report: ${updateError.message}`);
    }

    console.log("Parent report successfully generated and stored");

    // Update used credits after successful operation
    const { error: creditUpdateError } = await supabaseServiceClient
      .from("user_subscriptions")
      .update({
        used_credits: subscription.used_credits + requiredCredits,
      })
      .eq("id", subscription.id);

    if (creditUpdateError) {
      console.error("Error updating credits:", creditUpdateError);
      // Continue anyway - the operation was successful
    } else {
      console.log(`Successfully deducted ${requiredCredits} credits`);
    }

    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          reportId: reportId,
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
    const isSubscriptionError =
      errorMessage.includes("subscription") ||
      errorMessage.includes("credit") ||
      errorMessage.includes("expired");

    return new Response(
      JSON.stringify({
        error: errorMessage,
        type: isSubscriptionError ? "subscription_error" : "general_error",
        requiredCredits: CREDIT_COSTS.PROFILE_UPDATE,
      }),
      {
        status: isSubscriptionError ? 402 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
