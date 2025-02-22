import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiArrowRight, FiVideo } from "react-icons/fi";
import { motion } from "framer-motion";
import EducatorChallenges from "./EducatorChallenges";
import NextGenTools from "./NextGenTools";
import * as CookieConsent from "react-cookie-consent";

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
  const { user } = useAuth();

  const resources: Resource[] = [
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: "Tool 1: AI-Powered Correction with Tailored Resources",
      category: "Video Tutorial",
      isLoomVideo: true,
      videoId: "e6c2ca4d96e947cbab8095db19b7f79f",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711999.png",
    },
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: "Tool 2: AI-Powered & Tailored Exercise Creation",
      category: "Video Tutorial",
      isLoomVideo: true,
      videoId: "26cf28ab1b84491da5d413d9a9765240",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711999.png",
    },
  ];

  const handleManageCookies = () => {
    CookieConsent.resetCookieConsentValue();
    window.location.reload();
  };

  return (
    <div className="min-h-screen overflow-hidden pt-20">
      {/* Fixed background that spans the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      {/* Hero Section  */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        {/* Animated grid background */}
        <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-30" />
        <div className="absolute inset-0 -z-10 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8 relative z-10">
              <div className="animate-fade-in [--animate-delay:200ms]">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                  </span>
                  AI-Powered Education Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in [--animate-delay:400ms]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-purple-300">
                  Your Personal AI Tutor Assistant
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl animate-fade-in [--animate-delay:600ms] leading-relaxed">
                Boost your tutoring with personalized insights and smart tools.
                Focus on what truly matters - inspiring your students.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative z-20 animate-fade-in [--animate-delay:800ms]">
                {user ? (
                  <Link
                    to="/tools/homework-corrections"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 w-full sm:w-auto"
                  >
                    Let's start
                    <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      Start Free Trial
                      <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/auth"
                      className="inline-flex items-center px-8 py-4 bg-gray-800/50 text-gray-100 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 backdrop-blur-sm border border-gray-700"
                    >
                      Educator Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hidden lg:block relative animate-fade-in [--animate-delay:1000ms]">
              <div className="relative">
                {/* Glow effect - desktop only */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-30 animate-pulse"></div>

                {/* Image container */}
                <div className="relative rounded-[2.5rem] overflow-hidden transform hover:rotate-1 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl"></div>
                  <div className="relative h-auto flex items-center justify-center">
                    <img
                      src="/mask-icon.png"
                      alt="AI Tutor Assistant"
                      className="relative w-full h-[500px] object-contain p-8 opacity-70 [filter:drop-shadow(0_0_20px_rgba(59,130,246,0.5))_brightness(0.9)_hue-rotate(10deg)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EducatorChallenges />

      <NextGenTools />

      {/* Resources Section  */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100 to-blue-100 border border-violet-200/50 text-violet-700 shadow-sm transition-all hover:shadow-md"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              LEARNING RESOURCES
            </motion.span>
            <h2 className="mt-8 text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent tracking-tight">
              Guides & Tutorials
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <article
                key={index}
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
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
                    <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-2 text-blue-500">
                        {resource.icon}
                        <span className="text-sm font-medium">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-900">
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
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-blue-500">
                        {resource.icon}
                        <span className="text-sm font-medium">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-900">
                        {resource.title}
                      </h3>
                      {resource.link && (
                        <Link
                          to={resource.link}
                          className="mt-6 inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors group"
                        >
                          Learn More
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

      {/* CTA Section - Enhanced Design */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Transform Your Teaching Today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of educators enhancing their STEM instruction with
            AI-powered tools
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-white/25 hover:scale-105"
            >
              Start Free Trial
              <FiArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          {/* Grid Container */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Product */}
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="../company/pricing"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/docs"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company - Full width on mobile */}
            <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                Company
              </h3>
              <ul className="space-y-2 grid grid-cols-2 md:block gap-2">
                <li>
                  <Link
                    to="../company/about"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="../company/contact"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal - Full width on mobile */}
            <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
              <h3 className="text-white font-semibold mb-3 text-sm md:text-base">
                Legal
              </h3>
              <ul className="space-y-2 grid grid-cols-2 md:block gap-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm hover:text-white transition-colors block py-1"
                  >
                    Terms
                  </Link>
                </li>
                <li className="col-span-2 md:col-span-1">
                  <button
                    onClick={handleManageCookies}
                    className="text-sm hover:text-white transition-colors block py-1 text-left w-full"
                    aria-label="Manage Cookie Preferences"
                  >
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright - Separated with border */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-sm text-gray-500">
              &copy; 2025 RobinAgent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
