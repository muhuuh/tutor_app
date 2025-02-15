import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

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

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body); // Add logging

    const { priceId, user_id } = body;

    if (!priceId || !user_id) {
      console.log("Missing parameters:", { priceId, user_id }); // Add logging
      throw new Error("Missing required parameters: priceId and user_id");
    }

    // Log Supabase connection details (without sensitive info)
    console.log("Supabase URL exists:", !!supabaseUrl);
    console.log("Supabase Service Key exists:", !!supabaseServiceKey);

    // Create or get customer
    let customer;
    const { data: existingCustomer, error: customerError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .single();

    console.log("Customer lookup result:", {
      existingCustomer,
      error: customerError?.message,
    }); // Add logging

    if (customerError && customerError.code !== "PGRST116") {
      throw new Error(`Error fetching customer: ${customerError.message}`);
    }

    if (existingCustomer?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(
        existingCustomer.stripe_customer_id
      );
    } else {
      customer = await stripe.customers.create();
      // Store the customer ID
      await supabase.from("user_subscriptions").upsert({
        user_id,
        stripe_customer_id: customer.id,
        subscription_type: "free",
      });
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
      )}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Detailed error in create-checkout-session:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error, // Log the full error object
    });

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
