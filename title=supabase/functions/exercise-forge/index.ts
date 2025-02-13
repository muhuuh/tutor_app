// Check if user has enough credits
const requiredCredits = CREDIT_COSTS.EXERCISE_FORGE;
console.log("Current subscription:", {
  id: subscription.id,
  used_credits: subscription.used_credits,
  max_credits: subscription.max_credits,
});

if (subscription.used_credits + requiredCredits > subscription.max_credits) {
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
    }),
    {
      status: 200, // Return 200 even on error
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

// ... rest of your code returns { ok: true, ... } on success
