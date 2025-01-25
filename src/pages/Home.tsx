import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiCheck,
  FiArrowRight,
  FiBook,
  FiZap,
  FiTrendingUp,
  FiTarget,
  FiEdit3,
  FiBarChart2,
  FiFileText,
  FiVideo,
  FiClock,
} from "react-icons/fi";

export function Home() {
  const { user } = useAuth();

  // Updated pain points with modern icons and concise copy
  const painPoints = [
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: "Smart Grading",
      description:
        "Automated evaluation of complex STEM problems with AI-powered partial credit system",
      solution: "Instant grading with detailed feedback",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Consistent Evaluation",
      description:
        "Uniform grading standards across all students and assignments",
      solution: "AI-assisted standardized rubrics",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Adaptive Learning",
      description:
        "Dynamic adjustment of teaching materials based on student performance",
      solution: "Real-time learning analytics dashboard",
    },
  ];

  // Features with gradient backgrounds and hover effects
  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced handwriting recognition for mathematical notations and chemical formulas",
      gradient: "from-purple-600 to-blue-500",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Interactive dashboards with competency mapping and skill progression",
      gradient: "from-pink-600 to-rose-500",
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Dynamic Content",
      description:
        "Automated generation of practice problems based on learning gaps",
      gradient: "from-orange-600 to-amber-500",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Deep Analytics",
      description:
        "Concept-level performance breakdown with comparative insights",
      gradient: "from-green-600 to-cyan-500",
    },
  ];

  // New blog and tutorials section data
  const resources = [
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Mastering AI Grading",
      category: "Blog Post",
      link: "/blog/ai-grading",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711987.png",
    },
    {
      icon: <FiVideo className="w-6 h-6" />,
      title: "Personalized Learning Paths",
      category: "Video Tutorial",
      link: "/tutorials/learning-paths",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711999.png",
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "STEM Assessment Guide",
      category: "eBook",
      link: "/resources/stem-guide",
      image: "https://cdn-icons-png.flaticon.com/512/4711/4711976.png",
    },
  ];

  // Pricing plans with glassmorphism effect
  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "For individual educators",
      features: ["50 submissions/month", "Basic analytics", "Email support"],
      gradient: "from-purple-600/5 to-blue-500/5",
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      popular: true,
      description: "For teaching teams",
      features: [
        "Unlimited submissions",
        "Advanced analytics",
        "Priority support",
        "Custom rubrics",
      ],
      gradient: "from-pink-600/5 to-rose-500/5",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For institutions",
      features: ["SAML SSO", "API access", "Dedicated support", "Custom SLAs"],
      gradient: "from-green-600/5 to-cyan-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Modern Hero Section with floating elements */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 leading-tight">
                Your Personal AI Tutor Assistant
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Boost your tutoring with personalized insights, and smart tools.
                Focus on what truly matters - inspiring your students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to="/tools/homework-corrections"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:scale-[1.02] transition-transform"
                  >
                    Let's start
                    <FiArrowRight className="ml-3" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:scale-[1.02] transition-transform"
                    >
                      Start Free Trial
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-100 rounded-2xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Educator Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative lg:block">
              <div className="relative rounded-[2.5rem] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg" />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4711/4711981.png"
                  alt="AI Education Platform"
                  className="relative w-full h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educator Challenges Section - Updated with Real Pain Points */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-blue-500 tracking-wide">
              EDUCATOR CHALLENGES
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Top Tutor Pain Points
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiClock className="w-6 h-6" />,
                title: "Manual Grading Marathon",
                description:
                  "Spending 10+ hours weekly assessing handwritten STEM work with complex problem-solving steps",
                solution:
                  "AI that understands multi-step reasoning and provides instant assessment",
              },
              {
                icon: <FiCheck className="w-6 h-6" />,
                title: "Partial Credit Dilemma",
                description:
                  "Struggling to fairly evaluate conceptual understanding when students make small calculation errors",
                solution:
                  "Sophisticated error analysis with step-by-step credit allocation",
              },
              {
                icon: <FiTrendingUp className="w-6 h-6" />,
                title: "Personalization Overload",
                description:
                  "Overwhelmed creating individualized practice materials for diverse learning needs",
                solution:
                  "Automated generation of targeted exercises based on performance gaps",
              },
            ].map((point, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    {point.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {point.title}
                  </h3>
                  <p className="mt-4 text-gray-600">{point.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-blue-500">
                      Our Solution →
                    </p>
                    <p className="mt-2 text-gray-800 font-medium">
                      {point.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section - Improved UI */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-blue-500 tracking-wide">
              PLATFORM FEATURES
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Advanced Teaching Tools
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {
                icon: <FiEdit3 className="w-6 h-6" />,
                title: "AI-Powered Grading System",
                description:
                  "Automated assessment of handwritten STEM work with detailed error analysis and partial credit reasoning",
                gradient: "from-purple-600 to-blue-500",
              },
              {
                icon: <FiBook className="w-6 h-6" />,
                title: "Dynamic Learning Engine",
                description:
                  "Real-time generation of personalized lesson plans and practice problems based on performance insights",
                gradient: "from-pink-600 to-rose-500",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group h-full">
                <div
                  className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-20 blur-sm transition-opacity group-hover:opacity-30`}
                />
                <div className="relative h-full bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <ul className="space-y-4 text-gray-600">
                      {feature.title.includes("Grading") &&
                        [
                          "Handwriting recognition for math/physics",
                          "Step-by-step error analysis",
                          "Automated partial credit allocation",
                          "Consistency across submissions",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <FiCheck className="flex-shrink-0 text-green-500" />
                            {item}
                          </li>
                        ))}
                      {feature.title.includes("Learning") &&
                        [
                          "Real-time performance tracking",
                          "Automated exercise generation",
                          "Competency gap analysis",
                          "Adaptive learning paths",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <FiCheck className="flex-shrink-0 text-green-500" />
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* New Resources Section (Blog & Tutorials) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-blue-500 tracking-wide">
              LEARNING RESOURCES
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Guides & Tutorials
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <article
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                  <img
                    src={resource.image}
                    alt=""
                    className="h-32 w-32 object-contain opacity-90"
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
                  <Link
                    to={resource.link}
                    className="mt-6 inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors"
                  >
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with glass effect */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-blue-500 tracking-wide">
              PRICING
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Flexible Plans for Every Need
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-b ${
                  plan.gradient
                } backdrop-blur-lg rounded-2xl p-px overflow-hidden ${
                  plan.popular ? "shadow-2xl" : "shadow-lg"
                }`}
              >
                <div className="h-full bg-white/95 rounded-[calc(2rem-1px)] p-8">
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500">{plan.period}</span>
                    )}
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <FiCheck className="flex-shrink-0 text-blue-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/pricing"
                    className={`mt-8 inline-flex w-full justify-center items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                      plan.popular
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Transform Your Teaching Today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of educators enhancing their STEM instruction with
            AI-powered tools
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 border-2 border-white/20 rounded-2xl hover:border-white/40 transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/docs"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="hover:text-white transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/webinars"
                    className="hover:text-white transition-colors"
                  >
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              &copy; 2024 EduAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
