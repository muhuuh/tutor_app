import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";

interface ChatFileUploadProps {
  selectedPupilId: string;
  onUploadComplete: (files: { path: string; url: string }[]) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export function ChatFileUpload({
  selectedPupilId,
  onUploadComplete,
  setIsUploading,
}: ChatFileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedPupilId) {
        toast.error("Please select a student first");
        return;
      }

      setIsProcessing(true);
      setIsUploading(true);

      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          // Create a unique file path
          const timestamp = Date.now();
          const fileExt = file.name.split(".").pop();
          const fileName = `${timestamp}-${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`;
          const filePath = `${selectedPupilId}/${fileName}`;

          // Upload file to Supabase Storage
          const { error: uploadError, data } = await supabase.storage
            .from("assignments")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("assignments").getPublicUrl(filePath);

          return {
            path: filePath,
            url: publicUrl,
          };
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      try {
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(
          (result): result is { path: string; url: string } => result !== null
        );

        if (successfulUploads.length > 0) {
          onUploadComplete(successfulUploads);
        }
      } finally {
        setIsProcessing(false);
        setIsUploading(false);
      }
    },
    [selectedPupilId, onUploadComplete, setIsUploading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-indigo-500 bg-indigo-50"
          : isProcessing
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-indigo-400"
      }`}
    >
      <input {...getInputProps()} disabled={isProcessing} />
      <FiUploadCloud
        className={`w-8 h-8 mx-auto mb-2 ${
          isProcessing ? "text-gray-400" : "text-indigo-500"
        }`}
      />
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        Upload Image of Pupil Answers
      </h3>
      <p className="text-xs text-gray-500">
        Get a report with the correction, concepts to review, resources and new
        exercises to train
      </p>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Uploading files...</p>
          </div>
        </div>
      )}
    </div>
  );
}
