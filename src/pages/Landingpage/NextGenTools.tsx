import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiEdit3, FiBook, FiUserCheck } from "react-icons/fi";

export default function NextGenTools() {
  // Data structure for the 3 main tools
  const tools = [
    {
      title: "Exercise Corrections",
      icon: <FiEdit3 className="w-6 h-6" />,
      description: `Save hours of grading time - just snap a photo of any handwritten work and get 
                    complete correction reports in seconds. No more wrestling with partial credits or 
                    writing detailed explanations - our AI handles it all, providing fair grades with 
                    clear reasoning. Best of all, it automatically identifies knowledge gaps, finds 
                    relevant teaching resources, and creates practice exercises, so you can focus on 
                    what matters: helping your students improve.`,
      benefits: [
        "Grade any handwritten work in seconds, not hours",
        "Get fair partial credit with explained reasoning",
        "Receive instant concept mastery analysis",
        "Access auto-curated and exactly fitting learning resources and videos",
        "Generate targeted practice exercises",
        "Track recurring misconceptions across assignments",
      ],
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Personalized Tutoring",
      icon: <FiUserCheck className="w-6 h-6" />,
      description: `See exactly how your students are performing with our smart dashboard that does the 
                    heavy lifting for you. Instantly spot when a student starts struggling with a concept, 
                    celebrate their improvements, and get AI-suggested study plans tailored to each student. 
                    No more guesswork - know exactly which topics need attention and get ready-made materials 
                    to help your students succeed. Plus, consult our AI anytime about specific students - 
                    it knows their complete learning history and can provide personalized insights and 
                    recommendations on demand.`,
      benefits: [
        "Save hours with performance summaries over all concepts and progress reports",
        "Get instant access to materials and exercises exactly matching to student needs",
        "Track improvement across all concepts and students with easy-to-read visual timelines",
        "Share detailed progress updates with parents",
        "Get instant alerts when performances drop in specific topics",
        "Discuss any student with AI for personalized guidance and recommendations",
      ],
      gradient: "from-teal-500 to-green-500",
    },
    {
      title: "Exercise Forge",
      icon: <FiBook className="w-6 h-6" />,
      description: `Create perfect practice materials in minutes. Upload existing exams for instant 
                    variations, or brainstorm with our AI to design custom exercises that match your 
                    exact teaching goals. Every exercise comes with detailed step-by-step solutions 
                    and customizable hints, giving you everything needed to support student learning. 
                    Save hours of prep time while delivering perfectly tailored content.`,
      benefits: [
        "Generate variations of existing exams instantly",
        "Design custom exercises through AI collaboration",
        "Get complete solutions and student hints",
        "Adjust difficulty levels to match student needs",
        "Create entire practice sets in minutes",
        "Share materials with detailed guidance",
      ],
      gradient: "from-pink-500 to-rose-500",
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
          <p className="mt-4 text-xl text-gray-600/90 max-w-2xl mx-auto">
            Imagine being able to spend most of your time on what truly matters:
            helping your students thrive.
          </p>

          <p className="mt-4 text-lg text-gray-600/90 max-w-2xl mx-auto">
            Our AI-powered tools create detailed student reports in seconds,
            providing insights into concept mastery, personalized learning
            resources, and tailored study plans - everything you need to
            maximize your impact.
          </p>

          <p className="mt-4 text-lg text-gray-600/90 max-w-2xl mx-auto">
            Track progress over time, identify focus areas, and automatically
            generate targeted practice materials. Let technology handle the
            routine tasks while you focus on what matters most - inspiring and
            guiding your students.
          </p>
        </motion.div>

        <motion.h3
          className="text-center text-2xl font-semibold mt-16 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Our Suite of Tools
        </motion.h3>
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
