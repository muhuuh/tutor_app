import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Define image paths for our painpoints
const PAINPOINT_IMAGES = {
  clock: "/clock_icon.png", // Time image
  students: "/group_of_people.png", // Group of students image
  papers: "/pile_paper.png", // Pile of papers image
  stressed: "/teacher_icon.png", // Stressed person image
  whiteboard: "/whiteboard_icon.png", // Whiteboard with math problem image
  grading: "/grading_icon.png", // Grading icon image
};

const getPainPoints = (t: any) => [
  {
    title: t(
      "home.educatorChallenges.painPoints.manual.title",
      "Manual Grading Marathon"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.manual.solution",
      "Expert instant assessment for complex problem-solving"
    ),
    image: PAINPOINT_IMAGES.grading, // Pile of papers
    shortDesc: "Hours spent manually correcting assignments",
  },

  {
    title: t(
      "home.educatorChallenges.painPoints.personalization.title",
      "Personalization Overload"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.personalization.solution",
      "Automated personalized learning paths based on performance"
    ),
    image: PAINPOINT_IMAGES.students, // Group of students
    shortDesc: "Creating individual learning paths at scale",
  },
  {
    title: t(
      "home.educatorChallenges.painPoints.churn.title",
      "Churn to Create New Exercises"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.churn.solution",
      "Automated generation of targeted practice materials"
    ),
    image: PAINPOINT_IMAGES.whiteboard, // Whiteboard with math problem
    shortDesc: "Too much time creating new content",
  },
  {
    title: t(
      "home.educatorChallenges.painPoints.timeConsuming.title",
      "Time-Consuming Drafting of Corrections"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.timeConsuming.solution",
      "Complete step-by-step correction and hints to help students"
    ),
    image: PAINPOINT_IMAGES.clock, // Clock image
    shortDesc: "Writing detailed correction explanations",
  },
  {
    title: t(
      "home.educatorChallenges.painPoints.overwhelmingProgress.title",
      "Overwhelming Progress Tracking"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.overwhelmingProgress.solution",
      "Real-time analytics dashboard with performance insights for each student"
    ),
    image: PAINPOINT_IMAGES.stressed,
    shortDesc: "Monitoring individual student performance",
  },
  {
    title: t(
      "home.educatorChallenges.painPoints.draftingPersonalized.title",
      "Drafting Personalized Plans"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.draftingPersonalized.solution",
      "Smart learning path generator based on student gaps"
    ),
    image: PAINPOINT_IMAGES.papers,
    shortDesc: "Tailoring assignments to student needs",
  },
];

const bubbleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.1,
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  }),
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 },
  },
};

