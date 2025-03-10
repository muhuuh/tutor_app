import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiArrowRight, FiVideo, FiZap, FiClock, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import EducatorChallenges from "./EducatorChallenges";
import NextGenTools from "./NextGenTools";
import * as CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// Add TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
    dataLayer: any[];
  }
}

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

  // Google Analytics event tracking helper
  const trackEvent = (eventName: string, eventParams = {}) => {
    // Make sure gtag is available
    if (window.gtag) {
      window.gtag("event", eventName, eventParams);
    }
  };

  // Track page view when component mounts
  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Home Page",
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
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
    // Track cookie settings click
    trackEvent("button_click", {
      button_name: "manage_cookies",
      page: "home",
    });

    CookieConsent.resetCookieConsentValue();
    window.location.reload();
  };

  // Simplified particle component for background
  const HeroParticles = () => {
    const particles = Array.from({ length: 12 }).map((_, i) => ({
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
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
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

  // Value propositions for hero badge pills - simplified
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

  return (
    <div className="min-h-screen overflow-hidden pt-16">
      {/* Fixed background that spans the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Enhanced background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900">
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          {/* Dynamic glow spots */}
          <motion.div
            className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-[80px]"
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-[100px]"
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute left-2/3 top-1/3 w-72 h-72 bg-indigo-500 opacity-20 rounded-full blur-[90px]"
            animate={{
              opacity: [0.1, 0.25, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Floating particles */}
          <HeroParticles />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8 relative z-10">
              {/* Value proposition pills in a row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-2">
                {valueProps.map((prop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 ring-1 ring-blue-400/30 border border-blue-400/20 backdrop-blur-sm"
                  >
                    <span className="text-blue-300">{prop.icon}</span>
                    {prop.text}
                  </motion.div>
                ))}
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

              {/* Enhanced CTA buttons */}
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
                          user_status: "logged_in",
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
                            user_status: "not_logged_in",
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
                            user_status: "not_logged_in",
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
            </div>

            {/* Enhanced visual container */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Visual frame with simplified container */}
                <motion.div
                  className="relative w-80 h-80 mx-auto"
                  animate={{
                    rotateY: [0, 5, 0, -5, 0],
                    rotateX: [0, 3, 0, -3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut",
                  }}
                >
                  {/* Orbiting elements with multiple rings */}
                  <div className="absolute inset-0">
                    {/* First orbit ring */}
                    <motion.div
                      className="absolute w-full h-full rounded-full border border-blue-500/10"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      />
                    </motion.div>

                    {/* Second orbit ring */}
                    <motion.div
                      className="absolute w-[110%] h-[110%] -inset-[5%] rounded-full border border-purple-500/10"
                      animate={{ rotate: [360, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute left-0 top-1/3 w-5 h-5 bg-purple-500 rounded-full"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                      />
                    </motion.div>

                    {/* Third orbit ring */}
                    <motion.div
                      className="absolute w-[120%] h-[120%] -inset-[10%] rounded-full border border-indigo-500/10"
                      animate={{ rotate: [180, 540] }}
                      transition={{
                        repeat: Infinity,
                        duration: 35,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="absolute right-1/4 bottom-0 w-4 h-4 bg-indigo-400 rounded-full"
                        animate={{
                          scale: [0.7, 1.1, 0.7],
                          opacity: [0.5, 0.9, 0.5],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.5,
                          delay: 0.5,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Main orb layers */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-800/20 backdrop-blur-3xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 8,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/20 backdrop-blur-3xl"
                    animate={{
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 10,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-16 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 backdrop-blur-3xl"
                    animate={{
                      scale: [0.92, 1.08, 0.92],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 9,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />

                  {/* Core with mask icon */}
                  <div className="absolute inset-20 rounded-full bg-gradient-to-br from-indigo-900/90 to-blue-900/90 shadow-[0_0_30px_15px_rgba(110,120,255,0.2)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.img
                        src="/mask-icon.png"
                        alt="AI Tutor Assistant"
                        className="w-32 h-auto opacity-90 filter brightness-1.5"
                        animate={{
                          scale: [1, 1.03, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 6,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* Enhanced floating feature labels with animations - made slightly smaller and added two more */}
                  <motion.div
                    className="absolute -top-6 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/60 to-blue-700/60 text-blue-50 text-xs font-medium tracking-wide backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/20"
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                  >
                    {t("home.hero.animatedFeatures.autoGrading")}
                  </motion.div>

                  <motion.div
                    className="absolute bottom-12 -left-14 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600/60 to-indigo-700/60 text-indigo-50 text-xs font-medium tracking-wide backdrop-blur-md border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
                    animate={{
                      y: [0, 6, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    {t("home.hero.animatedFeatures.personalizedFeedback")}
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 right-5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/60 to-purple-700/60 text-purple-50 text-xs font-medium tracking-wide backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/20"
                    animate={{
                      y: [0, 6, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.5,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  >
                    {t("home.hero.animatedFeatures.customExercises")}
                  </motion.div>

                  {/* New feature label: Performance Tracking */}
                  <motion.div
                    className="absolute top-6 -left-16 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/60 to-blue-600/60 text-cyan-50 text-xs font-medium tracking-wide backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                    animate={{
                      y: [0, -5, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.7,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  >
                    {t("home.hero.animatedFeatures.performanceTracking")}
                  </motion.div>

                  {/* New feature label: Tailored Education Videos */}
                  <motion.div
                    className="absolute right-[-70px] top-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600/60 to-emerald-600/60 text-teal-50 text-xs font-medium tracking-wide backdrop-blur-md border border-teal-500/30 shadow-lg shadow-teal-500/20"
                    animate={{
                      x: [0, -6, 0],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.2,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  >
                    {t("home.hero.animatedFeatures.tailoredVideos")}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced wave pattern at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
      </section>

      <div className="space-y-16">
        <EducatorChallenges />
        <NextGenTools />

        {/* Resources Section */}
        <section id="guides-tutorials" className="relative overflow-hidden">
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

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <article
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                  onClick={() => {
                    trackEvent("resource_click", {
                      resource_title: resource.title,
                      resource_category: resource.category,
                      resource_type: resource.isLoomVideo ? "video" : "link",
                    });
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

        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-24">
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
                  >
                    {t("home.footer.columns.legal.links.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm hover:text-white transition-colors block py-1"
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
