import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiChevronDown, FiLogOut, FiLogIn } from "react-icons/fi";

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-white border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-xl font-semibold text-gray-900">
              Teacher Assistant
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link
              to="/home"
              className={`text-sm ${
                location.pathname === "/home"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>

            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1 text-sm ${
                  location.pathname.startsWith("/tools")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tools
                <FiChevronDown
                  className={`transition-transform ${
                    isToolsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <Link
                    to="/tools/homework-corrections"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsToolsOpen(false)}
                  >
                    Homework Corrections
                  </Link>
                  <Link
                    to="/tools/exercise-forge"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsToolsOpen(false)}
                  >
                    Exercise Forge
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={companyRef}>
              <button
                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                className={`flex items-center gap-1 text-sm ${
                  location.pathname.startsWith("/company")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <Link
                    to="/company/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsCompanyOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/company/contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsCompanyOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/faq"
              className={`text-sm ${
                location.pathname === "/faq"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              FAQ
            </Link>

            <Link
              to="/pricing"
              className={`text-sm ${
                location.pathname === "/pricing"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pricing
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiLogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
