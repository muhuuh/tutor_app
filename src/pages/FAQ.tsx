import React, { useState } from "react";
import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiArrowRight,
  FiBook,
  FiZap,
  FiUsers,
  FiHelpCircle,
} from "react-icons/fi";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does the correction limit work",
          answer:
            "The Basic plan includes 50 homework corrections per month. Each submission counts as one correction. Unused corrections don't roll over to the next month.",
        },
        {
          question: "Can I upgrade or downgrade my plan",
          answer:
            "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.",
        },
      ],
    },
    {
      category: "Features & Capabilities",
      questions: [
        {
          question: "What types of assignments can be graded",
          answer:
            "Our AI can grade a wide range of STEM assignments, including mathematics, physics, and chemistry. It handles both numerical problems and step-by-step solutions.",
        },
        {
          question: "How accurate is the handwriting recognition",
          answer:
            "Our advanced AI achieves over 95% accuracy in recognizing handwritten mathematical expressions and text, especially when the writing is reasonably clear.",
        },
      ],
    },
    {
      category: "Pricing",
      questions: [
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
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What support is included in each plan",
          answer:
            "Basic plans include email support with 24-hour response time. Professional plans include priority support with 4-hour response time. Institution plans get dedicated support teams.",
        },
        {
          question: "What's included in the Institution plan",
          answer:
            "The Institution plan is customized to your organization's needs. It includes everything in Professional, plus custom integrations, dedicated support, and special training for your staff.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with violet background */}
      <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto"
            >
              Everything you need to know about our platform
            </motion.p>
          </div>
        </div>
      </div>

      {/* Rest of the FAQ content */}
      <section className="pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FAQ Content */}
          <div className="mt-16 space-y-20">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-12">
                  <div className="inline-flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      <FiHelpCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {category.category}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {category.questions.map((faq, faqIndex) => (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: faqIndex * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                          <FiCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                          <p className="mt-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-200 mb-8 max-w-xl mx-auto">
                Our support team is here to help you get the most out of our
                platform
              </p>
              <button className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Contact Support
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
