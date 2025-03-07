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
      `Processing executive summary for student: ${studentId}, language: ${language}`
    );

    // Verify that the teacherId matches the authenticated user
    if (teacherId !== user.id) {
      throw new Error("Unauthorized: Teacher ID mismatch");
    }

    // Fetch existing reports for this student to analyze trends
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
          reports: formattedReports, // Send the simplified text instead of complex JSON
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

        // Case 1: If it's already in the expected format, return as is
        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData) &&
          ("general_performance" in responseData ||
            "overall_trend_text" in responseData)
        ) {
          console.log("Case 1: Data already in expected format");
          return responseData;
        }

        // Case 2: If it's an object with an 'output' property (not in an array)
        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData) &&
          "output" in responseData
        ) {
          console.log("Case 2: Direct object with output property");
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

        // Case 3: If it's an array with an object that has an 'output' property (old format)
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0].output
        ) {
          console.log("Case 3: Array with output property");
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

    // Debug logged for the parsed data structure
    console.log("Parsed data type:", typeof parsedData);
    console.log("Parsed data is null or undefined:", parsedData == null);
    if (parsedData && typeof parsedData === "object") {
      console.log("Parsed data keys:", Object.keys(parsedData));
      if ("general_performance" in parsedData) {
        console.log(
          "general_performance value found:",
          parsedData.general_performance.substring(0, 100) + "..."
        );
      }
      if ("trend_icon" in parsedData) {
        console.log("trend_icon value:", parsedData.trend_icon);
      }
      if ("top_concepts" in parsedData) {
        console.log(
          "Found top_concepts with length:",
          Array.isArray(parsedData.top_concepts)
            ? parsedData.top_concepts.length
            : "not an array"
        );
      }
    }

    // Format the executive summary data
    const executiveSummaryData = {
      // Convert trend_icon to numeric value for the UI
      overall_trend_numeric:
        parsedData.trend_icon === "positive"
          ? 1
          : parsedData.trend_icon === "negative"
          ? -1
          : 0,

      // Use general_performance for overall_trend_text
      overall_trend_text:
        parsedData.general_performance ||
        webhookData.overall_trend_text ||
        "No trend data available",

      // Use latest_trends + standout_points for strengths_weaknesses
      strengths_weaknesses:
        (parsedData.latest_trends
          ? `Latest Trends: ${parsedData.latest_trends}\n\n`
          : "") +
          (parsedData.standout_points
            ? `Standout Points: ${parsedData.standout_points}`
            : "") ||
        webhookData.strengths_weaknesses ||
        "No strengths/weaknesses data available",

      // Add the new fields directly for future use
      trend_icon: parsedData.trend_icon || "neutral",
      general_performance: parsedData.general_performance || "",
      latest_trends: parsedData.latest_trends || "",
      standout_points: parsedData.standout_points || "",
      top_concepts: parsedData.top_concepts || [],
      worst_concepts: parsedData.worst_concepts || [],
    };

    // Update or insert the data in profiles_dashboard table
    console.log("Updating profiles_dashboard table");

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
          executive_summary: executiveSummaryData,
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
          executive_summary: executiveSummaryData,
        });
    }

    const { error: updateError } = updateResult;

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(
        `Failed to update profile dashboard: ${updateError.message}`
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
