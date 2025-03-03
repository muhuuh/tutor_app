import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("terms.title")}
          </motion.h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600">{t("terms.lastUpdated")}</p>

            {/* EU Data Protection Section */}
            <h2>{t("terms.sections.euDataProtection.heading")}</h2>
            {(
              t("terms.sections.euDataProtection.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 1 */}
            <h2>{t("terms.sections.section1.heading")}</h2>
            {(
              t("terms.sections.section1.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 2 */}
            <h2>{t("terms.sections.section2.heading")}</h2>
            {(
              t("terms.sections.section2.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 3 */}
            <h2>{t("terms.sections.section3.heading")}</h2>
            {(
              t("terms.sections.section3.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 4 */}
            <h2>{t("terms.sections.section4.heading")}</h2>
            {(
              t("terms.sections.section4.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 5 */}
            <h2>{t("terms.sections.section5.heading")}</h2>
            {(
              t("terms.sections.section5.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 6 */}
            <h2>{t("terms.sections.section6.heading")}</h2>
            {(
              t("terms.sections.section6.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 7 */}
            <h2>{t("terms.sections.section7.heading")}</h2>
            {(
              t("terms.sections.section7.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* AI Disclaimer */}
            <h2>{t("terms.sections.aiDisclaimer.heading")}</h2>
            {(
              t("terms.sections.aiDisclaimer.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 8 */}
            <h2>{t("terms.sections.section8.heading")}</h2>
            {(
              t("terms.sections.section8.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 9 */}
            <h2>{t("terms.sections.section9.heading")}</h2>
            {(
              t("terms.sections.section9.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Section 10 */}
            <h2>{t("terms.sections.section10.heading")}</h2>
            {(
              t("terms.sections.section10.paragraphs", {
                returnObjects: true,
              }) as string[]
            ).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
