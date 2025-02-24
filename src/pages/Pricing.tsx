import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Zap,
  Building2,
  Check,
  Gift,
  Loader2,
  Info,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Example credit costs data
const CREDIT_COSTS = [
  { feature: "Generate Report", cost: 10 },
  { feature: "Exercise Correction", cost: 5 },
  { feature: "Chat", cost: 2 },
  { feature: "Suggestions", cost: 1 },
];

// Add price IDs and AI credits to the pricing plans
const pricingPlans = [
  {
    name: "Basic",
    price: "€9.99",
    period: "/month",
    credits: 500, // ADD: AI credits for Basic
    description: "Perfect for individual tutors getting started with AI",
    icon: Package,
    priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
    features: [
      "Advanced handwriting analysis",
      "Partial credit recognition",
      "Detailed performance analytics",
      "Tailored resources search",
      "Custom exercise generation",
      "Up to 5 student profiles",
    ],
  },
  {
    name: "Professional",
    price: "€19.99",
    period: "/month",
    credits: 2000, // ADD: AI credits for Pro
    popular: true,
    icon: Zap,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    description: "Ideal for active tutors and small teaching practices",
    features: [
      "Advanced handwriting analysis",
      "Partial credit recognition",
      "Detailed performance analytics",
      "Tailored resources search",
      "Custom exercise generation",
      "Unlimited student profiles",
      "Early access to new features",
    ],
  },
  {
    name: "Institution",
    price: "Custom",
    credits: "Custom",
    icon: Building2,
    description: "For schools and large educational organizations",
    features: [
      "All Professional features",
      "Custom integrations",
      "Dedicated support team",
      "Training sessions",
    ],
  },
];

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(
    null
  );
  const [showDowngradeInfo, setShowDowngradeInfo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // NEW: State to show/hide AI credit usage modal
  const [showCreditBreakdown, setShowCreditBreakdown] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("subscription_type")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setCurrentSubscription(data?.subscription_type?.toLowerCase() || null);
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    }

    fetchSubscription();
  }, [user]);

  const handleSubscribe = async (priceId: string | undefined) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (!priceId) return;

    setIsLoading(priceId);
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

      const { sessionId, error: checkoutError } = await response.json();
      if (checkoutError) throw new Error(checkoutError);

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const isSubscriptionDisabled = (planName: string) => {
    if (!currentSubscription) return false;
    // Prevent subscribing to Basic when on Professional
    if (
      planName.toLowerCase() === "basic" &&
      currentSubscription === "professional"
    ) {
      return true;
    }
    // Prevent subscribing to the current plan
    return planName.toLowerCase() === currentSubscription;
  };

  const getButtonText = (planName: string) => {
    if (planName === "Institution") return "Contact Sales";
    if (isSubscriptionDisabled(planName)) {
      return currentSubscription === planName.toLowerCase()
        ? "Current Plan"
        : "Downgrade Available After Cancellation";
    }
    return "Get Started";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      {/* Hero Section - Added pt-20 for header offset */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pb-10 sm:pt-32 sm:pb-16 pt-28">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0"
            >
              Choose the plan that's right for you
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <section className="pt-2 sm:pt-2 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Free Trial Banner - Only show for non-authenticated users */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 sm:mb-16 group relative bg-white rounded-2xl p-4 sm:p-8 shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:20px_20px]" />

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10 gap-4 sm:gap-8">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl text-white shrink-0">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Try it Free for 7 Days
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      Sign up now and get full access to all Basic plan
                      features. No credit card required!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribe(pricingPlans[0].priceId)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
                >
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          )}

          {/* Pricing Cards */}
          <div className="mt-12 sm:mt-24 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
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

                <div className="relative z-10 flex flex-col h-full">
                  {/* Plan Header */}
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
                      {/* Price */}
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

                  {/* AI Credits */}
                  {plan.credits && (
                    <div className="flex items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900 mr-2">
                        {plan.credits === "Custom"
                          ? "Custom AI Credits"
                          : `${plan.credits} AI Credits / mo`}
                      </span>
                      {/* Updated Info Icon + Tooltip/Modal Trigger */}
                      <button
                        onClick={() => setShowCreditBreakdown(true)}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 stroke-2 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (
                        isSubscriptionDisabled(plan.name) &&
                        plan.name.toLowerCase() === "basic"
                      ) {
                        setSelectedPlan(plan.name.toLowerCase());
                        setShowDowngradeInfo(true);
                        return;
                      }
                      handleSubscribe(plan.priceId);
                    }}
                    className={`relative w-full mt-8 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                    disabled={
                      plan.name === "Institution" ||
                      isLoading === plan.priceId ||
                      isSubscriptionDisabled(plan.name)
                    }
                  >
                    {isLoading === plan.priceId ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      getButtonText(plan.name)
                    )}
                  </button>

                  {/* Info icon for current plan or forced downgrade */}
                  {(isSubscriptionDisabled(plan.name) &&
                    plan.name.toLowerCase() === "basic") ||
                  (isSubscriptionDisabled(plan.name) &&
                    plan.name.toLowerCase() === currentSubscription) ? (
                    <div className="mt-2 flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSelectedPlan(plan.name.toLowerCase());
                          setShowDowngradeInfo(true);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Downgrade Info Modal */}
      {showDowngradeInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDowngradeInfo(false);
            }
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentSubscription === "basic"
                ? "Manage Your Subscription"
                : currentSubscription === "professional" &&
                  selectedPlan === "basic"
                ? "How to Downgrade Your Plan"
                : "Manage Your Subscription"}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentSubscription === "basic" ? (
                <>
                  <div className="mb-4">
                    <strong className="text-gray-900">Want to upgrade?</strong>
                    <p className="mt-2">
                      You can upgrade to the Professional plan directly! This
                      will automatically replace your Basic subscription.
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Want to cancel?</strong>
                    <ol className="list-decimal ml-4 mt-2 space-y-2">
                      <li>Go to your Subscription page</li>
                      <li>Click on "Manage Billing"</li>
                      <li>Cancel your Basic subscription</li>
                      <li>
                        Your Basic features remain active until the end of your
                        billing period
                      </li>
                    </ol>
                  </div>
                </>
              ) : currentSubscription === "professional" &&
                selectedPlan === "basic" ? (
                <>
                  To downgrade to the Basic plan:
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    <li>Go to your Subscription page</li>
                    <li>Click on "Manage Billing"</li>
                    <li>Cancel your current Professional subscription</li>
                    <li>
                      You keep Pro features until the end of your billing period
                    </li>
                    <li>After it expires, you can subscribe to Basic</li>
                  </ol>
                </>
              ) : (
                <>
                  To cancel your {currentSubscription} subscription:
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    <li>Go to your Subscription page</li>
                    <li>Click on "Manage Billing"</li>
                    <li>Cancel your subscription</li>
                    <li>
                      You keep {currentSubscription} features until end of your
                      billing period
                    </li>
                  </ol>
                </>
              )}
            </p>
            <button
              onClick={() => setShowDowngradeInfo(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI Credits Breakdown Modal */}
      {showCreditBreakdown && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreditBreakdown(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-4 max-w-sm w-full shadow-xl relative overflow-hidden"
          >
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:20px_20px]" />

            <div className="relative z-10">
              <div className="flex flex-col mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg text-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Credit Breakdown
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  See how many credits each feature uses per interaction
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {CREDIT_COSTS.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.feature}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {item.feature}
                    </span>
                    <span className="text-sm font-medium text-gray-900 bg-white px-2 py-0.5 rounded-md shadow-sm">
                      {item.cost}
                    </span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setShowCreditBreakdown(false)}
                className="w-full px-3 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow hover:shadow-md font-medium"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comparison Table Section */}
      <section className="pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Plan Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get a detailed overview of what's included in each plan to make
              the best choice for your needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200"
          >
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-4 text-sm font-medium text-gray-600 border-b"></th>
                  {pricingPlans.map((plan) => (
                    <th
                      key={plan.name}
                      className={`p-4 text-sm font-medium border-b ${
                        plan.popular ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <plan.icon className="w-4 h-4" />
                        <span>{plan.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Price
                  </td>
                  {pricingPlans.map((plan) => (
                    <td key={plan.name} className="p-4 text-gray-700">
                      <span className="font-semibold">{plan.price}</span>
                      <span className="text-gray-500">{plan.period || ""}</span>
                    </td>
                  ))}
                </tr>
                {/* AI Credits Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    AI Credits
                  </td>
                  {pricingPlans.map((plan) => (
                    <td key={plan.name} className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-lg text-sm ${
                          typeof plan.credits === "number"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {typeof plan.credits === "number"
                          ? `${plan.credits.toLocaleString()} / mo`
                          : plan.credits}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* Student Profiles Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Student Profiles
                  </td>
                  <td className="p-4 text-gray-700">Up to 5</td>
                  <td className="p-4 text-gray-700">
                    <span className="inline-flex items-center text-emerald-700">
                      <Check className="w-4 h-4 mr-1" />
                      Unlimited
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="inline-flex items-center text-emerald-700">
                      <Check className="w-4 h-4 mr-1" />
                      Unlimited
                    </span>
                  </td>
                </tr>
                {/* Early Access Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Early Access
                  </td>
                  <td className="p-4 text-gray-500">—</td>
                  <td className="p-4">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </td>
                  <td className="p-4">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
