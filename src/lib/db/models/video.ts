import { ObjectId } from 'mongodb';

export interface Video {
  _id?: ObjectId;
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
  uploadDate: Date;
  metadata: {
    width: number;
    height: number;
    fps: number;
  };
}

export const VideoCollection = 'videos';