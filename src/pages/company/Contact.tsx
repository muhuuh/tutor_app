import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Send, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mb-8 sm:mb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16 sm:py-24 pt-28">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/[0.1] to-black/[0.4]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pb-6 sm:pb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white"
            >
              {t("contact.heroHeading")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {t("contact.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {t("contact.dropLineHeading")}
            </h2>
            <p className="text-gray-600">
              {t("contact.dropLineSubtitlePart1")}
            </p>
            <p className="text-gray-600 text-center">
              {t("contact.dropLineSubtitlePart2")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.form.placeholders.name")}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/30 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.form.placeholders.email")}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/30 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={t("contact.form.placeholders.subject")}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/30 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder={t("contact.form.placeholders.message")}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/30 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500/30 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="flex items-center space-x-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={t("contact.socialIcons.facebook")}
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-400 transition-colors"
                  aria-label={t("contact.socialIcons.twitter")}
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 transition-colors"
                  aria-label={t("contact.socialIcons.linkedin")}
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition-colors"
                  aria-label={t("contact.socialIcons.instagram")}
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  t("contact.form.btnSending")
                ) : (
                  <span className="flex items-center">
                    {t("contact.form.btnSend")}
                    <Send className="ml-2 w-5 h-5" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
