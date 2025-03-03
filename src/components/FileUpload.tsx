import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  selectedPupilId: string;
  onUploadComplete: (files: { file: File }[]) => void;
  showPupilSelect?: boolean;
  acceptedFileTypes?: Record<string, string[]>;
}

export function FileUpload({
  selectedPupilId,
  onUploadComplete,
  showPupilSelect = true,
  acceptedFileTypes = {
    "image/*": [".png", ".jpg", ".jpeg"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
}: FileUploadProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (showPupilSelect && !selectedPupilId) {
        toast.error(t("fileUploadGeneric.pleaseSelectStudent"));
        return;
      }

      setUploading(true);
      try {
        const files = acceptedFiles.map((file) => ({ file }));
        onUploadComplete(files);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(t("fileUploadGeneric.uploadError"));
      } finally {
        setUploading(false);
      }
    },
    [selectedPupilId, onUploadComplete, showPupilSelect, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    disabled: uploading || (showPupilSelect && !selectedPupilId),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        bg-white rounded-lg p-3 sm:p-4 text-center border-2 border-dashed transition-all duration-200 cursor-pointer
        ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-400 hover:bg-gray-50"
        }
        ${
          uploading || (showPupilSelect && !selectedPupilId)
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <FiUploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          <p className="text-base sm:text-lg font-medium text-gray-900">
            {uploading
              ? t("fileUploadGeneric.uploading")
              : isDragActive
              ? t("fileUploadGeneric.dropFilesHere")
              : t("fileUploadGeneric.uploadYourExercises")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
            {t("fileUploadGeneric.aiSuggestions")}
          </p>
          <p className="text-gray-600 text-xs font-light italic mb-3 sm:mb-4">
            {t("fileUploadGeneric.formatHint")}
          </p>
        </div>
        {showPupilSelect && !selectedPupilId && (
          <p className="text-xs text-amber-600 font-medium text-center">
            {t("fileUploadGeneric.pleaseSelectStudent")}
          </p>
        )}
      </div>
    </div>
  );
}
