import { useState } from 'react';
import { storage } from '../lib/storage';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const getFileUrl = async (filePath: string) => {
    const url = await storage.getFileUrl(filePath);
    setUploadedUrl(url);
    return url;
  };

  const deleteFile = async (filePath: string) => {
    setIsUploading(true);
    try {
      await storage.deleteFile(filePath);
      setUploadedUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadedUrl,
    getFileUrl,
    deleteFile
  };
}