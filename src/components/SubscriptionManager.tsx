import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { CreditCard, Loader } from "lucide-react";

export function SubscriptionManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      const { url, error } = await response.json();

      if (error) throw new Error(error);

      // Redirect to Stripe Portal
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Subscription Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage your subscription, payment methods, and billing information
          </p>
        </div>
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          Manage Subscription
        </button>
      </div>
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
    </div>
  );
}
