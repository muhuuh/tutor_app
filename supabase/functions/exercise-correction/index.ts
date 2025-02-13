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

    const { examId, teacherId, message, mode, correctionId } = await req.json();

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
      throw new Error("Your subscription has expired");
    }

    // Check if user has enough credits
    const requiredCredits = CREDIT_COSTS.EXERCISE_CORRECTION;
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
          requiredCredits: CREDIT_COSTS.EXERCISE_CORRECTION,
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

    // Use service client for credit update
    const { data: updateData, error: updateError } = await supabaseServiceClient
      .from("user_subscriptions")
      .update({
        used_credits: subscription.used_credits + requiredCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    const response = await fetch(Deno.env.get("N8N_CHAT_FORGE_WEBHOOK_URL")!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        teacherId,
        message,
        mode,
        correctionId,
      }),
    });

    const data = await response.json();

    if (updateError) {
      console.error("Failed to update credit usage:", updateError);
    }

    // Success case
    return new Response(JSON.stringify({ ok: true, ...data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
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
        requiredCredits: CREDIT_COSTS.EXERCISE_CORRECTION,
      }),
      {
        status: isSubscriptionError ? 402 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
