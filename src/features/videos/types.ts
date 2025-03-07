export interface VideoDocument {
  _id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  size: number;
  format: string;
  status: 'processing' | 'completed' | 'failed';
  sourceLanguage: string;
  targetLanguages: string[];
  uploadDate: string;
  metadata: {
    width: number;
    height: number;
    fps: number;
  };
}

export interface VideoStats {
  totalCount: number;
  processingCount: number;
  totalStorage: number;
  uniqueLanguages: number;
}