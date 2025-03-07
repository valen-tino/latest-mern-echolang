import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../constants';
import type { VideoMetadata } from '../types';

export class UploadError extends Error {
  constructor(message: string, public code: string) {
    super(message);
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
      'Unsupported file format. Supported formats: MP4, MOV, AVI',
      'INVALID_FORMAT'
    );
  }

  // Validate file integrity
  try {
    const validFile = await validateFileIntegrity(file);
    if (!validFile) {
      throw new UploadError(
        'File appears to be corrupt or incomplete',
        'CORRUPT_FILE'
      );
    }
  } catch (error) {
    throw new UploadError(
      'Failed to validate file integrity',
      'VALIDATION_FAILED'
    );
  }
}

export async function uploadVideo(
  file: File,
  onProgress: (progress: number) => void
): Promise<{ id: string; metadata: VideoMetadata }> {
  // Validate file before upload
  await validateFile(file);

  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  let uploadedChunks = 0;

  // Simulate chunked upload with progress
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    // Simulate chunk upload
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        uploadedChunks++;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);
        onProgress(progress);
        resolve();
      }, 500);
    });
  }

  // Return simulated response
  return {
    id: crypto.randomUUID(),
    metadata: {
      format: file.type.split('/')[1],
      duration: 0, // Will be set by metadata extraction
      size: file.size,
      uploadDate: new Date().toISOString(),
      filename: file.name
    }
  };
}

// Helper function to validate file integrity
async function validateFileIntegrity(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(true);
    reader.onerror = () => resolve(false);
    
    // Read the first few bytes to verify file integrity
    reader.readAsArrayBuffer(file.slice(0, 8192));
  });
}