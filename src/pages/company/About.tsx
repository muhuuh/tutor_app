import { motion } from "framer-motion";
import { Target, Award, TrendingUp } from "lucide-react";

export function About() {
  const stats = [
    { label: "Assignments Graded", value: "1000+", icon: Target },
    { label: "Accuracy Rate", value: "99%+", icon: Award },
    {
      label: "Potential Time Savings Per Year",
      value: "Up to 520h",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section  */}
      <div className="relative mt-8 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0wIDBoNnYzMGgtNlYzMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="absolute inset-0  bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Do More
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                With Less Effort
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Empowering educators with cutting-edge AI tools to make education
              more efficient, personalized, and effective for everyone.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section with improved card design */}
      <div className="relative -mt-14 mb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20 text-center w-full max-w-sm"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <stat.icon className="w-7 h-7" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values  */}
      <div className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We build AI-driven solutions that reduce educators' workloads
                  and surface actionable insights. By removing repetitive tasks,
                  teachers are free to focus on delivering meaningful learning
                  experiences.
                </p>
              </div>
            </motion.div>

            {/* Values Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Our Values
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    "Teacher-Centered Design",
                    "Practical Innovation",
                    "Reliable & Transparent AI",
                    "Continual Growth & Feedback",
                  ].map((value, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                      <span className="text-gray-600">{value}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
