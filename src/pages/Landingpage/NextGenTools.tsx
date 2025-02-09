import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiEdit3, FiBook, FiUserCheck } from "react-icons/fi";

export default function NextGenTools() {
  // Data structure for the 3 main tools
  const tools = [
    {
      title: "Exercise Corrections",
      icon: <FiEdit3 className="w-6 h-6" />,
      description: `AI-driven assessment of handwritten solutions with partial credit logic and 
                    step-by-step error analysis to ensure fair, detailed grading.`,
      benefits: [
        "Handwriting recognition for math/physics",
        "Detailed step-by-step error analysis",
        "Automated partial credit allocation",
        "Consistency across submissions",
      ],
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Exercise Forge",
      icon: <FiBook className="w-6 h-6" />,
      description: `Generate new practice exercises on-the-fly, tailored to specific student needs
                    and difficulty levels. Ideal for quickly refreshing materials.`,
      benefits: [
        "Real-time problem generation",
        "Customizable difficulty levels",
        "Variety in question formats",
        "Instantly shareable with students",
      ],
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Personalized Tutoring",
      icon: <FiUserCheck className="w-6 h-6" />,
      description: `Create tailored study plans, track individual progress effortlessly, and
                    provide targeted support for each student's unique learning journey.`,
      benefits: [
        "Adaptive learning paths",
        "Automated progress tracking",
        "Data-driven recommendations",
        "Easy monitoring for tutors",
      ],
      gradient: "from-teal-500 to-green-500",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100 to-blue-100 border border-violet-200/50 text-violet-700 shadow-sm transition-all hover:shadow-md"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            NEXT-GEN TEACHING TOOLS
          </motion.span>
          <h2 className="mt-8 text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent tracking-tight">
            Transformative Education Technology
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our platform addresses critical tutor pain points with innovative AI
            solutions designed for modern, efficient, and personalized STEM
            education.
          </p>
        </motion.div>

        {/* Vertical Stacked Boxes */}
        <div className="space-y-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon in a gradient circle */}
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25`}
                >
                  {tool.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {tool.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {tool.description}
                </p>

                {/* Bullet points */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-3">
                    {tool.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <FiCheck className="flex-shrink-0 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
