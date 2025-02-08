import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  FiChevronDown,
  FiLogOut,
  FiLogIn,
  FiTool,
  FiBox,
  FiInfo,
  FiMail,
} from "react-icons/fi";

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollDirection();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target as Node)
      ) {
        setIsToolsOpen(false);
      }
      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node)
      ) {
        setIsCompanyOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Helper function to check active tab
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed w-full bg-white backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            EduAI
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8 text-gray-600">
            <div className="hidden lg:flex items-center gap-8">
              <Link
                to="/home"
                className={`relative text-sm font-medium hover:text-gray-900 transition-colors ${
                  isActive("/home") ? "text-gray-900" : ""
                }`}
              >
                {isActive("/home") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                )}
                Home
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                    isActive("/tools")
                      ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-shadow"
                      : "text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-shadow"
                  }`}
                >
                  <FiTool className="text-white" />
                  Tools
                  <FiChevronDown
                    className={`transition-transform text-white ${
                      isToolsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isToolsOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <Link
                      to="/tools/homework-corrections"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsToolsOpen(false)}
                    >
                      <FiBox className="text-blue-500" />
                      Homework Corrections
                    </Link>
                    <Link
                      to="/tools/exercise-forge"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsToolsOpen(false)}
                    >
                      <FiBox className="text-purple-500" />
                      Exercise Generator
                    </Link>
                  </div>
                )}
              </div>

              {/* Company Dropdown */}
              <div className="relative" ref={companyRef}>
                <button
                  onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isActive("/company")
                      ? "text-gray-900 bg-blue-50 px-4 py-2 rounded-lg"
                      : "hover:text-gray-900 transition-colors"
                  }`}
                >
                  Company
                  <FiChevronDown
                    className={`transition-transform ${
                      isCompanyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCompanyOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <Link
                      to="/company/about"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsCompanyOpen(false)}
                    >
                      <FiInfo className="text-blue-500" />
                      About Us
                    </Link>
                    <Link
                      to="/company/contact"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsCompanyOpen(false)}
                    >
                      <FiMail className="text-purple-500" />
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/pricing"
                className={`relative text-sm font-medium hover:text-gray-900 transition-colors ${
                  isActive("/pricing") ? "text-gray-900" : ""
                }`}
              >
                {isActive("/pricing") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                )}
                Pricing
              </Link>

              {/* FAQ Link */}
              <Link
                to="/faq"
                className={`relative text-sm font-medium hover:text-gray-900 transition-colors ${
                  isActive("/faq") ? "text-gray-900" : ""
                }`}
              >
                {isActive("/faq") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                )}
                FAQ
              </Link>
            </div>

            {/* Auth Section - Pushed to right */}
            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