const getPosition = (index: number, total: number, radius: number) => {
  const angle = (index * (2 * Math.PI)) / total - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

/*
const getIconForTitle = (title: string) => {
  switch (title) {
    case "Manual Grading Marathon":
      return <FiEdit3 className="w-6 h-6" />;
    case "Partial Credit Dilemma":
      return <FiTarget className="w-6 h-6" />;
    case "Personalization Overload":
      return <FiUsers className="w-6 h-6" />;
    case "Churn to Create New Exercises":
      return <FiBookOpen className="w-6 h-6" />;
    case "Time-Consuming Drafting of Corrections":
      return <FiClock className="w-6 h-6" />;
    case "Overwhelming Progress Tracking":
      return <FiBarChart2 className="w-6 h-6" />;
    case "Drafting Personalized Plans":
      return <FiAward className="w-6 h-6" />;
    default:
      return <FiTarget className="w-6 h-6" />;
  }
};
*/
export default function EducatorChallengesMindMap() {
  const { t } = useTranslation();
  const painPoints = getPainPoints(t);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px" });
  const containerWidth = 800;
  const containerHeight = 600;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = 220;

  return (
    <section className="py-10 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-8 lg:mb-16 ">
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100/80 to-blue-100/80 border border-violet-200/20 text-violet-700 shadow-sm backdrop-blur-sm hover:backdrop-blur transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            {t("home.educatorChallenges.badge")}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 mb-8 md:mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t("home.educatorChallenges.heading")}
            </motion.h2>
          </motion.div>
        </div>

        {/* Desktop Mind Map Container */}
        <div className="hidden md:block">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center mx-auto"
            style={{ width: containerWidth, height: containerHeight }}
          >
            {/* Central Bubble */}
            <motion.div
              className="absolute rounded-full shadow-2xl flex flex-col items-center justify-center p-8"
              style={{
                left: centerX - 90,
                top: centerY - 90,
                width: 180,
                height: 180,
              }}
              initial={{ scale: 0 }}
              animate={isInView && { scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Gradient blur effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse" />

              {/* Content container */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl" />

                {/* Centered content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100">
                    Pain Points
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Pain Point Bubbles */}
            {painPoints.map((point, index) => {
              const pos = getPosition(index, painPoints.length, radius);
              const left = centerX + pos.x - 140 / 2;
              const top = centerY + pos.y - 140 / 2;

              return (
                <motion.div
                  key={index}
                  className="group absolute w-[140px] h-[140px] overflow-visible"
                  style={{ left, top }}
                  variants={bubbleVariants}
                  custom={index}
                  initial="initial"
                  animate={isInView && "animate"}
                  whileHover="hover"
                >
                  {/* Bubble background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100/80 to-purple-100/80 backdrop-blur-lg border-2 border-white/20 shadow-lg" />

                  <div className="relative h-full p-4 flex flex-col justify-center items-center text-center overflow-visible">
                    {/* Animated overlay */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />

                    {/* Title */}
                    <motion.div
                      className="relative z-10 text-gray-800/90 font-medium text-sm leading-tight"
                      initial={{ y: 0 }}
                      whileHover={{ y: -10 }}
                    >
                      {point.title}
                    </motion.div>

                    {/* Solution Card */}
                    <motion.div
                      className="absolute -top-2 left-1/2 z-20 w-[160px]"
                      style={{ x: "-50%" }}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileHover={{
                        opacity: 1,
                        y: -10,
                        scale: 1,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                    >
                      <div className="bg-gradient-to-br from-blue-50/95 to-purple-50/95 backdrop-blur-xl rounded-xl p-3 shadow-2xl shadow-purple-500/20 border-2 border-white/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <motion.div
                            className="shrink-0 text-blue-500"
                            whileHover={{ rotate: 45 }}
                          >
                            <FiArrowUpRight className="w-4 h-4" />
                          </motion.div>
                          <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI-Powered Solution
                          </span>
                        </div>
                        <p className="text-xs text-gray-700/90 leading-tight font-medium">
                          {point.solution}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Solution Banner - Above new alternating layout */}
        <div className="md:hidden mb-8 text-center ">
          <div className="inline-block px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-100/20">
            <div className="flex items-center justify-center gap-2 mb-2"></div>
            <p className="text-xs text-gray-600">
              {t("home.educatorChallenges.allChallengesBannerSub")}
            </p>
          </div>
        </div>

        {/* NEW Mobile Version - Alternating Layout */}
        <div className="md:hidden mt-10 px-3 space-y-5">
          <div className="bg-white/70 rounded-2xl p-5 shadow-sm border border-gray-100/80">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="py-3 relative group"
                whileHover={{ x: index % 2 === 0 ? 2 : -2 }}
              >
                {/* Alternating layout - odd indexes have text left, even have text right */}
                <div
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } items-center gap-5`}
                >
                  {/* Text Container - Takes more space */}
                  <div className="flex-grow">
                    <h3 className="text-[16px] font-semibold text-gray-800 mb-1.5 leading-tight group-hover:text-blue-700 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {point.shortDesc}
                    </p>
                  </div>

                  {/* Image Container - Small and contained */}
                  <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-100/30 shadow-sm group-hover:shadow-md group-hover:border-blue-200/60 transition-all">
                    <img
                      src={point.image}
                      alt=""
                      className="w-16 h-16 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                {/* Simple divider line - except for last item */}
                {index < painPoints.length - 1 && (
                  <div className="w-full border-t border-gray-100 mt-5"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Section after Alternating Layout */}
        <motion.div className="max-w-2xl mx-auto mt-10 sm:mt-8 px-4">
          <motion.div className="text-center space-y-8">
            <motion.h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("home.educatorChallenges.tiredHeading")}
            </motion.h3>

            <div className="space-y-4">
              <motion.p className="text-gray-600 text-lg">
                {t("home.educatorChallenges.p2")}
              </motion.p>
              <motion.p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-4">
                {t("home.educatorChallenges.p3")}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
