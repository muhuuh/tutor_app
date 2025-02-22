import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.11.0";

console.log("Environment check:", {
  hasStripeKey: !!Deno.env.get("STRIPE_SECRET_KEY"),
  hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
  hasSupabaseServiceKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
});

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { priceId, user_id } = await req.json();

    // Add debug logging
    console.log("Environment:", {
      priceId,
      stripeKey: Deno.env.get("STRIPE_SECRET_KEY")?.substring(0, 8) + "...", // Log first 8 chars of key
      basicPriceId: Deno.env.get("STRIPE_BASIC_PRICE_ID"),
      professionalPriceId: Deno.env.get("STRIPE_PRO_PRICE_ID"),
    });

    if (!priceId || !user_id) {
      throw new Error("Missing required parameters: priceId and user_id");
    }

    // First, verify that the user has an existing row
    const { data: existingUser, error: lookupError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .single();

    if (lookupError) {
      throw new Error(`User not found: ${lookupError.message}`);
    }

    let customer;
    if (existingUser?.stripe_customer_id) {
      // Use existing Stripe customer
      customer = await stripe.customers.retrieve(
        existingUser.stripe_customer_id
      );
    } else {
      // Create new Stripe customer and update the existing row
      customer = await stripe.customers.create();

      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          stripe_customer_id: customer.id,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id);

      if (updateError) {
        throw new Error(
          `Error updating customer record: ${updateError.message}`
        );
      }
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get(
        "origin"
      )}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-checkout-session:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
