import { motion } from "framer-motion";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const TOOLS_IMAGES = {
  lightBulb: "/bulb_icon.png",
  dashboard: "/dashboard_icon.png",
  mathPaper: "/exam_vis.png",
};

interface NextGenToolsProps {
  onToolClick?: (toolName: string) => void;
}

export default function NextGenTools({ onToolClick }: NextGenToolsProps) {
  const { t } = useTranslation();

  // Function to scroll to Guides & Tutorials section
  const scrollToGuides = () => {
    const guidesSection = document.querySelector("#guides-tutorials");
    if (guidesSection) {
      guidesSection.scrollIntoView({ behavior: "smooth" });

      // Track the scroll to guides click
      if (onToolClick) {
        onToolClick("scroll_to_guides");
      }
    }
  };

  const handleToolClick = (toolName: string) => {
    if (onToolClick) {
      onToolClick(toolName);
    }
  };

  const tools = [
    {
      title: t("home.nextGenTools.tools.exerciseCorrections.title"),
      icon: TOOLS_IMAGES.lightBulb,
      description: t("home.nextGenTools.tools.exerciseCorrections.description"),
      longDescription: t(
        "home.nextGenTools.tools.exerciseCorrections.longDescription"
      ),
      benefits: t("home.nextGenTools.tools.exerciseCorrections.benefits", {
        returnObjects: true,
      }) as string[],
      accent: "blue",
    },
    {
      title: t("home.nextGenTools.tools.personalizedTutoring.title"),
      icon: TOOLS_IMAGES.dashboard,
      description: t(
        "home.nextGenTools.tools.personalizedTutoring.description"
      ),
      longDescription: t(
        "home.nextGenTools.tools.personalizedTutoring.longDescription"
      ),
      benefits: t("home.nextGenTools.tools.personalizedTutoring.benefits", {
        returnObjects: true,
      }) as string[],
      accent: "violet",
    },
    {
      title: t("home.nextGenTools.tools.exerciseForge.title"),
      icon: TOOLS_IMAGES.mathPaper,
      description: t("home.nextGenTools.tools.exerciseForge.description"),
      longDescription: t(
        "home.nextGenTools.tools.exerciseForge.longDescription"
      ),
      benefits: t("home.nextGenTools.tools.exerciseForge.benefits", {
        returnObjects: true,
      }) as string[],
      accent: "rose",
    },
  ];

  return (
    <section className="pb-8 pt-12 md:py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header - Styled to match screenshot */}
        <div className="text-center mb-6 lg:mb-10">
          {/* Purple badge */}
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100/80 to-blue-100/80 border border-violet-200/20 text-violet-700 shadow-sm backdrop-blur-sm hover:backdrop-blur transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            {t("home.nextGenTools.badge")}
          </motion.span>

          {/* Title with gradient - Matching screenshot styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-6 mb-6 md:mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent pb-1">
                {t("home.nextGenTools.title")}
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 pb-1">
                {t("home.nextGenTools.title2")}
              </span>
            </h2>
          </motion.div>

          {/* Subtitle with highlighted text like in screenshot */}
          <div className="inline-block px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-100/20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-lg"
            >
              {t("home.nextGenTools.subtitle")}
              <span className="block text-base  md:text-lg pb-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("home.nextGenTools.subtitle2")}
              </span>
            </motion.p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-16 pb-8 grid gap-6 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-white rounded-2xl p-6 pb-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              onClick={() => handleToolClick(tool.title)}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Title first */}
                <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-3">
                  {tool.title}
                </h3>

                {/* Icon and subtitle side by side */}
                <div className="flex items-center gap-4">
                  {/* Image container */}
                  <div className="flex-shrink-0 w-18 h-18 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 border border-blue-100/30 shadow">
                    <img
                      src={tool.icon}
                      alt=""
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  {/* Description/subtitle */}
                  <p className="text-gray-600 flex-1">{tool.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex-1 flex flex-col">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tool.longDescription}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {tool.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-gray-600 text-sm"
                      >
                        <FiCheck className="mt-1 flex-shrink-0 text-green-500" />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Learn More button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent div's onClick
                      scrollToGuides();
                    }}
                    className="mt-auto pt-8 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
                    whileHover={{ x: 4 }}
                  >
                    {t("home.nextGenTools.learnMoreBtn")}
                    <FiArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
