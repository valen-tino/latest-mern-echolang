import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { getUserVideos, getUserVideoStats } from '../services/video.service';
import type { VideoDocument, VideoStats } from '../types';

export function useUserVideos(initialPage = 1) {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoDocument[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const [videosData, statsData] = await Promise.all([
          getUserVideos(user.id, page),
          getUserVideoStats(user.id)
        ]);

        if (!mounted) return;

        setVideos(prev => 
          page === 1 
            ? videosData.videos 
            : [...prev, ...videosData.videos]
        );
        setTotalPages(Math.ceil(videosData.total / 12));
        setStats(statsData);
        setError(null);
      } catch (err) {
        if (mounted) {
          setError('Failed to load videos');
          console.error('Error loading videos:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [user, page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return {
    videos,
    stats,
    isLoading,
    error,
    hasMore: page < totalPages,
    loadMore
  };
}