import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const painPoints = [
  {
    title: "Manual Grading Marathon",
    solution: "AI-powered instant assessment for complex problem-solving",
  },
  {
    title: "Partial Credit Dilemma",
    solution: "Step-by-step error analysis with intelligent credit allocation",
  },
  {
    title: "Personalization Overload",
    solution: "Automated generation of targeted practice materials",
  },
  {
    title: "Churn to Create New Exercises",
    solution: "Dynamic question bank with adaptive difficulty levels",
  },
  {
    title: "Time-Consuming Drafting of Corrections",
    solution: "AI-generated personalized feedback templates",
  },
  {
    title: "Overwhelming Progress Tracking",
    solution: "Real-time analytics dashboard with performance insights",
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

export default function EducatorChallengesMindMap() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px" });
  const containerWidth = 800;
  const containerHeight = 600;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = 220;

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

        {/* Mind Map Container */}
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
                className="group absolute w-[140px] h-[140px]"
                style={{ left, top }}
                variants={bubbleVariants}
                custom={index}
                initial="initial"
                animate={isInView && "animate"}
                whileHover="hover"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100/80 to-purple-100/80 backdrop-blur-lg border-2 border-white/20 shadow-lg transition-all duration-300 group-hover:shadow-xl" />

                <div className="relative h-full p-4 flex flex-col justify-center items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                  <motion.div
                    className="relative z-10 text-gray-800/90 font-medium text-sm leading-tight"
                    initial={{ opacity: 1, y: 0 }}
                    whileHover={{ opacity: 0.8, y: -10 }}
                  >
                    {point.title}
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 translate-y-0 group-hover:translate-y-2 transition-all duration-300"
                    initial={{ opacity: 0 }}
                  >
                    <p className="text-xs font-medium text-blue-600/90">
                      <FiArrowUpRight className="inline-block mb-[2px]" />{" "}
                      Solution
                    </p>
                    <div className="text-xs text-gray-700/90 mt-1">
                      {point.solution}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
