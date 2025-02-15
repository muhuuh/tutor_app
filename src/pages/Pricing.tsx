import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Zap, Building2, Check, Gift } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Add price IDs to the pricing plans
const pricingPlans = [
  {
    name: "Basic",
    price: "€9.99",
    period: "/month",
    description:
      "Perfect for individual tutors getting started with AI grading",
    icon: Package,
    priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
    features: [
      "Basic handwriting recognition",
      "Simple exercise generation",
      "Limited student analytics",
      "Email support",
      "Up to 50 corrections/month",
    ],
  },
  {
    name: "Professional",
    price: "€19.99",
    period: "/month",
    popular: true,
    icon: Zap,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    description: "Ideal for active tutors and small teaching practices",
    features: [
      "Advanced handwriting analysis",
      "Partial credit recognition",
      "Detailed performance analytics",
      "Custom exercise generation",
      "Priority support",
      "Unlimited corrections",
    ],
  },
  {
    name: "Institution",
    price: "Custom",
    icon: Building2,
    description: "For schools and large educational organizations",
    features: [
      "All Professional features",
      "API access",
      "Custom integrations",
      "Dedicated support team",
      "Advanced reporting",
      "Training sessions",
    ],
  },
];

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | undefined) => {
    setError(null);

    if (!priceId) {
      setError("No price ID provided");
      return;
    }

    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            priceId,
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("No session ID returned");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (redirectError) {
        throw redirectError;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error handling subscription:", err);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-24">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto"
            >
              Choose the plan that's right for you
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <section className="pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Free Trial Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Grid background overlay */}
            <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:20px_20px]" />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl text-white">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Try it Free for 7 Days
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Sign up now and get full access to all Basic plan features,
                    no credit card required
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSubscribe(pricingPlans[0].priceId)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
          <div className="mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative p-8 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular ? "ring-2 ring-blue-600" : ""
                }`}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="mt-4 text-sm text-gray-500">
                      {plan.description}
                    </p>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-base font-medium text-gray-500">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 stroke-2 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.priceId)}
                    className={`relative z-10 mt-8 block w-full px-6 py-4 text-center font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                    disabled={plan.name === "Institution"}
                  >
                    {plan.name === "Institution"
                      ? "Contact Sales"
                      : "Get started"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
