import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ComponentType } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface CategoryItem {
  category: string;
  icon: ComponentType<{ className?: string }>;
  questions: FAQItem[];
}

export function FAQ() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Remove unused state if not needed
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Use translations for FAQ categories
  const faqs: CategoryItem[] = [
    {
      category: t("faq.categories.gettingStarted.title"),
      icon: BookOpen,
      questions: t("faq.categories.gettingStarted.faqs", {
        returnObjects: true,
      }) as FAQItem[],
    },
    {
      category: t("faq.categories.features.title"),
      icon: Zap,
      questions: t("faq.categories.features.faqs", {
        returnObjects: true,
      }) as FAQItem[],
    },
    {
      category: t("faq.categories.pricing.title"),
      icon: Users,
      questions: t("faq.categories.pricing.faqs", {
        returnObjects: true,
      }) as FAQItem[],
    },
    {
      category: t("faq.categories.technicalSupport.title"),
      icon: MessageSquare,
      questions: t("faq.categories.technicalSupport.faqs", {
        returnObjects: true,
      }) as FAQItem[],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pb-10 sm:pt-32 sm:pb-16 pt-28">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white"
            >
              {t("faq.heading")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {t("faq.subtitle")}
            </motion.p>
          </div>
        </div>
      </div>

      <section className="py-4 sm:pb-24">
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
              <div className="relative text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  {t("faq.contactSupport.heading")}
                </h3>
                <p className="text-sm sm:text-base text-gray-200 mb-6 sm:mb-8">
                  {t("faq.contactSupport.description")}
                </p>
                <button
                  onClick={() => navigate("/company/contact")}
                  className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors hover:shadow-lg text-sm sm:text-base"
                >
                  {t("faq.contactSupport.button")}
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
