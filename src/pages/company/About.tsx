import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Award, TrendingUp } from "lucide-react";

export function About() {
  const stats = [
    { label: "Active Users", value: "2,000+", icon: Users },
    { label: "Assignments Graded", value: "100,000+", icon: Target },
    { label: "Accuracy Rate", value: "95%", icon: Award },
    { label: "Time Saved", value: "1000+ hrs", icon: TrendingUp },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Executive Officer",
      bio: "Former educator with 15 years of experience in STEM education and EdTech.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-sky-800 py-24">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              Transforming Education Through AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto"
            >
              We're on a mission to empower educators with cutting-edge AI
              tools, making education more efficient and effective for everyone.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-blue-100/20"
            >
              <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:20px_20px]" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 relative z-10">
                To revolutionize education by providing AI-powered tools that
                automate administrative tasks, enabling teachers to focus on
                what matters most - inspiring and guiding their students.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-violet-100/20"
            >
              <div className="absolute inset-0 bg-grid-violet-500/[0.02] bg-[size:20px_20px]" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Our Values
              </h2>
              <ul className="space-y-4 text-gray-600 relative z-10">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
                  <span>Innovation in Education</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
                  <span>Empowering Educators</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
                  <span>Accuracy and Reliability</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"></div>
                  <span>Continuous Improvement</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-xl text-gray-500">
              Meet the expert behind our innovation
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <img
                src={team[0].image}
                alt={team[0].name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-violet-100"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {team[0].name}
              </h3>
              <p className="text-violet-600 mb-4">{team[0].role}</p>
              <p className="text-gray-600">{team[0].bio}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
