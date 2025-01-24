import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiCheck,
  FiArrowRight,
  FiStar,
  FiClock,
  FiBook,
  FiAward,
  FiZap,
  FiTrendingUp,
  FiTarget,
  FiEdit3,
  FiBarChart2,
} from "react-icons/fi";

export function Home() {
  const { user } = useAuth();

  const painPoints = [
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: "Time-Consuming Grading",
      description:
        "Spending hours grading complex STEM problems and determining partial credit, leaving less time for actual teaching.",
      solution:
        "AI-powered grading that understands multi-step problems and reasoning.",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Inconsistent Assessment",
      description:
        "Struggling to maintain grading consistency across multiple students and sessions.",
      solution:
        "Standardized grading criteria with AI assistance for fair evaluation.",
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Personalization Challenges",
      description:
        "Difficulty in identifying individual student weaknesses and creating tailored practice materials.",
      solution:
        "Smart analysis of student work to generate personalized learning paths.",
    },
  ];

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Intelligent Handwriting Analysis",
      description:
        "Our AI accurately grades handwritten STEM assignments, understanding complex equations and multi-step solutions.",
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Partial Credit Recognition",
      description:
        "Sophisticated assessment of student understanding, even with minor errors in complex problem-solving.",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description:
        "Deep insights into student progress with detailed breakdowns of conceptual understanding and skill development.",
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Custom Exercise Generation",
      description:
        "AI-powered creation of targeted practice problems based on identified learning gaps.",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Mathematics Professor",
      content:
        "The partial credit recognition is a game-changer. It accurately assesses student understanding in complex calculus problems, saving me hours of grading time.",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Michael Chen, Ph.D.",
      role: "Physics Instructor",
      content:
        "Finally, a tool that understands multi-step physics problems! The personalized exercise generation helps my students focus on areas where they need the most practice.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Emma Davis, M.Ed.",
      role: "STEM Department Head",
      content:
        "The analytics provide unprecedented insight into student learning patterns. We've seen a 40% improvement in test scores since implementing this system.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      description:
        "Perfect for individual tutors getting started with AI grading",
      features: [
        "Basic handwriting recognition",
        "Simple exercise generation",
        "Limited student analytics",
        "Email support",
        "Up to 50 corrections/month",
      ],
    },
    {
      name: "Professional",
      price: "$24.99",
      period: "/month",
      popular: true,
      description: "Ideal for active tutors and small teaching practices",
      features: [
        "Advanced handwriting analysis",
        "Partial credit recognition",
        "Detailed performance analytics",
        "Custom exercise generation",
        "Priority support",
        "Unlimited corrections",
      ],
    },
    {
      name: "Institution",
      price: "Custom",
      description: "For schools and large educational organizations",
      features: [
        "All Professional features",
        "API access",
        "Custom integrations",
        "Dedicated support team",
        "Advanced reporting",
        "Training sessions",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with modern gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Transform Your Teaching with AI
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Powered by Intelligence
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto lg:mx-0">
                Revolutionize your tutoring with AI-powered grading,
                personalized insights, and smart tools that help you focus on
                what truly matters - inspiring your students.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to="/tools/homework-corrections"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-full shadow-lg hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    Go to Dashboard
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-full shadow-lg hover:bg-indigo-50 transition-all duration-200 group"
                    >
                      Get Started Free
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/auth"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/20 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Teacher using laptop"
                className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points Section - New */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Challenges We Solve
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Common Teaching Frustrations
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We understand the daily challenges educators face
            </p>
          </div>

          <div className="mt-20 grid lg:grid-cols-3 gap-8">
            {painPoints.map((point, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600">
                    {point.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {point.title}
                  </h3>
                  <p className="mt-4 text-gray-500">{point.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-indigo-600 font-medium">Our Solution:</p>
                    <p className="mt-2 text-gray-600">{point.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with modern cards */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Everything you need to excel
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Powerful tools designed to make teaching more effective and
              enjoyable.
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full p-8 bg-white rounded-3xl shadow-lg group-hover:translate-y-[-4px] transition-transform duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-white group-hover:text-indigo-500 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-gray-500 group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials with modern design */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Loved by educators worldwide
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="pt-8">
                  <p className="text-gray-600 italic">{testimonial.content}</p>
                  <div className="mt-6">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-indigo-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section with modern cards */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Choose your perfect plan
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple, transparent pricing that grows with you
            </p>
          </div>

          <div className="mt-20 grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-indigo-600 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-gray-500">{plan.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="ml-1 text-2xl text-gray-500">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FiCheck className="flex-shrink-0 w-5 h-5 text-indigo-500" />
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth"
                    className={`mt-8 block w-full px-6 py-4 text-center font-medium rounded-2xl transition-all duration-200 ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section with gradient background */}
      <div className="relative py-24 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-200 tracking-wide uppercase">
              Contact
            </h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to get started?
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-100">
              Join thousands of educators already transforming their teaching
              with TutorAI.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-full shadow-lg hover:bg-indigo-50 transition-all duration-200 group"
            >
              Contact Us
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-300 hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 TutorAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
