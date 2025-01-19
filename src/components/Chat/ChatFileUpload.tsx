import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

interface ChatFileUploadProps {
  selectedPupilId: string;
  onUploadComplete: (files: { path: string; url: string }[]) => void;
}

export function ChatFileUpload({
  selectedPupilId,
  onUploadComplete,
}: ChatFileUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedPupilId) {
        toast.error("Please select a student first");
        return;
      }

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

          // Get public URL for the file
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

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(
        (result): result is { path: string; url: string } => result !== null
      );

      if (successfulUploads.length > 0) {
        onUploadComplete(successfulUploads);
      }
    },
    [selectedPupilId, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 hover:border-indigo-400"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here..."
          : "Drag & drop files here, or click to select"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supported: Images (PNG, JPG, GIF) and PDF • Max size: 10MB
      </p>
    </div>
  );
}
