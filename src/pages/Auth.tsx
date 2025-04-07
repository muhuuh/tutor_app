import React, { useState, useEffect, Fragment } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { AuroraBackground } from "../components/UI/aurora-background";
import { supabase } from "../lib/supabase";
//import { motion } from "framer-motion";
//import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Define screenshot data
const screenshotData = [
  {
    imageName: "homework_correction_chat",
    translationKey: "auth.screenshots.homeworkCorrectionChat",
  },
  {
    imageName: "homework_correction_report_overview",
    translationKey: "auth.screenshots.homeworkCorrectionReportOverview",
  },
  {
    imageName: "homework_correction_report_overview_summary",
    translationKey: "auth.screenshots.homeworkCorrectionReportOverviewSummary",
  },
  {
    imageName: "homework_correction_profile",
    translationKey: "auth.screenshots.homeworkCorrectionProfile",
  },
  {
    imageName: "exercice_forge_example",
    translationKey: "auth.screenshots.exerciceForgeExample",
  },
  {
    imageName: "exercice_forge_new_exam",
    translationKey: "auth.screenshots.exerciceForgeNewExam",
  },
];

export function Auth() {
  const { user, signIn, signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    navigate(isSignUp ? "/signup" : "/signin", { replace: true });
  }, [isSignUp, navigate]);

  // Function to toggle modal directly
  const toggleModal = () => {
    console.log("Toggling modal");
    const newState = !isModalOpen;
    console.log("Setting modal state to:", newState);
    setIsModalOpen(newState);
  };

  // Log modal state changes
  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
  }, [isModalOpen]);

  if (user) {
    const redirectTo = location.state?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        console.log("Starting signup process for:", email);
        const response = await signUp(email, password);

        console.log("Signup response:", response);
        if (response.user?.identities?.length === 0) {
          toast.error(t("auth.toast.signupEmailExists"));
          return;
        }

        toast.success(t("auth.toast.signupSuccess"), { duration: 8000 });
        setIsSignUp(false);
      } else {
        console.log("Starting signin process for:", email);
        const response = await signIn(email, password);
        const currentUser = response.user;

        console.log("Current user:", currentUser);
        console.log(
          "Email confirmation status:",
          currentUser?.email_confirmed_at
        );

        if (!currentUser?.email_confirmed_at) {
          console.log("Email not verified, signing out user");
          await supabase.auth.signOut();
          toast.error(t("auth.toast.signinEmailNotVerified"), {
            duration: 6000,
          });
          return;
        }

        toast.success(t("auth.toast.signinSuccess"));
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        error instanceof Error ? error.message : t("auth.toast.authError")
      );
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === screenshotData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? screenshotData.length - 1 : prev - 1
    );
  };

  return (
    <AuroraBackground className="min-h-screen pb-10">
      <div className="min-h-screen flex items-center justify-center pb-0 pt-32 sm:pt-28 px-4 sm:px-6 lg:px-8">
        <div className="w-full sm:min-w-[440px] max-w-[480px] space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse transform -rotate-6"></div>
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl"></div>
                  <img
                    src="/mask-icon.png"
                    alt="AI Tutor Assistant"
                    className="relative w-full h-full object-contain p-3 opacity-70 [filter:drop-shadow(0_0_20px_rgba(59,130,246,0.5))_brightness(0.9)_hue-rotate(10deg)]"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {isSignUp
                  ? t("auth.headingCreateAccount")
                  : t("auth.headingWelcomeBack")}
              </h2>

              <p className="text-sm text-gray-600">
                {" "}
                <span className="mr-0.5">✨ </span>
                {isSignUp
                  ? t("auth.headingCreateAccountSubtitle")
                  : t("auth.signInToContinue")}
              </p>
            </div>

            {/* Demo Tool Link */}
            <button
              onClick={toggleModal}
              className="mt-4 text-sm px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 transition-all duration-200 rounded-full shadow-sm border border-indigo-100 flex items-center gap-1 font-medium mx-auto cursor-pointer relative z-10"
              type="button"
              aria-haspopup="dialog"
            >
              <span className="mr-0.5">🔍</span> {t("auth.curious")}
            </button>
          </div>

          <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-8 shadow-xl border border-white/20 w-full">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    {t("auth.form.emailLabel")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 text-base"
                    placeholder={t("auth.form.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    {t("auth.form.passwordLabel")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 text-base"
                    placeholder={t("auth.form.passwordPlaceholder")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    <span>{t("auth.form.processing")}</span>
                  </div>
                ) : (
                  <span>
                    {isSignUp
                      ? t("auth.form.btnCreateAccount")
                      : t("auth.form.btnSignIn")}
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 py-1 text-gray-500 bg-white/70 text-base">
                    {isSignUp
                      ? t("auth.toggle.alreadyHaveAccount")
                      : t("auth.toggle.dontHaveAccount")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white/50 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {isSignUp
                  ? t("auth.toggle.signInInstead")
                  : t("auth.toggle.createAccount")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal - Enhanced Design */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Animated background overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ease-in-out"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal panel with enhanced design */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-white to-gray-50 p-6 sm:p-8 shadow-2xl relative border border-gray-100 transition-all duration-300 ease-in-out transform"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced close button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none z-10"
                onClick={() => setIsModalOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              {/* Modal title with enhanced styling */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {t("auth.featurePreview")}
                </h3>
                <p className="text-sm text-gray-500">
                  Explore our platform's powerful features
                </p>
              </div>

              {/* Enhanced Carousel */}
              <div className="overflow-hidden rounded-2xl bg-gray-50 shadow-inner border border-gray-200 mb-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                  {/* Loading state indicator */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>

                  {/* Main image with error fallback */}
                  <img
                    src={`/tool_screenshot/${screenshotData[currentSlide].imageName}.png`}
                    alt={`Tool Screenshot ${currentSlide + 1}`}
                    className="w-full h-full object-contain z-10 relative"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = "/placeholder-image.png"; // Fallback image
                    }}
                  />

                  {/* Enhanced Navigation arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none z-20"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-indigo-600" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none z-20"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-indigo-600" />
                  </button>
                </div>

                {/* Enhanced Slide indicators */}
                <div className="flex justify-center gap-2 py-4 px-6 bg-white border-t border-gray-100">
                  {screenshotData.map((item, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(index);
                      }}
                      className={`h-3 w-3 rounded-full transition-all duration-200 ${
                        currentSlide === index
                          ? "bg-indigo-600 scale-110 shadow-sm"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`View screenshot ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced Feature description */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-indigo-900 mb-1">
                      Feature Highlight {currentSlide + 1}/
                      {screenshotData.length}
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {t(screenshotData[currentSlide].translationKey)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pagination display */}
              <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                <span>
                  Showing {currentSlide + 1} of {screenshotData.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextSlide}
                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuroraBackground>
  );
}
