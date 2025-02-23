import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { AuroraBackground } from "../components/UI/aurora-background";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export function Auth() {
  const { user, signIn, signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigate(isSignUp ? "/signup" : "/signin", { replace: true });
  }, [isSignUp, navigate]);

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
          toast.error("An account with this email already exists.");
          return;
        }

        toast.success(
          "Account created! Please check your email to confirm your account before signing in. Check your spam folder if you don't see it.",
          { duration: 8000 }
        );
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
          toast.error(
            "Please verify your email before signing in. Check your spam folder if you haven't received the verification email.",
            { duration: 6000 }
          );
          return;
        }

        toast.success("Welcome back!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
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
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-base text-gray-600">
                {isSignUp ? "" : "Sign in to continue"}
              </p>
            </div>

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-xl blur-xl transform group-hover:scale-105 transition-transform" />
                <div className="relative bg-white/80 backdrop-blur-sm border border-violet-100 rounded-xl p-3 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg text-white shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-base">
                          7-Day Free Trial Included
                        </span>
                        <span className="text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded-full text-xs inline-flex items-center">
                          <span className="mr-0.5">✨</span>
                          No credit card required
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-8 shadow-xl border border-white/20 w-full">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 text-base"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 text-base"
                    placeholder="Password"
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
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
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
                      ? "Already have an account?"
                      : "Don't have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white/50 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {isSignUp ? "Sign in instead" : "Create an account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
