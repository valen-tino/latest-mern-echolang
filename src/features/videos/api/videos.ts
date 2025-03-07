export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  status: string;
  sourceLanguage: string;
  translations: {
    language: string;
    status: string;
    progress: number;
  }[];
}

export async function getVideoById(id: string): Promise<Video> {
  // Mock implementation
  return {
    id,
    title: 'Sample Video',
    description: 'Demo video description',
    thumbnail: '/placeholder.jpg',
    duration: '12:34',
    status: 'processed',
    sourceLanguage: 'English',
    translations: [
      { language: 'Spanish', status: 'completed', progress: 100 },
      { language: 'French', status: 'processing', progress: 45 }
    ]
  };
}
