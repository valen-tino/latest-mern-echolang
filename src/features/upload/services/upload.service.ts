import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../constants';
import { VideoMetadata } from '../types';
import api from '@/lib/api/client';

// Constants
// export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
// export const SUPPORTED_FORMATS = ['mp4', 'mov', 'avi', 'mkv'];

export class UploadError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'UploadError';
  }
}

export async function validateFile(file: File): Promise<void> {
  // Check file size (2GB limit)
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError(
      'File size exceeds 2GB limit',
      'FILE_TOO_LARGE'
    );
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
    throw new UploadError(
      'Unsupported file format. Please upload MP4, MOV, AVI, or MKV files.',
      'UNSUPPORTED_FORMAT'
    );
  }

  // Check file integrity
  const isValid = await validateFileIntegrity(file);
  if (!isValid) {
    throw new UploadError(
      'The file appears to be corrupted or invalid.',
      'INVALID_FILE'
    );
  }
}

export async function uploadVideo(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<{ id: string; metadata: VideoMetadata }> {
  // Extract metadata first
  const metadata = await extractVideoMetadata(file);
  
  // Create form data for upload
  const formData = new FormData();
  formData.append('video', file);
  
  try {
    // Upload the file
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/videos/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type here, it will be set automatically with boundary
        Authorization: `Bearer ${localStorage.getItem('auth-token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new UploadError(
        errorData.message || 'Failed to upload video',
        errorData.code || 'UPLOAD_FAILED'
      );
    }
    
    const result = await response.json();
    return { 
      id: result.id,
      metadata
    };
  } catch (error) {
    if (error instanceof UploadError) {
      throw error;
    }
    throw new UploadError(
      'Failed to upload video',
      'UPLOAD_FAILED'
    );
  }
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  // In a real app, you might use a library or backend service to extract metadata
  // This is a simplified version
  return {
    format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
    duration: 0, // Would be extracted from actual video
    size: file.size,
    filename: file.name,
    uploadDate: new Date().toISOString()
  };
}

async function validateFileIntegrity(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(true);
    reader.onerror = () => resolve(false);
    
    // Read the first few bytes to verify file integrity
    reader.readAsArrayBuffer(file.slice(0, 8192));
  });
}