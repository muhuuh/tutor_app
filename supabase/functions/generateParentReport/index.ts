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
      language = "en",
    } = await req.json();
    console.log(
      `Generating parent report for student: ${studentId}, language: ${language}`
    );

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

    // Also fetch the most recent reports for additional context
    console.log("Fetching recent reports");
    const { data: reports, error: reportsError } = await supabaseServiceClient
      .from("reports")
      .select("*")
      .eq("pupil_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5); // Get the 5 most recent reports

    // Format all profile data as text for easier n8n processing
    // Executive Summary
    let summaryText = "No executive summary available.";
    if (profileData?.executive_summary) {
      const summary = profileData.executive_summary;
      summaryText =
        `### Executive Summary\n\n` +
        `Overall Trend: ${summary.overall_trend_text || "Not available"}\n\n` +
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

            return `- ${concept}: Average score ${avgScore}`;
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
    if (profileData?.notes?.ai_summary) {
      notesText = `### Teacher Notes Summary\n\n${profileData.notes.ai_summary}`;
    }

    // Recent Reports
    let reportsText = "No recent assessment reports available.";
    if (reports && reports.length > 0) {
      reportsText = reports
        .map((report) => {
          // Extract the title
          const title = report.report_title || "Untitled Report";
          const date = new Date(report.created_at).toLocaleDateString();

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
          return `### ${title} (${date})\n\n${
            output1Content || "*No assessment content available*"
          }\n\n---\n\n`;
        })
        .join("");
    }

    // Combine all data into a structured format
    const formattedProfileData = `
# Student Profile: ${pupilData?.name || "Unknown Student"}

${summaryText}

${conceptScoresText}

${focusAreasText}

${notesText}

## Recent Assessments

${reportsText}
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
          "reportContent" in responseData
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
      if ("reportContent" in parsedData) {
        console.log(
          "reportContent found, length:",
          parsedData.reportContent.length
        );
      }
    }

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
        content: parsedData.reportContent || "No report content generated",
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
