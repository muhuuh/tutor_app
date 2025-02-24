import { motion } from "framer-motion";
import {
  FiCheck,
  FiEdit3,
  FiBook,
  FiUserCheck,
  FiArrowRight,
} from "react-icons/fi";

export default function NextGenTools() {
  // Function to scroll to Guides & Tutorials section
  const scrollToGuides = () => {
    const guidesSection = document.querySelector("#guides-tutorials");
    if (guidesSection) {
      guidesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tools = [
    {
      title: "Exercise Corrections",
      icon: <FiEdit3 className="w-6 h-6" />,
      description: `Save hours of grading time - just snap a photo of any handwritten work and get 
                    complete correction reports in seconds.`,
      longDescription: `No more wrestling with partial credits or writing detailed explanations - our AI handles it all, 
                       providing fair grades with clear reasoning. Best of all, it automatically identifies knowledge gaps, 
                       finds relevant teaching resources, and creates practice exercises.`,
      benefits: [
        "Grade any handwritten work in seconds, not hours",
        "Get fair partial credit with explained reasoning",
        "Receive instant concept mastery analysis",
        "Access auto-curated learning resources",
        "Generate targeted practice exercises",
        "Track recurring misconceptions",
      ],
      accent: "blue",
    },
    {
      title: "Personalized Tutoring",
      icon: <FiUserCheck className="w-6 h-6" />,
      description: `See exactly how your students are performing with our smart dashboard that does the heavy lifting for you.`,
      longDescription: `Instantly spot when a student starts struggling with a concept, celebrate their improvements, 
                       and get AI-suggested study plans tailored to each student. No more guesswork - know exactly which 
                       topics need attention and get ready-made materials to help your students succeed.`,
      benefits: [
        "Performance summaries over all concepts",
        "Access to matching learning materials",
        "Track improvement with visual timelines",
        "Share detailed progress updates",
        "Get instant performance alerts",
        "AI-powered personalized guidance",
      ],
      accent: "violet",
    },
    {
      title: "Exercise Forge",
      icon: <FiBook className="w-6 h-6" />,
      description: `Create perfect practice materials in minutes. Upload existing exams for instant variations.`,
      longDescription: `Brainstorm with our AI to design custom exercises that match your exact teaching goals. 
                       Every exercise comes with detailed step-by-step solutions and customizable hints, giving you 
                       everything needed to support student learning.`,
      benefits: [
        "Generate exam variations instantly",
        "Design custom exercises with AI",
        "Get complete solutions and hints",
        "Adjust difficulty levels easily",
        "Create practice sets in minutes",
        "Share guided materials",
      ],
      accent: "rose",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-violet-100/80 to-blue-100/80 border border-violet-200/20 text-violet-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            NEXT-GEN TEACHING TOOLS
          </motion.span>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent pb-1">
            Transformative Education
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 pb-1">
              Technology
            </span>
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Imagine being able to spend most of your time on what truly matters:
            helping your students thrive.
          </p>
        </motion.div>

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
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Icon container - consistent styling */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600">
                  {tool.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900 leading-tight">
                  {tool.title}
                </h3>
                <p className="mt-2 text-gray-600">{tool.description}</p>

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

                  {/* Learn More button - now at bottom */}
                  <motion.button
                    onClick={scrollToGuides}
                    className="mt-auto pt-8 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
                    whileHover={{ x: 4 }}
                  >
                    Learn more
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
