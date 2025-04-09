import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiArrowRight, FiVideo, FiZap, FiClock, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import EducatorChallengesMindMap from "./EducatorChallenges";
import MainFeatures from "./MainFeatures";
import NextGenTools from "./NextGenTools";
import * as CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";

interface Resource {
  icon: JSX.Element;
  title: string;
  category: string;
  link?: string;
  isLoomVideo?: boolean;
  videoId?: string;
  image: string;
}

export function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Refs for section visibility tracking
  const heroSectionRef = useRef<HTMLElement>(null);
  const mainFeaturesRef = useRef<HTMLDivElement>(null);
  const educatorChallengesRef = useRef<HTMLDivElement>(null);
  const nextGenToolsRef = useRef<HTMLDivElement>(null);
  const resourcesSectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  // Track section visibility state
  const [sectionViewed, setSectionViewed] = useState({
    hero: false,
    mainFeatures: false,
    educatorChallenges: false,
    nextGenTools: false,
    resources: false,
    cta: false,
  });

  // Track scroll depth
  const [scrollDepth, setScrollDepth] = useState({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  // Track page load time for engagement metrics
  const pageLoadTime = useRef(Date.now());

  // Helper to calculate the current scroll depth percentage
  const calculateScrollDepth = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    return Math.round((scrollTop / (docHeight - winHeight)) * 100);
  };

  // Google Analytics event tracking helper with more detailed parameters
  const trackEvent = (eventName: string, eventParams = {}) => {
    // Make sure gtag is available
    if (window.gtag) {
      // Add common parameters to all events
      const enhancedParams = {
        ...eventParams,
        page_title: "Home Page",
        page_location: window.location.href,
        page_path: window.location.pathname,
        user_type: user ? "logged_in" : "not_logged_in",
        device_type: isMobile ? "mobile" : "desktop",
        timestamp: new Date().toISOString(),
      };

      window.gtag("event", eventName, enhancedParams);
      console.log(`Analytics event: ${eventName}`, enhancedParams);
    }
  };

  // Track initial page load events
  useEffect(() => {
    // Set page load time
    pageLoadTime.current = Date.now();

    // Track page view with enhanced parameters
    trackEvent("page_view", {
      session_id: generateSessionId(),
      landing_page: true,
    });

    // Track session start
    const isFirstVisit = !localStorage.getItem("returning_visitor");
    if (isFirstVisit) {
      localStorage.setItem("returning_visitor", "true");
      trackEvent("first_visit", {
        referrer: document.referrer,
        entry_point: "home_page",
      });
    } else {
      trackEvent("return_visit", {
        visit_count: getVisitCount(),
        days_since_last_visit: getDaysSinceLastVisit(),
      });
    }

    // Track session start
    trackEvent("session_start", {
      session_id: generateSessionId(),
      referrer: document.referrer,
    });

    // Set initial mobile state
    setIsMobile(window.innerWidth < 768);

    // Add resize listener
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        trackEvent("screen_resize", {
          new_width: window.innerWidth,
          new_height: window.innerHeight,
          new_device_type: newIsMobile ? "mobile" : "desktop",
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Set up session duration tracking
    const sessionStartTime = Date.now();
    const trackSessionDuration = () => {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      trackEvent("session_duration", {
        duration_seconds: duration,
        is_bounce: isBounce(duration),
      });
    };

    // Track session duration on page hide/unload
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        trackSessionDuration();
      }
    });
    window.addEventListener("beforeunload", trackSessionDuration);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeunload", trackSessionDuration);
    };
  }, []);

  // Helper functions for analytics
  const generateSessionId = () => {
    // Get or create a session ID
    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  const getVisitCount = () => {
    const count = parseInt(localStorage.getItem("visit_count") || "0", 10);
    localStorage.setItem("visit_count", (count + 1).toString());
    return count + 1;
  };

  const getDaysSinceLastVisit = () => {
    const lastVisit = localStorage.getItem("last_visit_date");
    if (!lastVisit) return 0;

    const days = Math.floor(
      (Date.now() - parseInt(lastVisit, 10)) / (1000 * 60 * 60 * 24)
    );
    localStorage.setItem("last_visit_date", Date.now().toString());
    return days;
  };

  const isBounce = (durationSeconds: number) => {
    // Consider it a bounce if they spent less than 30 seconds and didn't interact
    return durationSeconds < 30 && !localStorage.getItem("user_engaged");
  };

  // Track scroll depth and section visibility
  useEffect(() => {
    let scrollTimeoutId: NodeJS.Timeout | null = null;
    let lastScrollY = 0;

    // Debounced scroll handler to prevent excessive event firing
    const handleScroll = () => {
      // Cancel any pending timeout
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }

      // Only process scroll events that move more than a certain threshold
      const currentScrollY = window.scrollY;
      const hasScrolledSignificantly =
        Math.abs(currentScrollY - lastScrollY) > 50;

      if (hasScrolledSignificantly || !scrollTimeoutId) {
        lastScrollY = currentScrollY;

        // Use timeout to debounce the scroll handling
        scrollTimeoutId = setTimeout(() => {
          processScrollPosition(currentScrollY);
          scrollTimeoutId = null;
        }, 200); // 200ms delay to debounce
      }
    };

    const processScrollPosition = (scrollY: number) => {
      // Track scroll depth
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollY / (docHeight - winHeight)) * 100;

      // Only track each depth threshold once per session
      if (scrollPercent >= 25 && !scrollDepth[25]) {
        setScrollDepth((prev) => ({ ...prev, 25: true }));
        trackEvent("scroll_depth", {
          depth: 25,
          scroll_location: getScrollLocation(),
        });
      }
      if (scrollPercent >= 50 && !scrollDepth[50]) {
        setScrollDepth((prev) => ({ ...prev, 50: true }));
        trackEvent("scroll_depth", {
          depth: 50,
          scroll_location: getScrollLocation(),
        });
      }
      if (scrollPercent >= 75 && !scrollDepth[75]) {
        setScrollDepth((prev) => ({ ...prev, 75: true }));
        trackEvent("scroll_depth", {
          depth: 75,
          scroll_location: getScrollLocation(),
        });
      }
      if (scrollPercent >= 99 && !scrollDepth[100]) {
        setScrollDepth((prev) => ({ ...prev, 100: true }));
        trackEvent("scroll_depth", { depth: 100, scroll_location: "footer" });
      }

      // Check if sections are visible
      checkSectionVisibility();
    };

    const getScrollLocation = () => {
      // Determine which section the user is currently looking at
      const viewportHeight = window.innerHeight;
      const viewportMidpoint = window.scrollY + viewportHeight / 2;

      if (
        heroSectionRef.current &&
        isElementVisible(heroSectionRef.current, viewportMidpoint)
      ) {
        return "hero_section";
      } else if (
        mainFeaturesRef.current &&
        isElementVisible(mainFeaturesRef.current, viewportMidpoint)
      ) {
        return "main_features";
      } else if (
        educatorChallengesRef.current &&
        isElementVisible(educatorChallengesRef.current, viewportMidpoint)
      ) {
        return "educator_challenges";
      } else if (
        nextGenToolsRef.current &&
        isElementVisible(nextGenToolsRef.current, viewportMidpoint)
      ) {
        return "next_gen_tools";
      } else if (
        resourcesSectionRef.current &&
        isElementVisible(resourcesSectionRef.current, viewportMidpoint)
      ) {
        return "resources";
      } else if (
        ctaSectionRef.current &&
        isElementVisible(ctaSectionRef.current, viewportMidpoint)
      ) {
        return "cta_section";
      }

      return "unknown";
    };

    const isElementVisible = (
      element: HTMLElement,
      viewportMidpoint: number
    ) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementBottom = rect.bottom + window.scrollY;
      return (
        viewportMidpoint >= elementTop && viewportMidpoint <= elementBottom
      );
    };

    const checkSectionVisibility = () => {
      // Mark sections as viewed when they become visible
      // Uses isInViewport function to determine if a section is in the viewport
      const sectionVisibilityMap = {
        hero: {
          ref: heroSectionRef.current,
          position: 1,
          viewed: sectionViewed.hero,
        },
        mainFeatures: {
          ref: mainFeaturesRef.current,
          position: 2,
          viewed: sectionViewed.mainFeatures,
        },
        educatorChallenges: {
          ref: educatorChallengesRef.current,
          position: 3,
          viewed: sectionViewed.educatorChallenges,
        },
        nextGenTools: {
          ref: nextGenToolsRef.current,
          position: 4,
          viewed: sectionViewed.nextGenTools,
        },
        resources: {
          ref: resourcesSectionRef.current,
          position: 5,
          viewed: sectionViewed.resources,
        },
        cta: {
          ref: ctaSectionRef.current,
          position: 6,
          viewed: sectionViewed.cta,
        },
      };

      // Check each section once, and only track if it's not already viewed
      Object.entries(sectionVisibilityMap).forEach(([key, value]) => {
        if (value.ref && isInViewport(value.ref) && !value.viewed) {
          // Update our state to mark this section as viewed (to avoid duplicate events)
          setSectionViewed((prev) => ({
            ...prev,
            [key]: true,
          }));

          // Only track this event once per section per page load
          trackEvent("section_view", {
            section_name:
              key === "hero"
                ? "hero"
                : key === "mainFeatures"
                ? "main_features"
                : key === "educatorChallenges"
                ? "educator_challenges"
                : key === "nextGenTools"
                ? "next_gen_tools"
                : key === "resources"
                ? "resources"
                : "cta_section",
            section_position: value.position,
            view_count: 1, // Always 1 since we're ensuring each section is only tracked once
            time_since_page_load: Math.floor(
              (Date.now() - pageLoadTime.current) / 1000
            ),
          });
        }
      });
    };

    const isInViewport = (element: HTMLElement) => {
      // Modify the threshold to count as "viewed" only when a significant portion is visible
      // This helps avoid tracking a section that's barely visible at the edge of the screen
      const rect = element.getBoundingClientRect();
      const threshold = 0.3; // Element is considered viewed when 30% is visible

      const elementHeight = rect.bottom - rect.top;
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const visibleRatio = visibleHeight / elementHeight;

      return visibleRatio >= threshold;
    };

    // Register scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check with slight delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      processScrollPosition(window.scrollY);
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      clearTimeout(initialTimeout);
    };
  }, []); // No dependencies to prevent re-attaching scroll listener

  // Track user engagement
  useEffect(() => {
    const trackEngagement = () => {
      // Track that the user engaged with the page
      localStorage.setItem("user_engaged", "true");
      trackEvent("user_engagement", { engagement_type: "any_interaction" });

      // Remove the listeners after first engagement
      document.removeEventListener("click", trackEngagement);
      document.removeEventListener("keydown", trackEngagement);
      document.removeEventListener("mousemove", trackEngagement);
      document.removeEventListener("touchstart", trackEngagement);
    };

    // Register engagement event listeners
    document.addEventListener("click", trackEngagement);
    document.addEventListener("keydown", trackEngagement);
    document.addEventListener("mousemove", trackEngagement);
    document.addEventListener("touchstart", trackEngagement);

    // Cleanup
    return () => {
      document.removeEventListener("click", trackEngagement);
      document.removeEventListener("keydown", trackEngagement);
      document.removeEventListener("mousemove", trackEngagement);
      document.removeEventListener("touchstart", trackEngagement);
    };
  }, []);

  const resources: Resource[] = [
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: t("home.resources.tool1.title"),
      category: t("home.resources.tool1.category"),
      isLoomVideo: true,
      videoId: "e6c2ca4d96e947cbab8095db19b7f79f",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711999.png",
    },
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: t("home.resources.tool2.title"),
      category: t("home.resources.tool2.category"),
      isLoomVideo: true,
      videoId: "26cf28ab1b84491da5d413d9a9765240",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711999.png",
    },
  ];

  const handleManageCookies = () => {
    // Track cookie settings click with enhanced details
    trackEvent("button_click", {
      button_name: "manage_cookies",
      button_location: "footer",
      page_section: "footer",
    });

    CookieConsent.resetCookieConsentValue();
    window.location.reload();
  };

  // Simplified particle component for background
  const HeroParticles = () => {
    // Reduce particle count on mobile
    const particleCount = window.innerWidth < 768 ? 4 : 12;
    const particles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            // Simplify animation for mobile
            initial={{ opacity: 0 }}
            animate={{
              y: window.innerWidth < 768 ? [-20, -60] : [0, -100, 0],
              opacity: window.innerWidth < 768 ? [0, 0.3, 0] : [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  const valueProps = [
    {
      icon: <FiZap className="w-4 h-4" />,
      text: t("home.hero.badges.aiPowered"),
    },
    {
      icon: <FiClock className="w-4 h-4" />,
      text: t("home.hero.badges.saveTime"),
    },
    {
      icon: <FiAward className="w-4 h-4" />,
      text: t("home.hero.badges.stemFocused"),
    },
  ];

  const [isHeroFullscreen, setIsHeroFullscreen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prevSlide) => (prevSlide === 0 ? 3 : prevSlide - 1));
  };

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prevSlide) => (prevSlide === 3 ? 0 : prevSlide + 1));
  };

  // Hero image paths
  const heroImages = [
    "/tool_screenshot/hero_2.png",
    "/tool_screenshot/hero_1.png",
    "/tool_screenshot/hero_3.png",
    "/tool_screenshot/hero_4.png",
  ];

  return (
    <div className="min-h-screen overflow-hidden pt-16">
      {/* Fixed background that spans the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      <section
        ref={heroSectionRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Peeking face animation - only visible on mobile */}
        {isMobile && (
          <>
            <motion.div
              className="absolute z-20 right-0 top-[15%] transform origin-right"
              initial={{ x: "100%", rotate: 5, scale: 0.9 }}
              animate={{
                x: ["100%", "45%", "45%", "45%", "100%"],
                rotate: [5, -8, -10, -8, 5],
                scale: [0.9, 1.05, 1.05, 1.05, 0.9],
                y: ["0%", "-5%", "-7%", "-5%", "0%"],
              }}
              transition={{
                times: [0, 0.35, 0.55, 0.75, 1],
                duration: 6,
                ease: [
                  "easeOut",
                  "easeInOut",
                  "easeInOut",
                  "easeInOut",
                  "easeIn",
                ],
              }}
            >
              <img
                src="/hero_face.png"
                alt=""
                className="w-28 h-28 md:w-32 md:h-32 object-contain filter drop-shadow-xl"
                aria-hidden="true"
              />
            </motion.div>

            {/* Peeking arm animation pointing to CTA button - only visible on mobile */}
            <motion.div
              className="absolute z-20 right-0 bottom-[45%] transform origin-right"
              initial={{ x: "100%", rotate: 0, scale: 0.9 }}
              animate={{
                x: ["100%", "30%", "30%", "30%", "100%"],
                rotate: [0, -20, -18, -20, 0],
                scale: [0.9, 1, 1.05, 1, 0.9],
                y: ["0%", "0%", "-5%", "0%", "0%"],
              }}
              transition={{
                times: [0, 0.3, 0.5, 0.7, 1],
                duration: 7.5,
                delay: 1.5, // Start a bit sooner for better sequence with face
                ease: [
                  "easeOut",
                  "easeInOut",
                  "easeInOut",
                  "easeInOut",
                  "easeIn",
                ],
              }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: 2,
                  repeatDelay: 0.5,
                  delay: 3.5, // Start bouncing after the arm has peeked in
                }}
              >
                <img
                  src="/arm_hero.png"
                  alt=""
                  className="w-44 h-44 object-contain filter drop-shadow-xl"
                  aria-hidden="true"
                />
              </motion.div>
            </motion.div>
          </>
        )}

        {/* Simplified background for mobile, full version for desktop */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900">
          {/* Only render this complex gradient on desktop */}
          {window.innerWidth >= 768 && (
            <div className="absolute inset-0 opacity-40 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
          )}
          {/* Simplify or remove grid pattern on mobile */}
          {window.innerWidth >= 768 ? (
            <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          ) : (
            <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:48px_48px]"></div>
          )}

          {/* Only include particles on mobile */}
          {window.innerWidth < 768 && <HeroParticles />}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8 relative z-10">
              {/* Value proposition pills in a row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-2 w-full"
                >
                  {valueProps.map((prop, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-blue-200 shadow-sm shadow-blue-500/20 border border-blue-400/20 backdrop-blur-sm hover:from-blue-500/30 hover:via-indigo-500/30 hover:to-purple-500/30 hover:shadow-purple-500/20 transition-all duration-300"
                    >
                      <span className="text-blue-300">{prop.icon}</span>
                      {prop.text}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Main heading with cleaner text */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-purple-300 drop-shadow-sm">
                  {t("home.hero.title")}
                </span>
              </h1>

              {/* Enhanced subheading with specific value proposition */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-200/90 max-w-2xl leading-relaxed mb-8"
              >
                {t("home.hero.subtitle")}
              </motion.p>

              {/* Social proof element */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex -space-x-2"></div>
                <span className="text-blue-100 text-sm">
                  {t("home.hero.socialProof")}
                </span>
              </motion.div>

              {/* Enhanced CTA buttons with better tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative z-20"
              >
                {user ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/tools/homework-corrections"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 w-full sm:w-auto backdrop-blur-sm relative overflow-hidden"
                      onClick={() =>
                        trackEvent("cta_click", {
                          button_name: "get_started",
                          button_location: "hero_section",
                          user_status: "logged_in",
                          interaction_type: "primary_cta",
                          destination: "/tools/homework-corrections",
                        })
                      }
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative">
                        {t("home.hero.cta.start")}
                        <FiArrowRight className="ml-3 inline-block transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/auth"
                        className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-purple-700/40 transition-all duration-300 relative overflow-hidden"
                        onClick={() =>
                          trackEvent("cta_click", {
                            button_name: "free_trial",
                            button_location: "hero_section",
                            user_status: "not_logged_in",
                            interaction_type: "primary_cta",
                            destination: "/auth",
                          })
                        }
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative">
                          {t("home.hero.cta.trial")}
                          <FiArrowRight className="ml-3 inline-block transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </motion.div>

                    {/* Hero Screenshots Carousel - only visible on mobile */}
                    <div className="relative w-full max-w-md mx-auto my-4 lg:hidden">
                      <div className="relative overflow-hidden rounded-lg shadow-lg h-64">
                        <div className="relative h-full">
                          {/* Loading indicator */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>

                          {/* Carousel container */}
                          <div
                            className="flex transition-transform duration-300 ease-in-out h-full"
                            style={{
                              transform: `translateX(-${
                                currentHeroSlide * 100
                              }%)`,
                            }}
                          >
                            {heroImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Hero ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer flex-shrink-0 min-w-full"
                                onClick={() => setIsHeroFullscreen(true)}
                                onLoad={(e) => {
                                  // Hide loading indicator when image loads
                                  const target = e.target as HTMLImageElement;
                                  const parent =
                                    target.parentElement?.parentElement;
                                  const loadingIndicator =
                                    parent?.querySelector(
                                      "div.absolute.inset-0.flex"
                                    );
                                  if (loadingIndicator)
                                    loadingIndicator.classList.add("hidden");
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://via.placeholder.com/800x500?text=Hero+${
                                    index + 1
                                  }`;
                                }}
                              />
                            ))}
                          </div>

                          {/* Click to expand indicator for mobile */}
                          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-md flex items-center gap-1 z-30 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 3h6m0 0v6m0-6L14 10m-4 7l-7 7m0 0H9m-6-6v-6m0 0h6"
                              />
                            </svg>
                            <span>Tap to expand</span>
                          </div>

                          {/* Left navigation arrow */}
                          <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 transition-colors"
                            onClick={prevHeroSlide}
                            aria-label="Previous image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          {/* Right navigation arrow */}
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 transition-colors"
                            onClick={nextHeroSlide}
                            aria-label="Next image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Dots indicator */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                          {heroImages.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                currentHeroSlide === index
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                              onClick={() => setCurrentHeroSlide(index)}
                              aria-label={`Show image ${index + 1}`}
                            ></button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/auth"
                        className="group inline-flex items-center justify-center px-8 py-4 bg-gray-800/60 text-gray-100 rounded-xl font-medium hover:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-gray-900/20 relative overflow-hidden"
                        onClick={() =>
                          trackEvent("cta_click", {
                            button_name: "login",
                            button_location: "hero_section",
                            user_status: "not_logged_in",
                            interaction_type: "secondary_cta",
                            destination: "/auth",
                          })
                        }
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative">
                          {t("home.hero.cta.login")}
                        </span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Fullscreen modal for hero screenshots */}
              {isHeroFullscreen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                  <div className="relative w-full max-w-4xl">
                    <img
                      src={heroImages[currentHeroSlide]}
                      alt={`Hero ${currentHeroSlide + 1}`}
                      className="w-full h-auto object-contain max-h-[90vh]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/1200x800?text=Screenshot+Not+Found";
                      }}
                    />

                    {/* Close button */}
                    <button
                      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      onClick={() => setIsHeroFullscreen(false)}
                      aria-label="Close fullscreen view"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Navigation arrows */}
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      onClick={prevHeroSlide}
                      aria-label="Previous image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      onClick={nextHeroSlide}
                      aria-label="Next image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced visual container */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="hidden lg:block relative"
            >
              <div className="relative flex flex-col items-center justify-center h-full">
                {/* Hero Screenshots Carousel for desktop */}
                <div className="relative w-full mx-auto">
                  <div className="relative overflow-hidden rounded-xl shadow-2xl h-[400px]">
                    <div className="relative h-full">
                      {/* Loading indicator */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>

                      {/* Carousel container */}
                      <div
                        className="flex transition-transform duration-300 ease-in-out h-full"
                        style={{
                          transform: `translateX(-${currentHeroSlide * 100}%)`,
                        }}
                      >
                        {heroImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Hero ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer flex-shrink-0 min-w-full"
                            onClick={() => setIsHeroFullscreen(true)}
                            onLoad={(e) => {
                              // Hide loading indicator when image loads
                              const target = e.target as HTMLImageElement;
                              const parent =
                                target.parentElement?.parentElement;
                              const loadingIndicator = parent?.querySelector(
                                "div.absolute.inset-0.flex"
                              );
                              if (loadingIndicator)
                                loadingIndicator.classList.add("hidden");
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/800x500?text=Hero+${
                                index + 1
                              }`;
                            }}
                          />
                        ))}
                      </div>

                      {/* Click to expand indicator for desktop */}
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-sm py-1.5 px-2.5 rounded-md flex items-center gap-1.5 z-30 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 3h6m0 0v6m0-6L14 10m-4 7l-7 7m0 0H9m-6-6v-6m0 0h6"
                          />
                        </svg>
                        <span>Click to view fullscreen</span>
                      </div>

                      {/* Left navigation arrow */}
                      <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 transition-colors"
                        onClick={prevHeroSlide}
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Right navigation arrow */}
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white z-20 hover:bg-black/70 transition-colors"
                        onClick={nextHeroSlide}
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {heroImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              currentHeroSlide === index
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                            onClick={() => setCurrentHeroSlide(index)}
                            aria-label={`Show image ${index + 1}`}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced wave pattern at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
      </section>

      <div className="space-y-10">
        <div ref={mainFeaturesRef}>
          <MainFeatures
            onFeatureClick={(featureName: string) =>
              trackEvent("feature_click", {
                feature_name: featureName,
                section_name: "main_features",
                interaction_type: "feature_card",
              })
            }
          />
        </div>

        <div ref={educatorChallengesRef}>
          <EducatorChallengesMindMap
            onChallengeClick={(challengeName: string) =>
              trackEvent("challenge_click", {
                challenge_name: challengeName,
                section_name: "educator_challenges",
                interaction_type: "challenge_card",
              })
            }
          />
        </div>

        <div ref={nextGenToolsRef}>
          <NextGenTools
            onToolClick={(toolName: string) =>
              trackEvent("tool_click", {
                tool_name: toolName,
                section_name: "next_gen_tools",
                interaction_type: "tool_card",
              })
            }
          />
        </div>

        {/* Resources Section */}
        <section
          ref={resourcesSectionRef}
          id="guides-tutorials"
          className="relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-16"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-violet-100/80 to-blue-100/80 border border-violet-200/20 text-violet-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                </span>
                {t("home.learningResources.badge")}
              </motion.span>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent pb-1">
                {t("home.learningResources.title")}
              </h2>

              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                {t("home.learningResources.description")}
              </p>
            </motion.div>

            {/* Resources Grid with enhanced tracking */}
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <article
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                  onClick={() => {
                    // Track resource engagement with enhanced details
                    trackEvent("resource_click", {
                      resource_title: resource.title,
                      resource_category: resource.category,
                      resource_type: resource.isLoomVideo ? "video" : "link",
                      resource_index: index,
                      section_name: "resources",
                      interaction_type: resource.isLoomVideo
                        ? "video_resource"
                        : "link_resource",
                      time_on_page: Math.floor(
                        (Date.now() - pageLoadTime.current) / 1000
                      ),
                      scroll_depth_reached: calculateScrollDepth(),
                    });

                    // For video resources, also track video view starts
                    if (resource.isLoomVideo) {
                      trackEvent("video_interaction", {
                        video_title: resource.title,
                        video_id: resource.videoId,
                        interaction_type: "view_start",
                      });
                    }
                  }}
                >
                  {resource.isLoomVideo ? (
                    <>
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://www.loom.com/embed/${resource.videoId}?autoplay=0&hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_title=true`}
                          frameBorder="0"
                          allow="fullscreen"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 flex-grow">
                        <div className="flex items-center gap-2 text-blue-500">
                          {resource.icon}
                          <span className="text-sm font-medium">
                            {resource.category}
                          </span>
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-2">
                          {resource.title}
                        </h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                          src={resource.image}
                          alt=""
                          className="h-32 w-32 object-contain opacity-90 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6 flex-grow">
                        <div className="flex items-center gap-2 text-blue-500">
                          {resource.icon}
                          <span className="text-sm font-medium">
                            {resource.category}
                          </span>
                        </div>
                        <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-2">
                          {resource.title}
                        </h3>
                        {resource.link && (
                          <Link
                            to={resource.link}
                            className="mt-4 inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors group"
                          >
                            {t("home.learningResources.learnMore")}
                            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={ctaSectionRef}
          className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-24"
        >
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
          <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("home.callToAction.heading")}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("home.callToAction.subheading")}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-white/25 hover:scale-105"
                onClick={() =>
                  trackEvent("cta_click", {
                    button_name: "bottom_signup",
                    button_location: "cta_section",
                    user_status: user ? "logged_in" : "not_logged_in",
                    interaction_type: "bottom_cta",
                    destination: "/signup",
                  })
                }
              >
                {t("home.callToAction.button")}
                <FiArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-gray-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                {t("home.footer.columns.product.title")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.product.links.features")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="../pricing"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.product.links.pricing")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                {t("home.footer.columns.resources.title")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/docs"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.resources.links.docs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.resources.links.tutorials")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                {t("home.footer.columns.company.title")}
              </h3>
              <ul className="space-y-2 grid grid-cols-2 md:block gap-2">
                <li>
                  <Link
                    to="../company/about"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.company.links.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="../company/contact"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    {t("home.footer.columns.company.links.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                {t("home.footer.columns.legal.title")}
              </h3>
              <ul className="space-y-2 grid grid-cols-2 md:block gap-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm hover:text-white transition-colors block py-1"
                    onClick={() =>
                      trackEvent("footer_link_click", {
                        link_name: "privacy_policy",
                        link_location: "footer",
                        destination: "/privacy",
                      })
                    }
                  >
                    {t("home.footer.columns.legal.links.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm hover:text-white transition-colors block py-1"
                    onClick={() =>
                      trackEvent("footer_link_click", {
                        link_name: "terms_of_service",
                        link_location: "footer",
                        destination: "/terms",
                      })
                    }
                  >
                    {t("home.footer.columns.legal.links.terms")}
                  </Link>
                </li>
                <li className="col-span-2 md:col-span-1">
                  <button
                    onClick={handleManageCookies}
                    className="text-sm hover:text-white transition-colors block py-1 text-left w-full"
                    aria-label="Manage Cookie Preferences"
                  >
                    {t("home.footer.columns.legal.links.cookieSettings")}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-sm text-gray-500">
              {t("home.footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
