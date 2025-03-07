import { Video } from '../types';

export async function getVideoById(id: string): Promise<Video> {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id,
    title: 'Product Demo',
    description: 'A comprehensive overview of our latest product features.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    duration: '2:30',
    status: 'completed',
    sourceLanguage: 'English',
    translations: [
      { language: 'Spanish', progress: 100, status: 'completed' },
      { language: 'French', progress: 65, status: 'processing' },
      { language: 'German', progress: 30, status: 'processing' },
    ],
  };
}