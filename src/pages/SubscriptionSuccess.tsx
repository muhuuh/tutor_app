import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export function SubscriptionSuccess() {
  const { t } = useTranslation();
  //const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user exists
    if (!user) {
      setError(t("subscriptionSuccess.userError"));
      // Redirect to login if no user
      navigate("/auth");
      return;
    }

    // Automatically redirect to homework corrections after 5 seconds
    const timer = setTimeout(() => {
      navigate("/tools/homework-corrections");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, user, t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t("subscriptionSuccess.title")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("subscriptionSuccess.subtitle")}
        </p>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <p className="text-sm text-gray-500">
          {t("subscriptionSuccess.redirectNotice")}
        </p>
      </motion.div>
    </div>
  );
}
