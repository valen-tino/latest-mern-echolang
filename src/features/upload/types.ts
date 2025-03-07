export interface VideoMetadata {
  format: string;
  duration: number; // in seconds
  size: number; // in bytes
  thumbnail?: string;
  uploadDate: string;
  filename: string;
}