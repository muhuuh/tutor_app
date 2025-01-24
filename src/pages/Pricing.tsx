import React from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiHelpCircle } from "react-icons/fi";

export function Pricing() {
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

  const faqs = [
    {
      question: "How does the correction limit work?",
      answer:
        "The Basic plan includes 50 homework corrections per month. Each submission counts as one correction. Unused corrections don't roll over to the next month.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
      question: "What's included in the Institution plan?",
      answer:
        "The Institution plan is customized to your organization's needs. It includes everything in Professional, plus custom integrations, dedicated support, and special training for your staff.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Choose the plan that's right for you
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${
                  plan.popular ? "ring-2 ring-indigo-600" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-sm text-gray-500">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-base font-medium text-gray-500">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiCheck className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`mt-8 block w-full px-6 py-4 text-center font-medium rounded-lg ${
                    plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  } transition-colors duration-200`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Frequently asked questions
            </h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {faq.question}
                    <FiHelpCircle className="text-gray-400" />
                  </h3>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
