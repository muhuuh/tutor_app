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

    const {
      studentId,
      teacherId,
      language = "en",
      filteredNotes = null,
    } = await req.json();
    console.log(
      `Processing notes summary for student: ${studentId}, language: ${language}${
        filteredNotes ? ", with filtered notes" : ""
      }`
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

    // Use filtered notes if provided, otherwise use all notes
    let teacherNotes;
    if (Array.isArray(filteredNotes) && filteredNotes.length > 0) {
      console.log(
        `Using ${filteredNotes.length} filtered notes provided by client`
      );
      teacherNotes = filteredNotes;
    } else {
      teacherNotes = pupilData?.teacher_notes || [];
      console.log(
        `Using all ${teacherNotes.length} teacher notes from database`
      );
    }

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

    // Format teacher notes as a single text string for easier n8n processing
    // Add numbering and spacing for better readability
    const formattedNotes = teacherNotes
      .map((note, index) => `Note ${index + 1}: ${note}`)
      .join("\n\n");

    console.log("Formatted teacher notes for easier processing");

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
          notes: formattedNotes,
          language,
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Extract the markdown summary from the response
    // Handle both formats - either an array with output field or direct object with summary field
    let aiSummaryText = "No summary available.";

    if (
      Array.isArray(webhookData) &&
      webhookData.length > 0 &&
      webhookData[0].output
    ) {
      console.log("Using 'output' field from array response");
      aiSummaryText = webhookData[0].output;
    } else if (webhookData.summary) {
      console.log("Using 'summary' field from direct response");
      aiSummaryText = webhookData.summary;
    } else if (webhookData.output) {
      console.log("Using 'output' field from direct response");
      aiSummaryText = webhookData.output;
    } else {
      console.log(
        "Could not find summary in webhook response, using default text"
      );
    }

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table with notes summary as text");
    const { data: updateData, error: updateError } = await supabaseServiceClient
      .from("profiles_dashboard")
      .upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          notes: aiSummaryText, // Store directly as text instead of JSON object
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

    // Now we need to get the pupil ID for the response
    let pupilId: string | null = null;

    // Only fetch the pupil ID if we don't already have it
    if (studentId && !pupilId) {
      const { data: pupilIdData, error: pupilIdError } =
        await supabaseServiceClient
          .from("pupils")
          .select("id")
          .eq("id", studentId)
          .single();

      if (!pupilIdError && pupilIdData) {
        pupilId = pupilIdData.id;
      }
    }

    console.log("Notes summary successfully generated and stored");

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
          ai_summary: aiSummaryText,
          pupil_id: pupilId, // Return pupil ID to reference for fetching actual notes
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
