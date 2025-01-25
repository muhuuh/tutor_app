import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiTarget, FiAward, FiTrendingUp } from "react-icons/fi";

export function About() {
  const stats = [
    { label: "Active Users", value: "2,000+", icon: <FiUsers /> },
    { label: "Assignments Graded", value: "100,000+", icon: <FiTarget /> },
    { label: "Accuracy Rate", value: "95%", icon: <FiAward /> },
    { label: "Time Saved", value: "1000+ hrs", icon: <FiTrendingUp /> },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Executive Officer",
      bio: "Former educator with 15 years of experience in STEM education and EdTech.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      bio: "AI researcher specializing in computer vision and natural language processing.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Dr. Emily Thompson",
      role: "Head of Education",
      bio: "Mathematics professor with expertise in educational assessment and curriculum design.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
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
              className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto"
            >
              We're on a mission to empower educators with cutting-edge AI
              tools, making education more efficient and effective for everyone.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center text-indigo-600 text-4xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">
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
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600">
                To revolutionize education by providing AI-powered tools that
                automate administrative tasks, enabling teachers to focus on
                what matters most - inspiring and guiding their students.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li>• Innovation in Education</li>
                <li>• Empowering Educators</li>
                <li>• Accuracy and Reliability</li>
                <li>• Continuous Improvement</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-xl text-gray-500">
              Meet the experts behind our innovation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-indigo-600 mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
