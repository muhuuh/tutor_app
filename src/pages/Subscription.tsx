import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { CreditCard, Calendar, Package, Loader2 } from "lucide-react";

//link to customer portall: https://dashboard.stripe.com/test/settings/billing/portal

interface SubscriptionDetails {
  subscription_type: string;
  max_credits: number;
  used_credits: number;
  valid_until: string | null;
}

export function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user?.id)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subscription"
        );
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handlePortalOpen = async () => {
    setIsPortalLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ user_id: user?.id }),
        }
      );

      const { url, error: portalError } = await response.json();
      if (portalError) throw new Error(portalError);
      if (!url) throw new Error("No portal URL returned");

      // Use window.location.href to redirect to the Stripe portal
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open portal");
      console.error("Portal session error:", err);
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Subscription Management
          </h1>

          {error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : subscription ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Package className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Current Plan
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mt-1 capitalize">
                        {subscription.subscription_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Valid Until</h3>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {subscription.valid_until
                          ? new Date(
                              subscription.valid_until
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Credits Usage
                </h3>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {subscription.used_credits} / {subscription.max_credits}{" "}
                        Credits Used
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round(
                          (subscription.used_credits /
                            subscription.max_credits) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div
                      style={{
                        width: `${
                          (subscription.used_credits /
                            subscription.max_credits) *
                          100
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button
                  onClick={handlePortalOpen}
                  disabled={isPortalLoading}
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isPortalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Manage Billing</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Your subscription renews automatically each month. You can
                cancel or modify your subscription at any time through the
                billing portal.
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active subscription found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
