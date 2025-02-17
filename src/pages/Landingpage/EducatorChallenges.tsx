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

const painPoints = [
  {
    title: "Manual Grading Marathon",
    solution: "Expert instant assessment for complex problem-solving",
  },
  {
    title: "Partial Credit Dilemma",
    solution: "Step-by-step error analysis with intelligent credit allocation",
  },
  {
    title: "Personalization Overload",
    solution: "Automated personalized learning paths based on performance",
  },
  {
    title: "Churn to Create New Exercises",
    solution: "Automated generation of targeted practice materials",
  },
  {
    title: "Time-Consuming Drafting of Corrections",
    solution: "Complete step-by-step correction and hints to help students",
  },
  {
    title: "Overwhelming Progress Tracking",
    solution:
      "Real-time analytics dashboard with performance insights for each student",
  },
  {
    title: "Drafting Personalized Plans",
    solution: "Smart learning path generator based on student gaps",
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
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12 lg:mb-20">
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100/80 to-blue-100/80 border border-violet-200/20 text-violet-700 shadow-sm backdrop-blur-sm hover:backdrop-blur transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            EDUCATOR CHALLENGES
          </motion.span>
          <motion.h2
            className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Transforming Teaching Challenges
          </motion.h2>
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
                      className={`relative transition-all duration-300 h-[360px] ${
                        isSelected
                          ? "scale-100 opacity-100"
                          : "scale-90 opacity-50"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Card Container */}
                      <div className="h-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden ring-1 ring-purple-100/20">
                        {/* Card Header - Adjusted for title overflow */}
                        <div className="relative h-24 bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                          <div className="absolute inset-0 bg-white/40" />
                          <div className="relative flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                              {getIconForTitle(point.title)}
                            </div>
                            <h3 className="font-bold text-lg bg-gradient-to-br from-blue-700 to-purple-700 bg-clip-text text-transparent line-clamp-2">
                              {point.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Content - Optimized spacing */}
                        <div className="p-6 flex flex-col h-[calc(100%-6rem)]">
                          {/* AI Solution Badge */}
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                              </span>
                              AI-Powered Solution
                            </span>
                          </div>

                          {/* Solution Content */}
                          <div className="relative rounded-xl p-5 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] flex-1">
                            <div className="absolute inset-0 bg-blue-500/[0.01] rounded-xl border border-purple-100/30" />
                            <div className="relative">
                              <p className="text-gray-600 leading-relaxed text-base">
                                {point.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Dots - Updated style */}
          <div className="flex justify-center gap-2 mt-8">
            {painPoints.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                    : "w-2 bg-gray-200"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
        <motion.div className="max-w-2xl mx-auto">
          <motion.h3
            className="text-center text-2xl md:text-3xl font-bold mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tired of these challenges?
          </motion.h3>
          <motion.p
            className="text-center text-gray-600/90 mt-8 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The biggest pain points for educators revolve around time-consuming
            grading and providing personalized support for each student.
          </motion.p>
          <motion.p
            className="text-center text-gray-600/90 mt-4 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            The more individualized attention you can provide to each student,
            the better their chances of thriving. This is what makes being an
            educator so fulfilling - contributing to the success of each of your
            protégés.
          </motion.p>

          <motion.p
            className="text-center text-xl font-semibold mt-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            We are here to help you with that.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
