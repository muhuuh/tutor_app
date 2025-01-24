import React from "react";
import { motion } from "framer-motion";

export function FAQ() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Everything you need to know about our service
            </p>
          </div>

          <div className="mt-24">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {category.category}
                </h2>
                <div className="grid gap-6">
                  {category.questions.map((faq, faqIndex) => (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: faqIndex * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm p-8"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
