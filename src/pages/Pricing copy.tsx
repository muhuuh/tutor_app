import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Zap,
  Building2,
  CheckCircle2,
  Gift,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function Pricing() {
  const [billingInterval, setBillingInterval] = useState("monthly");
  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: "$9.99",
      yearlyPrice: "$7.99",
      period: "/month",
      description:
        "Perfect for individual tutors getting started with AI grading",
      icon: Package,
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
      monthlyPrice: "$24.99",
      yearlyPrice: "$19.99",
      period: "/month",
      popular: true,
      icon: Zap,
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
      icon: Building2,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-sky-800 py-32">
        <div className="absolute inset-0 animate-gradient-pulse opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent sm:text-5xl lg:text-6xl"
          >
            AI-Powered Tutoring Evolution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Transform student assessments with real-time AI grading and
            intelligent exercise generation
          </motion.p>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center mt-12">
        <div className="bg-gray-100 p-2 rounded-xl flex gap-2">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              billingInterval === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              billingInterval === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Yearly <span className="text-violet-600">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Free Trial Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="lg:flex items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl shadow-lg animate-pulse-slow">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  7-Day Free Trial
                </h3>
                <p className="text-gray-600 mt-2 max-w-md">
                  Experience full platform capabilities risk-free
                </p>
              </div>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 bg-violet-600 rounded-xl hover:bg-blue-600 hover:gap-3 hover:shadow-lg hover:scale-105"
            >
              Start Free Trial
              <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Pricing Cards Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-8 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all ${
                  plan.popular ? "ring-2 ring-blue-500 ring-offset-4" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-bold uppercase bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-gray-600 text-lg">{plan.description}</p>

                  <div className="mt-6">
                    <div className="text-5xl font-black bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                      {plan.price ||
                        (billingInterval === "monthly"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice)}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-blue-600 font-semibold">
                        Includes:
                      </span>
                      <span className="text-gray-500">
                        AI Grading • Analytics • Support
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Sparkles className="w-5 h-5 text-violet-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 hover:shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
