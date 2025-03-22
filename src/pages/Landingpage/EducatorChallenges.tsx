import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiArrowUpRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";

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
  },
  {
    title: t(
      "home.educatorChallenges.painPoints.partialCredit.title",
      "Partial Credit Dilemma"
    ),
    solution: t(
      "home.educatorChallenges.painPoints.partialCredit.solution",
      "Step-by-step error analysis with intelligent credit allocation"
    ),
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

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      startIndex: 1,
    },
    [AutoPlay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
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

        {/* AI Solution Banner - Above carousel */}
        <div className="md:hidden mb-8 text-center ">
          <div className="inline-block px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-100/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-700">
                {t("home.educatorChallenges.allChallengesBanner")}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {t("home.educatorChallenges.allChallengesBannerSub")}
            </p>
          </div>
        </div>

        {/* Updated Mobile Version - Modern Carousel */}
        <div className="md:hidden relative px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {painPoints.map((point, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <div
                    key={index}
                    className="flex-[0_0_85%] min-w-0 relative pl-4"
                  >
                    <motion.div
                      className={`relative transition-all duration-300 ${
                        isSelected
                          ? "scale-100 opacity-100"
                          : "scale-90 opacity-50"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Card Container */}
                      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
                        {/* Card Header */}
                        <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-600">
                              {getIconForTitle(point.title)}
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {point.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                          <div className="prose prose-sm">
                            <p className="text-gray-600 leading-relaxed">
                              {point.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Improved Carousel Navigation */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Dots */}
            <div className="flex justify-center gap-2">
              {painPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? "w-6 bg-gradient-to-r from-blue-500 to-purple-500"
                      : "w-1.5 bg-gray-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Current/Total Indicator */}
            <div className="text-sm text-gray-500">
              <span className="font-medium text-blue-600">
                {selectedIndex + 1}
              </span>
              <span className="mx-1">/</span>
              <span>{painPoints.length}</span>
            </div>
          </div>
        </div>

        {/* Text Section after Carousel */}
        <motion.div className="max-w-2xl mx-auto mt-10 sm:mt-8 px-4">
          <motion.div className="text-center space-y-8">
            <motion.h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("home.educatorChallenges.tiredHeading")}
            </motion.h3>

            <div className="space-y-4">
              <motion.p className="text-gray-600 text-lg">
                {t("home.educatorChallenges.p1")}
              </motion.p>
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
