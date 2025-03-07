import { videos } from '@/lib/mock/data';
import type { VideoDocument, VideoStats } from '../types';

export async function getUserVideos(
  userId: string,
  page = 1,
  limit = 12
): Promise<{ videos: VideoDocument[]; total: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const userVideos = videos.filter(v => v.userId === userId);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    videos: userVideos.slice(start, end),
    total: userVideos.length
  };
}

export async function getUserVideoStats(userId: string): Promise<VideoStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const userVideos = videos.filter(v => v.userId === userId);
  const languages = new Set<string>();

  userVideos.forEach(video => {
    languages.add(video.sourceLanguage);
    video.targetLanguages.forEach(lang => languages.add(lang));
  });

  return {
    totalCount: userVideos.length,
    processingCount: userVideos.filter(v => v.status === 'processing').length,
    totalStorage: userVideos.reduce((sum, v) => sum + v.size, 0),
    uniqueLanguages: languages.size
  };
}