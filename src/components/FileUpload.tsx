import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";

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
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (showPupilSelect && !selectedPupilId) {
        toast.error("Please select a student first");
        return;
      }

      setUploading(true);
      try {
        const files = acceptedFiles.map((file) => ({ file }));
        onUploadComplete(files);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error uploading files");
      } finally {
        setUploading(false);
      }
    },
    [selectedPupilId, onUploadComplete, showPupilSelect]
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
        bg-white rounded-lg p-4 text-center border-2 border-dashed transition-all duration-200 cursor-pointer
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
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <FiUploadCloud className="w-6 h-6 text-indigo-500" />
          <p className="text-lg font-medium text-gray-900">
            {uploading
              ? "Uploading..."
              : isDragActive
              ? "Drop files here"
              : "Upload your exercises"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            Get AI suggestions for improving exercises and generating solutions
          </p>
          <p className="text-gray-600 text-sm font-light italic mb-4">
            (Format: .docx)
          </p>
        </div>
        {showPupilSelect && !selectedPupilId && (
          <p className="text-xs text-amber-600 font-medium text-center">
            Please select a student first
          </p>
        )}
      </div>
    </div>
  );
}
