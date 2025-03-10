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
import { useTranslation } from "react-i18next";
import { ComponentType } from "react";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Example credit costs data
const CREDIT_COSTS = [
  { feature: "Generate Report", cost: 10 },
  { feature: "Exercise Correction", cost: 5 },
  { feature: "Chat", cost: 2 },
  { feature: "Suggestions", cost: 1 },
];

// Add interface for pricing plans
interface PricingPlan {
  name: string;
  icon: ComponentType<{ className?: string }>;
  priceId?: string;
  credits: number | "custom";
  features: string[];
  popular?: boolean;
}

export function Pricing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(
    null
  );
  const [showDowngradeInfo, setShowDowngradeInfo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [showCreditBreakdown, setShowCreditBreakdown] = useState(false);

  const pricingPlans: PricingPlan[] = [
    {
      name: "basic",
      icon: Package,
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      credits: 500,
      features: t("pricing.planFeatures.basic", {
        returnObjects: true,
      }) as string[],
    },
    {
      name: "professional",
      popular: true,
      icon: Zap,
      priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
      credits: 2000,
      features: t("pricing.planFeatures.professional", {
        returnObjects: true,
      }) as string[],
    },
    {
      name: "institution",
      icon: Building2,
      credits: "custom",
      features: t("pricing.planFeatures.institution", {
        returnObjects: true,
      }) as string[],
    },
  ];

  // Google Analytics event tracking helper
  const trackEvent = (eventName: string, eventParams = {}) => {
    // Make sure gtag is available
    if (window.gtag) {
      window.gtag("event", eventName, eventParams);
    }
  };

  // Track page view when component mounts
  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Pricing Page",
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, []);

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
      // Track user not logged in when trying to subscribe
      trackEvent("subscription_error", {
        error_type: "not_logged_in",
      });

      navigate("/auth");
      return;
    }

    if (!priceId) {
      // Track error when price ID is missing
      trackEvent("subscription_error", {
        error_type: "missing_price_id",
      });

      setError(t("pricing.errors.invalidPlan"));
      return;
    }

    // Find the selected plan by priceId
    const selectedPlan = pricingPlans.find((plan) => plan.priceId === priceId);

    // Track subscription attempt
    trackEvent("begin_checkout", {
      plan_name: selectedPlan?.name || "unknown",
      price_id: priceId,
      currency: "USD",
    });

    setIsLoading(priceId);
    setError(null);

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
      if (checkoutError) {
        // Track checkout session creation error
        trackEvent("checkout_error", {
          error_type: "session_creation_failed",
          error_message: checkoutError,
        });
        throw new Error(checkoutError);
      }

      const stripe = await stripePromise;

      // Track successful checkout session creation
      trackEvent("checkout_step", {
        step: "redirecting_to_stripe",
        session_id: sessionId,
      });

      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        // Track redirect error
        trackEvent("checkout_error", {
          error_type: "redirect_failed",
          error_message: error.message,
        });
        throw error;
      }
    } catch (err) {
      // Track general checkout error
      trackEvent("checkout_error", {
        error_type: "general_error",
        error_message: err instanceof Error ? err.message : "Unknown error",
      });

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
    if (planName === "institution")
      return t("pricing.buttonTexts.contactSales");
    if (isSubscriptionDisabled(planName)) {
      return currentSubscription === planName.toLowerCase()
        ? t("pricing.buttonTexts.currentPlan")
        : t("pricing.buttonTexts.downgradeAvailableAfterCancellation");
    }
    return t("pricing.buttonTexts.getStarted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {t("pricing.errorToast")}
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
              {t("pricing.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {t("pricing.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </div>

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
                  {t("pricing.freeTrialBannerTitle")}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {t("pricing.freeTrialBannerText")}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSubscribe(pricingPlans[0].priceId)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
            >
              {t("pricing.freeTrialBannerButton")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards Section */}
      <section className="pt-2 sm:pt-2 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      {t("pricing.mostPopular")}
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
                      {t(`pricing.planLabels.${plan.name.toLowerCase()}.name`)}
                    </h2>
                    <p className="mt-4 text-sm text-gray-500">
                      {t(
                        `pricing.planLabels.${plan.name.toLowerCase()}.description`
                      )}
                    </p>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {t(`pricing.planLabels.${plan.name}.price`)}
                      </span>
                      {plan.name !== "institution" && (
                        <span className="text-base font-medium text-gray-500">
                          {t(`pricing.planLabels.${plan.name}.period`)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Credits */}
                  {plan.credits && (
                    <div className="flex items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900 mr-2">
                        {plan.credits === "custom"
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
                      // Track pricing plan button click
                      trackEvent("pricing_plan_click", {
                        plan_name: plan.name,
                        plan_type: plan.popular ? "popular" : "standard",
                        is_disabled: isSubscriptionDisabled(plan.name),
                      });

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
                      plan.name === "institution" ||
                      isLoading === plan.priceId ||
                      isSubscriptionDisabled(plan.name)
                    }
                  >
                    {isLoading === plan.priceId ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("pricing.btnProcessing")}</span>
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
              {t("pricing.manageSubscriptionModal.title")}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentSubscription === "basic" ? (
                <>
                  <div className="mb-4">
                    <strong className="text-gray-900">
                      {t("pricing.manageSubscriptionModal.upgradeTitle")}
                    </strong>
                    <p className="mt-2">
                      {t("pricing.manageSubscriptionModal.upgradeText")}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900">
                      {t("pricing.manageSubscriptionModal.cancelTitle")}
                    </strong>
                    <ol className="list-decimal ml-4 mt-2 space-y-2">
                      {(
                        t("pricing.manageSubscriptionModal.cancelSteps", {
                          returnObjects: true,
                        }) as string[]
                      ).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : currentSubscription === "professional" &&
                selectedPlan === "basic" ? (
                <>
                  <strong className="text-gray-900">
                    {t("pricing.manageSubscriptionModal.howToDowngradeTitle")}
                  </strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    {(
                      t("pricing.manageSubscriptionModal.howToDowngradeSteps", {
                        returnObjects: true,
                      }) as string[]
                    ).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </>
              ) : (
                <>
                  {t(
                    "pricing.manageSubscriptionModal.cancelSubscriptionIntro",
                    {
                      subscriptionType: currentSubscription,
                    }
                  )}
                  <ol className="list-decimal ml-4 mt-2 space-y-2">
                    {(
                      t("pricing.manageSubscriptionModal.cancelSteps", {
                        returnObjects: true,
                      }) as string[]
                    ).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </>
              )}
            </p>
            <button
              onClick={() => setShowDowngradeInfo(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("pricing.manageSubscriptionModal.closeButton")}
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
                    {t("pricing.creditBreakdownModal.heading")}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {t("pricing.creditBreakdownModal.description")}
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
                {t("pricing.creditBreakdownModal.closeButton")}
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
              {t("pricing.comparePlanFeatures.heading")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("pricing.comparePlanFeatures.subtitle")}
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
                        <span>
                          {t(
                            `pricing.planLabels.${plan.name.toLowerCase()}.name`
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    {t("pricing.comparePlanFeatures.tableHeaders.price")}
                  </td>
                  {pricingPlans.map((plan) => (
                    <td key={plan.name} className="p-4 text-gray-700">
                      <span className="font-semibold">
                        {t(`pricing.planLabels.${plan.name}.price`)}
                      </span>
                      {plan.name !== "institution" && (
                        <span className="text-gray-500">
                          {t(`pricing.planLabels.${plan.name}.period`)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* AI Credits Row */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    {t("pricing.comparePlanFeatures.tableHeaders.aiCredits")}
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
                    {t(
                      "pricing.comparePlanFeatures.tableHeaders.studentProfiles"
                    )}
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
                    {t("pricing.comparePlanFeatures.tableHeaders.earlyAccess")}
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
