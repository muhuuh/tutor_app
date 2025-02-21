import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { FiUploadCloud, FiCamera } from "react-icons/fi";
import { useIsMobile } from "../../hooks/useIsMobile";

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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

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
          const { error: uploadError } = await supabase.storage
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

  const handleCameraCapture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await onDrop([file]);
    }
    // Reset the input value so the same file can be selected again
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing,
  });

  return (
    <div className="flex gap-2">
      <div
        {...getRootProps()}
        className={`flex-1 relative border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50/50 backdrop-blur-sm"
            : isProcessing
            ? "border-gray-200 bg-gray-50/50 backdrop-blur-sm cursor-not-allowed"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/10"
        }`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <FiUploadCloud
          className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 transition-colors ${
            isProcessing
              ? "text-gray-400"
              : isDragActive
              ? "text-indigo-600"
              : "text-indigo-500"
          }`}
        />
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
          Upload Foto of Exam and Answers{" "}
          <span className="font-normal">(jpeg, png)</span>
        </h3>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs sm:text-sm text-gray-600">
                Uploading files...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Only show camera button on mobile */}
      {isMobile && (
        <div className="flex items-center">
          <label
            className={`flex items-center justify-center w-14 h-full border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              isProcessing
                ? "border-gray-200 bg-gray-50/50 cursor-not-allowed"
                : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/10"
            }`}
          >
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              disabled={isProcessing}
              className="hidden"
            />
            <FiCamera
              className={`w-6 h-6 ${
                isProcessing ? "text-gray-400" : "text-indigo-500"
              }`}
            />
          </label>
        </div>
      )}
    </div>
  );
}
