import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { FiSend, FiMapPin, FiMail, FiArrowRight } from "react-icons/fi";

export function Contact() {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
    type: "feedback", // or "contact"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedback").insert([feedback]);

      if (error) throw error;

      toast.success("Thank you for your message! We'll be in touch soon.");
      setFeedback({ name: "", email: "", message: "", type: "feedback" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto"
            >
              Have questions or feedback? We'd love to hear from you.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Form */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
                <p className="mt-2 text-gray-600">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={feedback.name}
                      onChange={(e) =>
                        setFeedback({ ...feedback, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={feedback.email}
                      onChange={(e) =>
                        setFeedback({ ...feedback, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type
                    </label>
                    <select
                      id="type"
                      value={feedback.type}
                      onChange={(e) =>
                        setFeedback({ ...feedback, type: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    >
                      <option value="feedback">Feedback</option>
                      <option value="contact">General Inquiry</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={feedback.message}
                      onChange={(e) =>
                        setFeedback({ ...feedback, message: e.target.value })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 lg:p-12 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-8">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <FiMapPin className="w-6 h-6 mt-1" />
                      <div>
                        <p className="font-medium">Our Location</p>
                        <p className="mt-1 text-indigo-100">
                          123 Innovation Drive
                          <br />
                          San Francisco, CA 94107
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <FiMail className="w-6 h-6 mt-1" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="mt-1 text-indigo-100">
                          support@teacherassistant.ai
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h4 className="font-medium mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-indigo-100 hover:text-white transition-colors"
                    >
                      Twitter
                      <FiArrowRight className="inline-block ml-1" />
                    </a>
                    <a
                      href="#"
                      className="text-indigo-100 hover:text-white transition-colors"
                    >
                      LinkedIn
                      <FiArrowRight className="inline-block ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
