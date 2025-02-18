import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export function FAQ() {
  // Remove unused state if not needed
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      icon: BookOpen,
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
      icon: Zap,
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
      icon: Users,
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
      icon: MessageSquare,
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
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pb-10 sm:py-24 pt-28">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0"
            >
              Everything you need to know about our platform
            </motion.p>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mt-16 space-y-12 sm:space-y-20">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              >
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                      <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
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
                      className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-8"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 group-hover:bg-violet-200 transition-colors">
                          <CheckCircle2 className="w-5 h-5" />
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

          <div className="mt-12 sm:mt-20 px-4 sm:px-0">
            <div className="relative rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
              <div className="relative">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Still have questions?
                </h3>
                <p className="text-sm sm:text-base text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto">
                  Our support team is here to help you get the most out of our
                  platform
                </p>
                <button className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors hover:shadow-lg text-sm sm:text-base">
                  Contact Support
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
