import { User } from '@/features/auth/types';
import { VideoDocument } from '@/features/videos/types';
import { ProductFeedback } from '@/features/feedback/types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Test User',
    role: 'customer'
  }
];

// Mock Videos
export const videos: VideoDocument[] = [
  {
    _id: '1',
    userId: '2',
    title: 'Product Demo',
    description: 'A comprehensive overview of our latest product features.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    duration: 150,
    size: 15000000,
    format: 'mp4',
    status: 'completed',
    sourceLanguage: 'English',
    targetLanguages: ['Spanish'],
    uploadDate: '2024-01-01T00:00:00Z',
    metadata: {
      width: 1920,
      height: 1080,
      fps: 30
    }
  },
  {
    _id: '2',
    userId: '2',
    title: 'Company Overview',
    description: 'Introduction to our company and services.',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
    duration: 345,
    size: 25000000,
    format: 'mp4',
    status: 'processing',
    sourceLanguage: 'English',
    targetLanguages: ['German'],
    uploadDate: '2024-01-02T00:00:00Z',
    metadata: {
      width: 1920,
      height: 1080,
      fps: 30
    }
  }
];

// Mock Feedback
export const feedback: ProductFeedback[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Test User',
    productId: '1',
    productName: 'Product Demo',
    rating: 5,
    content: 'Great service! The translation quality is excellent.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Test User',
    productId: '2',
    productName: 'Company Overview',
    rating: 4,
    content: 'Could improve processing speed.',
    createdAt: '2024-01-02T00:00:00Z'
  }
];