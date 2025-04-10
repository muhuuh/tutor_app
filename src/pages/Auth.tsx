import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { AuroraBackground } from "../components/UI/aurora-background";
import { supabase } from "../lib/supabase";
//import { motion } from "framer-motion";
//import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
//import { Dialog, Transition } from "@headlessui/react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    // Reset fullscreen state when closing modal
    if (!newState) setIsFullscreen(false);
  };

  // Log modal state changes
  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
  }, [isModalOpen]);

  // Function to toggle fullscreen mode
  const toggleFullscreen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard event handler for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          setIsModalOpen(false);
        }
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isFullscreen]);

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

              {isSignUp ? (
                <div className="text-sm text-gray-600 flex flex-col items-center space-y-1">
                  <div className="flex items-center">
                    <span className="mr-1.5 text-indigo-500">🚀</span>
                    <span className="font-medium">
                      Start your 7-day free trial instantly.
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-indigo-500 mr-1">✨ </span>
                    <span>No credit card, no strings attached.</span>
                  </div>
                  <div className="flex items-center text-xs font-medium text-indigo-600">
                    <span>Just sign up & start!</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {" "}
                  <span className="mr-0.5">✨ </span>
                  {t("auth.signInToContinue")}
                </p>
              )}
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

          <div className="backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/70 rounded-2xl p-8 shadow-xl border border-white/30 w-full relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-40 h-40 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative group">
                  <label htmlFor="email" className="sr-only">
                    {t("auth.form.emailLabel")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400/60 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-base shadow-sm transition-all duration-200 group-hover:border-gray-300 placeholder:text-sm placeholder:font-light"
                    placeholder={t("auth.form.emailPlaceholder")}
                  />
                  <div className="absolute inset-0 rounded-xl border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"></div>
                </div>
                <div className="relative group">
                  <label htmlFor="password" className="sr-only">
                    {t("auth.form.passwordLabel")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400/60 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-base shadow-sm transition-all duration-200 group-hover:border-gray-300 placeholder:text-sm placeholder:font-light"
                    placeholder={t("auth.form.passwordPlaceholder")}
                  />
                  <div className="absolute inset-0 rounded-xl border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-6 w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] shadow-indigo-500/25 overflow-hidden"
              >
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      <span>{t("auth.form.processing")}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1">
                      {isSignUp ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
                          </svg>
                          {t("auth.form.btnCreateAccount")}
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {t("auth.form.btnSignIn")}
                        </>
                      )}
                    </span>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            <div className="mt-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/70" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 py-1 text-gray-500 bg-white/80 text-sm font-medium rounded-full shadow-sm backdrop-blur-sm">
                    {isSignUp
                      ? t("auth.toggle.alreadyHaveAccount")
                      : t("auth.toggle.dontHaveAccount")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-5 w-full inline-flex justify-center items-center py-3 px-4 border border-indigo-100 rounded-xl shadow-sm text-base font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 transition-all duration-200 backdrop-blur-sm gap-1.5"
              >
                {isSignUp ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("auth.toggle.signInInstead")}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
                    </svg>
                    {t("auth.toggle.createAccount")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal - Enhanced and Compact Design */}
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
            onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              } else {
                setIsModalOpen(false);
              }
            }}
          ></div>

          {/* Fullscreen Image View */}
          {isFullscreen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 pt-16 sm:pt-20">
              <div
                className="relative max-w-[95vw] max-h-[90vh] mt-6"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-white hover:text-gray-200 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all duration-200 focus:outline-none z-10 shadow-lg"
                  onClick={toggleFullscreen}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <img
                  src={`/tool_screenshot/${screenshotData[currentSlide].imageName}.png`}
                  alt={`Tool Screenshot ${currentSlide + 1}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder-image.png";
                  }}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 py-1 px-3 bg-black/30 backdrop-blur-sm rounded-full">
                  {screenshotData.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(index);
                      }}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        currentSlide === index
                          ? "bg-white scale-110"
                          : "bg-gray-400 hover:bg-gray-300"
                      }`}
                      aria-label={`View screenshot ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal panel with compact design */}
          {!isFullscreen && (
            <div className="flex min-h-full items-center justify-center p-2">
              <div
                className="w-full max-w-xl overflow-hidden rounded-2xl bg-gradient-to-b from-white to-gray-50 p-3 shadow-2xl relative border border-gray-100 transition-all duration-300 ease-in-out transform max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none z-10"
                  onClick={() => setIsModalOpen(false)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>

                {/* Modal title with modern styling */}
                <div className="mb-4 text-center relative">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {t("auth.featurePreview")}
                  </h3>
                  <div className="absolute left-1/2 -bottom-2 w-16 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 transform -translate-x-1/2 rounded-full"></div>
                </div>

                {/* Larger Carousel */}
                <div className="overflow-hidden rounded-xl bg-gray-50 shadow-inner border border-gray-200 mb-3 flex-shrink-0">
                  <div
                    className="relative aspect-[16/9] overflow-hidden rounded-t-xl cursor-pointer"
                    onClick={toggleFullscreen}
                  >
                    {/* Loading indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600"></div>
                    </div>

                    {/* Main image - clickable */}
                    <img
                      src={`/tool_screenshot/${screenshotData[currentSlide].imageName}.png`}
                      alt={`Tool Screenshot ${currentSlide + 1}`}
                      className="w-full h-full object-contain z-10 relative hover:scale-[1.02] transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder-image.png";
                      }}
                    />

                    {/* Click to expand indicator */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full opacity-80 z-20 backdrop-blur-sm shadow-sm flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M13.28 7.78l3.22-3.22v2.69a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.69l-3.22 3.22a.75.75 0 001.06 1.06zM2 17.25a.75.75 0 00.75.75h4.5a.75.75 0 000-1.5H4.56l3.22-3.22a.75.75 0 10-1.06-1.06L3.5 15.44v-2.69a.75.75 0 00-1.5 0v4.5z" />
                      </svg>
                      Click to expand
                    </div>

                    {/* Navigation arrows */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevSlide();
                      }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none z-20"
                    >
                      <ChevronLeftIcon className="h-4 w-4 text-indigo-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextSlide();
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none z-20"
                    >
                      <ChevronRightIcon className="h-4 w-4 text-indigo-600" />
                    </button>
                  </div>

                  {/* Slide indicators - centered and stylish */}
                  <div className="flex justify-center gap-1.5 py-2 bg-white border-t border-gray-100">
                    {screenshotData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                          currentSlide === index
                            ? "bg-indigo-600 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`View screenshot ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Feature description - Modern design */}
                <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl p-3 border border-indigo-100/50 shadow-sm flex-grow overflow-y-auto max-h-[30vh]">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-1.5 mt-0.5 flex-shrink-0 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-indigo-600"
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
                    {(() => {
                      const translation = t(
                        screenshotData[currentSlide].translationKey,
                        { returnObjects: true }
                      ) as { title: string; description: string };
                      return (
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-1 flex items-center">
                            {translation.title}{" "}
                            <span className="ml-2 text-xs font-normal text-gray-500">
                              ({currentSlide + 1}/{screenshotData.length})
                            </span>
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {translation.description}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AuroraBackground>
  );
}
