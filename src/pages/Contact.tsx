import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { FiMail, FiMessageSquare, FiSend } from "react-icons/fi";

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

      toast.success("Thank you for your feedback!");
      setFeedback({ name: "", email: "", message: "", type: "feedback" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Us Section */}
          <div className="text-center mb-24">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              About Us
            </h2>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
              We're a team of educators and technologists passionate about
              transforming education through AI. Our mission is to empower
              teachers with tools that save time and improve student outcomes.
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Our Mission
                </h3>
                <p className="mt-4 text-gray-600">
                  To revolutionize education by making AI-powered tools
                  accessible to every educator.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Our Vision
                </h3>
                <p className="mt-4 text-gray-600">
                  A world where teachers can focus on inspiring students, not
                  administrative tasks.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Our Values
                </h3>
                <p className="mt-4 text-gray-600">
                  Innovation, accessibility, and putting educators first in
                  everything we do.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-lg text-gray-500">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="feedback">Feedback</option>
                  <option value="contact">Contact</option>
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

            {/* Additional Contact Info */}
            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FiMail className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-500">
                    support@teacherassistant.ai
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FiMessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Live Chat
                  </h3>
                  <p className="mt-1 text-gray-500">Available 9am-5pm EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
