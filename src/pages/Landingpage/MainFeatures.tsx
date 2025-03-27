import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Define image paths for our features
const FEATURE_IMAGES = {
  grading: "/grading_icon_red_.png",
  exam: "/exam_vis.png",
  camera: "/camera_2.png",
  dashboard: "/dashboard_icon.png",
  rocket: "/rocket_icon.png",
};

const getFeatures = (t: any) => [
  {
    title: t(
      "home.mainFeatures.features.autoGrading.title",
      "Automated Grading"
    ),
    shortDesc: t(
      "home.mainFeatures.features.autoGrading.shortDesc",
      "Snap a photo of handwritten exercise, get instant detailed correction report"
    ),
    image: FEATURE_IMAGES.grading,
  },
  {
    title: t(
      "home.mainFeatures.features.customExercises.title",
      "Custom Exercises"
    ),
    shortDesc: t(
      "home.mainFeatures.features.customExercises.shortDesc",
      "Get customized new exercises based on concepts not well understood or any topic you want - including step by step solution"
    ),
    image: FEATURE_IMAGES.exam,
  },
  {
    title: t(
      "home.mainFeatures.features.videos.title",
      "Tailored Education Videos"
    ),
    shortDesc: t(
      "home.mainFeatures.features.videos.shortDesc",
      "Instantly receive the best online educational videos ready to share for the concepts not well understood by the student"
    ),
    image: FEATURE_IMAGES.camera,
  },
  {
    title: t(
      "home.mainFeatures.features.tracking.title",
      "Student Performance Tracking"
    ),
    shortDesc: t(
      "home.mainFeatures.features.tracking.shortDesc",
      "Automated student performance tracking of all concepts and exercises over time, with overview of strengths and focus areas, ready-to-share report for parents"
    ),
    image: FEATURE_IMAGES.dashboard,
  },
  {
    title: t(
      "home.mainFeatures.features.brainstorm.title",
      "Brainstorm with AI"
    ),
    shortDesc: t(
      "home.mainFeatures.features.brainstorm.shortDesc",
      "RobinA knows everything about the student that you shared - notes, performances, weaknesses, etc. Brainstorm to plan next sessions and improve the student"
    ),
    image: FEATURE_IMAGES.rocket,
  },
];

export default function MainFeatures() {
  const { t } = useTranslation();
  const features = getFeatures(t);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100/80 to-indigo-100/80 border border-blue-200/20 text-blue-700 shadow-sm backdrop-blur-sm hover:backdrop-blur transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            {t("home.mainFeatures.badge", "Tool Features")}
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
              {t("home.mainFeatures.heading", "Main Features")}
            </motion.h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "home.mainFeatures.subtitle",
                "Curious? This is what you will soon be able to do"
              )}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 md:p-8 border border-gray-100 hover:-translate-y-1 duration-300 flex flex-col items-center"
              whileHover={{ y: -5 }}
            >
              {/* Feature Icon - Larger and more prominent */}
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:shadow-md transition-all">
                <img
                  src={feature.image}
                  alt=""
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Feature Content - Centered */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {feature.shortDesc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="/auth"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Try it now
            <svg
              className="ml-2 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
