import { useState } from 'react';
import { uploadVideo, validateFile, UploadError } from '../services/upload.service';
import { toast } from 'sonner';
import type { VideoMetadata } from '../types';

interface UseVideoUploadResult {
  isUploading: boolean;
  progress: number;
  error: string | null;
  upload: (file: File) => Promise<{ id: string; metadata: VideoMetadata } | null>;
  reset: () => void;
}

export function useVideoUpload(): UseVideoUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  };

  const upload = async (file: File) => {
    reset();
    setIsUploading(true);

    try {
      // Validate file first
      await validateFile(file);

      // Start upload with progress tracking
      const result = await uploadVideo(file, (progress) => {
        setProgress(progress);
      });

      toast.success('Video uploaded successfully!');
      return result;
    } catch (err) {
      if (err instanceof UploadError) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('An unexpected error occurred');
        toast.error('Failed to upload video');
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    progress,
    error,
    upload,
    reset
  };
}