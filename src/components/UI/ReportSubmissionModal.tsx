import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReportSubmissionModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function ReportSubmissionModal({
  isOpen,
  onClose,
}: ReportSubmissionModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg relative overflow-hidden rounded-2xl"
          >
            {/* Updated background with lighter gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-violet-50">
              <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-blue-50/50 to-violet-50/50" />
            </div>

            <div className="relative p-8">
              <div className="flex flex-col items-center text-center space-y-8">
                {/* Icon with animated gradient background - keeping this vibrant */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-75 blur-xl group-hover:opacity-100 animate-pulse transition-opacity" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {t("reportSubmissionModal.title")}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-600 max-w-md"
                  >
                    {t("reportSubmissionModal.subtitle")}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-sm bg-gradient-to-r from-blue-500/10 to-violet-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 font-medium">
                      {t("reportSubmissionModal.processingBox")}
                    </span>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500"
                >
                  {t("reportSubmissionModal.processingHint")}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t("reportSubmissionModal.closeButton")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
