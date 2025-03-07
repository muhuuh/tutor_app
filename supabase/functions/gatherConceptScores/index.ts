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
    console.log("Starting gatherConceptScores edge function");
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
    console.log(`Processing concept scores for student: ${studentId}`);

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Fetch existing reports for this student to analyze concepts
    console.log("Fetching reports");
    const { data: reports, error: reportsError } = await supabaseServiceClient
      .from("reports")
      .select("*")
      .eq("pupil_id", studentId)
      .order("created_at", { ascending: false });

    if (reportsError) {
      throw new Error("Failed to fetch student reports");
    }

    console.log(`Found ${reports?.length || 0} reports for analysis`);

    // Fetch corrections data to get more detailed concept information
    console.log("Fetching corrections data");
    const { data: corrections, error: correctionsError } =
      await supabaseServiceClient
        .from("corrections")
        .select("*,exams(*)")
        .eq("pupil_id", studentId);

    if (correctionsError) {
      throw new Error("Failed to fetch corrections data");
    }

    console.log(`Found ${corrections?.length || 0} corrections for analysis`);

    // Make the webhook call to n8n AI service
    console.log("Calling n8n webhook for concept scores generation");
    const response = await fetch(
      Deno.env.get("N8N_CONCEPT_SCORES_WEBHOOK_URL") ??
        "https://placeholder-webhook-url.com/concept-scores",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId,
          reports: reports || [],
          corrections: corrections || [],
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Format the concept scores data
    // The response should be an object with each concept as a key and an array of scores with related exercise IDs
    const conceptScores = webhookData.conceptScores || {};
    console.log(`Processed ${Object.keys(conceptScores).length} concepts`);

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table");
    const { data: profileData, error: profileError } =
      await supabaseServiceClient.from("profiles_dashboard").upsert(
        {
          teacher_id: teacherId,
          student_id: studentId,
          concept_score: conceptScores,
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

    console.log("Concept scores successfully generated and stored");
    // Success case
    return new Response(
      JSON.stringify({
        ok: true,
        data: conceptScores,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Format error message
    console.error("Error in gatherConceptScores:", error);
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
