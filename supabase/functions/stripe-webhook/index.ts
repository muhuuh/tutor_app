import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

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
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        // This is the initial subscription creation
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Get subscription details to determine plan type
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const priceId = subscription.items.data[0].price.id;

        // Determine plan type and credits
        const planType =
          priceId === Deno.env.get("STRIPE_BASIC_PRICE_ID")
            ? "basic"
            : "professional";
        const maxCredits = planType === "basic" ? 500 : 2000;

        // Update subscription details
        const { error: updateError } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_type: planType,
            max_credits: maxCredits,
            used_credits: 0,
            valid_until: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          throw updateError;
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const customerId = invoice.customer as string;

        // Get the price ID from the subscription
        const priceId = subscription.items.data[0].price.id;

        // Determine the plan type and max credits
        const planType =
          priceId === Deno.env.get("STRIPE_BASIC_PRICE_ID")
            ? "basic"
            : "professional";
        const maxCredits = planType === "basic" ? 500 : 2000;

        // First, get the user_id from the existing subscription
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!existingSubscription) {
          throw new Error("No subscription found for customer");
        }

        // Update the existing subscription
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_type: planType,
            max_credits: maxCredits,
            valid_until: null, // Clear valid_until for paid subscriptions
            used_credits: 0, // Reset used credits
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", existingSubscription.user_id); // Update based on user_id

        if (error) throw error;
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get the price ID and determine plan type
        const priceId = subscription.items.data[0].price.id;
        const planType =
          priceId === Deno.env.get("STRIPE_BASIC_PRICE_ID")
            ? "basic"
            : "professional";
        const maxCredits = planType === "basic" ? 500 : 2000;

        // Update subscription details
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_type: planType,
            max_credits: maxCredits,
            valid_until: null,
            used_credits: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Update subscription status to indicate payment failure
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_type: "payment_failed",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get the user_id from the existing subscription
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!existingSubscription) {
          throw new Error("No subscription found for customer");
        }

        // Update the subscription to cancelled
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_type: "cancelled",
            max_credits: 0,
            used_credits: 0,
            valid_until: null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", existingSubscription.user_id);

        if (error) throw error;
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
