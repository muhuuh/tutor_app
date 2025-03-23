import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  FiChevronDown,
  FiLogOut,
  FiTool,
  FiBox,
  FiInfo,
  FiMail,
  FiUser,
  FiCreditCard,
  FiGlobe,
  FiMenu,
  FiX,
  FiHome,
  FiHelpCircle,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import gbFlag from "../assets/flags/gb.svg";
import deFlag from "../assets/flags/de.svg";
import frFlag from "../assets/flags/fr.svg";

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollDirection();
  const { i18n } = useTranslation();

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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
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
      className={`fixed w-full bg-white border-b border-gray-100 z-[60] shadow-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <img
              src="/mask-icon.png"
              alt="RobinA Logo"
              className="w-12 h-12 object-contain filter brightness-105"
            />
            <div className="relative">
              <div className="relative text-2xl font-bold ">
                <span className="bg-gradient-to-r from-blue-600 to-blue-500  bg-clip-text text-transparent font-bungee">
                  Robin
                </span>
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-bungee">
                  A
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-3">
            {/* Home */}
            <Link
              to="/home"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/home") ? "text-gray-900" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive("/home")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : ""
                }`}
              >
                <FiHome
                  className={`w-3.5 h-3.5 ${
                    isActive("/home") ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <span>Home</span>
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/tools") ? "text-gray-900" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive("/tools")
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                    }`}
                  >
                    <FiTool
                      className={`w-3.5 h-3.5 ${
                        isActive("/tools") ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span>Tools</span>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isToolsOpen ? "rotate-180" : ""
                    } ${
                      isActive("/tools") ? "text-gray-900" : "text-gray-400"
                    }`}
                  />
                </div>
              </button>

              {isToolsOpen && (
                <div className="lg:absolute right-0 mt-2 w-56 bg-white backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <Link
                    to="/tools/homework-corrections"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsToolsOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FiBox className="text-blue-500" />
                    Homework Corrections
                  </Link>
                  <Link
                    to="/tools/exercise-forge"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsToolsOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
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
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/company") ? "text-gray-900" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive("/company")
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : ""
                    }`}
                  >
                    <FiInfo
                      className={`w-3.5 h-3.5 ${
                        isActive("/company") ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span>Company</span>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCompanyOpen ? "rotate-180" : ""
                    } ${
                      isActive("/company") ? "text-gray-900" : "text-gray-400"
                    }`}
                  />
                </div>
              </button>

              {isCompanyOpen && (
                <div
                  className={`${"lg:absolute right-0 mt-4"} w-full lg:w-56 bg-white backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 overflow-hidden`}
                >
                  <Link
                    to="/company/about"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsCompanyOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FiInfo className="text-blue-500" />
                    About Us
                  </Link>
                  <Link
                    to="/company/contact"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsCompanyOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FiMail className="text-purple-500" />
                    Contact
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              to="/pricing"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/pricing") ? "text-gray-900" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive("/pricing")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : ""
                }`}
              >
                <FiCreditCard
                  className={`w-3.5 h-3.5 ${
                    isActive("/pricing") ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <span>Pricing</span>
            </Link>

            {/* FAQ */}
            <Link
              to="/faq"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/faq") ? "text-gray-900" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive("/faq")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : ""
                }`}
              >
                <FiHelpCircle
                  className={`w-3.5 h-3.5 ${
                    isActive("/faq") ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <span>FAQ</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative ml-4" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <Link
                      to="/subscription"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiCreditCard className="w-4 h-4" />
                      Subscription
                    </Link>

                    {/* Language Menu Item */}
                    <div className="relative">
                      {!isLanguageOpen ? (
                        <button
                          onClick={() => setIsLanguageOpen(true)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiGlobe className="w-4 h-4" />
                          Language
                        </button>
                      ) : (
                        <div className="py-1">
                          <button
                            onClick={() => {
                              i18n.changeLanguage("en");
                              setIsLanguageOpen(false);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              i18n.language === "en"
                                ? "text-blue-500"
                                : "text-gray-700"
                            } hover:bg-gray-50 transition-colors`}
                          >
                            <img
                              src={gbFlag}
                              alt="GB flag"
                              className="w-5 h-4"
                            />
                            English
                          </button>
                          <button
                            onClick={() => {
                              i18n.changeLanguage("de");
                              setIsLanguageOpen(false);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              i18n.language === "de"
                                ? "text-blue-500"
                                : "text-gray-700"
                            } hover:bg-gray-50 transition-colors`}
                          >
                            <img
                              src={deFlag}
                              alt="DE flag"
                              className="w-5 h-4"
                            />
                            Deutsch
                          </button>
                          <button
                            onClick={() => {
                              i18n.changeLanguage("fr");
                              setIsLanguageOpen(false);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              i18n.language === "fr"
                                ? "text-blue-500"
                                : "text-gray-700"
                            } hover:bg-gray-50 transition-colors`}
                          >
                            <img
                              src={frFlag}
                              alt="FR flag"
                              className="w-5 h-4"
                            />
                            Français
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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

      {/* Mobile Navigation Menu - Updated */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[80px] bg-white w-full max-h-[80vh] overflow-y-auto rounded-b-2xl shadow-lg transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-2 space-y-1">
          {/* Mobile Menu Links */}
          <Link
            to="/home"
            className={`block px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors ${
              isActive("/home")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* Mobile Tools Dropdown */}
          <div className="py-1">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[15px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiTool className="w-4 h-4 text-gray-500" />
                Tools
              </span>
              <FiChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isToolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isToolsOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 py-1 space-y-1">
                <Link
                  to="/tools/homework-corrections"
                  className="flex items-center px-4 py-2 text-[15px] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsToolsOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiBox className="w-4 h-4 text-blue-500 mr-2" />
                  Homework Corrections
                </Link>
                <Link
                  to="/tools/exercise-forge"
                  className="flex items-center px-4 py-2 text-[15px] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsToolsOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiBox className="w-4 h-4 text-purple-500 mr-2" />
                  Exercise Generator
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Company Dropdown */}
          <div className="py-1">
            <button
              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[15px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiInfo className="w-4 h-4 text-gray-500" />
                Company
              </span>
              <FiChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isCompanyOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isCompanyOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 py-1 space-y-1">
                <Link
                  to="/company/about"
                  className="flex items-center px-4 py-2 text-[15px] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsCompanyOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiInfo className="w-4 h-4 text-blue-500 mr-2" />
                  About Us
                </Link>
                <Link
                  to="/company/contact"
                  className="flex items-center px-4 py-2 text-[15px] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsCompanyOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiMail className="w-4 h-4 text-purple-500 mr-2" />
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Other Mobile Menu Items */}
          <Link
            to="/pricing"
            className={`block px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors ${
              isActive("/pricing")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiCreditCard className="w-4 h-4 text-gray-500 inline mr-2" />
            Pricing
          </Link>

          <Link
            to="/faq"
            className={`block px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors ${
              isActive("/faq")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiInfo className="w-4 h-4 text-gray-500 inline mr-2" />
            FAQ
          </Link>

          {/* Mobile Auth Section */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/subscription"
                  className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiCreditCard className="w-4 h-4 inline mr-2" />
                  Subscription
                </Link>

                {/* Language Selector */}
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-gray-500" />
                    <span className="text-[15px] font-medium text-gray-700">
                      Language
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { code: "en", flag: gbFlag, label: "EN" },
                      { code: "de", flag: deFlag, label: "DE" },
                      { code: "fr", flag: frFlag, label: "FR" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                          i18n.language === lang.code
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={lang.flag}
                          alt={`${lang.code} flag`}
                          className="w-4 h-3"
                        />
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-2.5 text-center text-[15px] font-medium rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
