//import { useRef } from "react";
import { motion } from "framer-motion";
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
    shortDesc: t(
      "home.educatorChallenges.painPoints.manual.shortDesc",
      "Hours spent manually correcting assignments"
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
    image: PAINPOINT_IMAGES.students, // Group of students
    shortDesc: t(
      "home.educatorChallenges.painPoints.personalization.shortDesc",
      "Creating individual learning paths at scale"
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
    image: PAINPOINT_IMAGES.whiteboard, // Whiteboard with math problem
    shortDesc: t(
      "home.educatorChallenges.painPoints.churn.shortDesc",
      "Too much time creating new content"
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
    image: PAINPOINT_IMAGES.clock, // Clock image
    shortDesc: t(
      "home.educatorChallenges.painPoints.timeConsuming.shortDesc",
      "Hours spent writing detailed correction explanations"
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
    image: PAINPOINT_IMAGES.stressed,
    shortDesc: t(
      "home.educatorChallenges.painPoints.overwhelmingProgress.shortDesc",
      "Monitoring individual student performance"
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
    image: PAINPOINT_IMAGES.papers,
    shortDesc: t(
      "home.educatorChallenges.painPoints.draftingPersonalized.shortDesc",
      "Tailoring assignments to student needs"
    ),
  },
];

interface EducatorChallengesProps {
  onChallengeClick?: (challengeName: string) => void;
}

export default function EducatorChallengesMindMap({
  onChallengeClick,
}: EducatorChallengesProps) {
  const { t } = useTranslation();
  const painPoints = getPainPoints(t);
  //const containerRef = useRef(null);

  const handleChallengeClick = (challengeName: string) => {
    if (onChallengeClick) {
      onChallengeClick(challengeName);
    }
  };

  return (
    <section className="pb-2 pt-16 md:pt-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-6 lg:mb-10">
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
            className="text-center mt-6 mb-6 md:mb-10"
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

        {/* Desktop Layout - Updated to match mobile design pattern */}
        <div className="hidden md:block">
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ delay: index * 0.05 }}
                className="py-2 relative group"
                whileHover={{ x: index % 2 === 0 ? 3 : -3 }}
                onClick={() => handleChallengeClick(point.title)}
              >
                {/* Alternating layout - odd indexes have text left, even have text right */}
                <div
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } items-center gap-10`}
                >
                  {/* Text Container */}
                  <div className="flex-grow max-w-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {point.shortDesc}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-100/80">
                      <p className="text-sm text-gray-500 italic leading-relaxed">
                        <span className="inline-block font-medium text-blue-600">
                          AI-Powered Solution:
                        </span>{" "}
                        {point.solution}
                      </p>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 border border-blue-100/30 shadow group-hover:shadow-md group-hover:border-blue-200/60 transition-all">
                    <img
                      src={point.image}
                      alt=""
                      className="w-20 h-20 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                {/* Divider - except for last item */}
                {index < painPoints.length - 1 && (
                  <div className="w-full border-t border-gray-100/60 mt-6"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Solution Banner - Above new alternating layout */}
        <div className="md:hidden mb-8 text-center ">
          <div className="inline-block px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-100/20">
            <div className="flex items-center justify-center gap-2 mb-2"></div>
            <p className="text-sm md:text-lg text-gray-600">
              {t("home.educatorChallenges.allChallengesBannerSub")}
            </p>
          </div>
        </div>

        {/* Mobile Version - Alternating Layout */}
        <div className="md:hidden mt-6 px-3 space-y-3">
          <div className="bg-white/70 rounded-2xl p-4 shadow-sm border border-gray-100/80">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="py-2 relative group"
                whileHover={{ x: index % 2 === 0 ? 2 : -2 }}
                onClick={() => handleChallengeClick(point.title)}
              >
                {/* Alternating layout - odd indexes have text left, even have text right */}
                <div
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } items-center gap-4`}
                >
                  {/* Text Container - Takes more space */}
                  <div className="flex-grow">
                    <h3 className="text-[16px] font-semibold text-gray-800 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {point.shortDesc}
                    </p>
                  </div>

                  {/* Image Container - Small and contained */}
                  <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-100/30 shadow-sm group-hover:shadow-md group-hover:border-blue-200/60 transition-all">
                    <img
                      src={point.image}
                      alt=""
                      className="w-14 h-14 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                {/* Simple divider line - except for last item */}
                {index < painPoints.length - 1 && (
                  <div className="w-full border-t border-gray-100/50 mt-3"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Section after Alternating Layout */}
        <motion.div className="max-w-2xl mx-auto mt-8 sm:mt-6 px-4">
          <motion.div className="text-center space-y-6">
            <motion.h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("home.educatorChallenges.tiredHeading")}
            </motion.h3>

            <div className="space-y-3">
              <motion.p className="text-gray-600 text-base md:text-lg">
                {t("home.educatorChallenges.p2")}
              </motion.p>
              <motion.p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                {t("home.educatorChallenges.p3")}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
