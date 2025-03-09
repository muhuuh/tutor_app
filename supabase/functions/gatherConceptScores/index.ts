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
    console.log("Starting gatherConceptScores edge function");
    console.log(
      "Request headers:",
      JSON.stringify(Object.fromEntries(req.headers.entries()))
    );
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
      `Processing concept scores for student: ${studentId}, language: ${language}`
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

    // Fetch existing reports for this student to analyze concepts
    console.log("Fetching reports");
    const { data: reports, error: reportsError } = await supabaseServiceClient
      .from("reports")
      .select("*")
      .eq("pupil_id", studentId)
      .order("requested_at", { ascending: false });

    if (reportsError) {
      throw new Error("Failed to fetch student reports");
    }

    console.log(`Found ${reports?.length || 0} reports for analysis`);

    // Process reports to extract only the necessary information and format as text
    let formattedReports = "";
    // Extract report IDs for the webhook payload
    const reportIds = reports?.map((report) => report.id) || [];

    if (reports && reports.length > 0) {
      formattedReports = reports
        .map((report) => {
          // Extract the title
          const title = report.report_title || "Untitled Report";

          // Extract output1 with a direct approach
          let output1Content = "";
          try {
            if (report.report) {
              // Check if it's already an object or a JSON string that needs parsing
              let contentArr;
              if (typeof report.report === "string") {
                contentArr = JSON.parse(report.report);
              } else {
                contentArr = report.report; // Already an object, use directly
              }

              // Just find the first object with output1 key
              if (Array.isArray(contentArr)) {
                for (const item of contentArr) {
                  if (item && typeof item === "object" && "output1" in item) {
                    output1Content = item.output1;
                    console.log(
                      `Found output1 in array (length: ${output1Content.length})`
                    );
                    break; // Found it, exit the loop
                  }
                }
              }
              // Log the extraction result
              if (!output1Content) {
                console.log(
                  `Failed to extract output1 from report ${report.id}`
                );
                console.log(
                  `Raw content sample: ${JSON.stringify(
                    report.report
                  ).substring(0, 150)}...`
                );
              }
            }
          } catch (e) {
            console.error(`Error processing report ${report.id}:`, e);
          }

          // Return formatted content
          return `## ${title}\n\n${
            output1Content || "*No assessment content available*"
          }\n\n---\n\n`;
        })
        .join("");
    } else {
      formattedReports = "No reports available for this student.";
    }

    console.log(`Processed ${reports?.length || 0} reports`);
    // Log a small sample of what we're sending
    if (formattedReports.length > 0) {
      console.log(
        `First 200 chars of formatted reports: ${formattedReports.substring(
          0,
          200
        )}...`
      );
    }

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
          reports: formattedReports, // Send the simplified text instead of complex JSON
          reportIds, // Include the array of report IDs
          language,
        }),
      }
    );

    const webhookData = await response.json();
    console.log(
      "Received webhook response:",
      JSON.stringify(webhookData).substring(0, 200) + "..."
    );

    // Function to extract JSON from the special format
    function extractJsonFromResponse(responseData: any) {
      try {
        // Add more detailed logging
        console.log("Response data type:", typeof responseData);
        console.log("Response keys:", Object.keys(responseData));

        // Case 1: If responseData has a string 'output' property (common n8n webhook response format)
        if (
          responseData &&
          typeof responseData === "object" &&
          "output" in responseData &&
          typeof responseData.output === "string"
        ) {
          console.log("Case 1: Found output property that's a string");

          // Try to parse the output string as JSON
          try {
            const parsedOutput = JSON.parse(responseData.output);
            console.log("Successfully parsed output string as JSON");
            return parsedOutput;
          } catch (parseError) {
            console.error("Error parsing output string as JSON:", parseError);

            // Try cleaning the string to handle escaped characters
            try {
              const cleanedString = responseData.output
                .replace(/\\n/g, "\n")
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, "\\");

              console.log(
                "Cleaned JSON string preview:",
                cleanedString.substring(0, 50) + "..."
              );

              return JSON.parse(cleanedString);
            } catch (cleanedError) {
              console.error(
                "Error parsing cleaned output string:",
                cleanedError
              );
            }
          }
        }

        // Case 2: If it's already in the expected format, return as is
        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData) &&
          Object.keys(responseData).some((key) =>
            Array.isArray(responseData[key])
          )
        ) {
          console.log(
            "Case 2: Data already in expected format with concept arrays"
          );
          return responseData;
        }

        // Case 3: If it's an object with an 'output' property (not in an array)
        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData) &&
          "output" in responseData
        ) {
          console.log("Case 3: Direct object with output property");
          const output = responseData.output;
          console.log("Output preview:", output.substring(0, 50) + "...");

          // Try to extract JSON from the markdown code block with a simpler regex
          const jsonStringMatch = output.match(
            /```json\s*\n([\s\S]*?)\n\s*```/
          );

          if (jsonStringMatch && jsonStringMatch[1]) {
            console.log("Found JSON string in markdown code block");
            const jsonString = jsonStringMatch[1];
            console.log(
              "Extracted JSON string preview:",
              jsonString.substring(0, 50) + "..."
            );

            try {
              const parsedJson = JSON.parse(jsonString);
              console.log("Successfully parsed the extracted JSON");
              return parsedJson;
            } catch (parseError) {
              console.error(
                "Error parsing the extracted JSON string:",
                parseError
              );
              // Try cleaning the string further (handling escaped characters, etc.)
              try {
                const cleanedString = jsonString
                  .replace(/\\n/g, "\n")
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, "\\");
                console.log(
                  "Cleaned JSON string preview:",
                  cleanedString.substring(0, 50) + "..."
                );
                return JSON.parse(cleanedString);
              } catch (cleanedError) {
                console.error(
                  "Error parsing the cleaned JSON string:",
                  cleanedError
                );
              }
            }
          } else {
            console.log(
              "No JSON markdown code block found, trying direct JSON parse"
            );
            // If no markdown code block, try to extract JSON directly
            try {
              return JSON.parse(output);
            } catch (e) {
              console.error("Failed to parse output as direct JSON:", e);
            }
          }

          // If all parsing attempts fail, try a more aggressive approach - look for any JSON object
          console.log("Trying more aggressive JSON extraction");
          const anyJsonMatch = output.match(/\{[\s\S]*\}/);
          if (anyJsonMatch) {
            try {
              console.log("Found a JSON-like object, trying to parse");
              return JSON.parse(anyJsonMatch[0]);
            } catch (e) {
              console.error("Failed to parse with aggressive method:", e);
            }
          }
        }

        // Case 4: If it's an array with an object that has an 'output' property (old format)
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0].output
        ) {
          console.log("Case 4: Array with output property");
          const output = responseData[0].output;
          console.log("Output preview:", output.substring(0, 50) + "...");

          // Try to extract JSON from the markdown code block with a simpler regex
          const jsonStringMatch = output.match(
            /```json\s*\n([\s\S]*?)\n\s*```/
          );

          if (jsonStringMatch && jsonStringMatch[1]) {
            console.log("Found JSON string in markdown code block");
            const jsonString = jsonStringMatch[1];
            console.log(
              "Extracted JSON string preview:",
              jsonString.substring(0, 50) + "..."
            );

            try {
              const parsedJson = JSON.parse(jsonString);
              console.log("Successfully parsed the extracted JSON");
              return parsedJson;
            } catch (parseError) {
              console.error(
                "Error parsing the extracted JSON string:",
                parseError
              );
              // Try cleaning the string further (handling escaped characters, etc.)
              try {
                const cleanedString = jsonString
                  .replace(/\\n/g, "\n")
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, "\\");
                console.log(
                  "Cleaned JSON string preview:",
                  cleanedString.substring(0, 50) + "..."
                );
                return JSON.parse(cleanedString);
              } catch (cleanedError) {
                console.error(
                  "Error parsing the cleaned JSON string:",
                  cleanedError
                );
              }
            }
          } else {
            console.log(
              "No JSON markdown code block found, trying direct JSON parse"
            );
            // If no markdown code block, try to extract JSON directly
            try {
              return JSON.parse(output);
            } catch (e) {
              console.error("Failed to parse output as direct JSON:", e);
            }
          }

          // If all parsing attempts fail, try a more aggressive approach - look for any JSON object
          console.log("Trying more aggressive JSON extraction");
          const anyJsonMatch = output.match(/\{[\s\S]*\}/);
          if (anyJsonMatch) {
            try {
              console.log("Found a JSON-like object, trying to parse");
              return JSON.parse(anyJsonMatch[0]);
            } catch (e) {
              console.error("Failed to parse with aggressive method:", e);
            }
          }
        }

        console.log("Unrecognized response format, returning original data");
        return responseData;
      } catch (error) {
        console.error("Error extracting JSON from response:", error);
        return responseData; // Return original on error
      }
    }

    // Extract and parse the actual data
    const parsedData = extractJsonFromResponse(webhookData);
    console.log(
      "Parsed webhook data:",
      JSON.stringify(parsedData).substring(0, 200) + "..."
    );

    // Create a mapping of report titles to report IDs
    const reportTitleToIdMap: Record<string, string> = {};
    if (reports && reports.length > 0) {
      reports.forEach((report) => {
        if (report.report_title && report.id) {
          reportTitleToIdMap[report.report_title] = report.id;
        }
      });
    }

    // Transform the parsed data to include report IDs (as exercise_id for the component)
    const transformedData: Record<
      string,
      Array<{ score: number; exercise_id: string }>
    > = {};

    // Check if parsedData has concept keys with arrays of score objects
    if (parsedData && typeof parsedData === "object") {
      Object.entries(parsedData).forEach(([concept, scores]) => {
        if (Array.isArray(scores)) {
          transformedData[concept] = scores.map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "score" in item &&
              "report_title" in item
            ) {
              const reportTitle = item.report_title as string;
              const reportId = reportTitleToIdMap[reportTitle] || reportTitle;

              return {
                score:
                  typeof item.score === "number"
                    ? item.score
                    : parseInt(item.score as string, 10) || 0,
                exercise_id: reportId, // Use report ID as exercise_id, fallback to title if ID not found
                report_title: reportTitle, // Keep the original title for reference
              };
            }
            return { score: 0, exercise_id: "unknown" };
          });
        }
      });
    }

    // Debug logged for the transformed data structure
    console.log("Transformed data type:", typeof transformedData);
    console.log("Transformed data keys:", Object.keys(transformedData));

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table");

    // First check if the record already exists
    const { data: existingProfile, error: checkError } =
      await supabaseServiceClient
        .from("profiles_dashboard")
        .select("id, concept_score")
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
          concept_score: transformedData,
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
          concept_score: transformedData,
        });
    }

    const { error: updateError } = updateResult;

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(
        `Failed to update concept scores: ${updateError.message}`
      );
    }

    console.log("Concept scores successfully generated and stored");

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
        data: transformedData,
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isSubscriptionError ? 402 : 500,
      }
    );
  }
});
