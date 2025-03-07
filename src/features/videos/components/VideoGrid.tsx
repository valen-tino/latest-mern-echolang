import { VideoCard } from '@/components/VideoCard';
import { VideoDocument } from '../types';
import { Button } from '@/components/ui/button';

interface VideoGridProps {
  videos: VideoDocument[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function VideoGrid({ 
  videos, 
  isLoading, 
  hasMore, 
  onLoadMore 
}: VideoGridProps) {
  if (isLoading && videos.length === 0) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse space-y-4"
          >
            <div className="aspect-video bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No videos yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload your first video to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={{
              id: video._id,
              title: video.title,
              thumbnail: video.thumbnail,
              duration: video.duration.toString(),
              status: video.status,
              languages: [video.sourceLanguage, ...video.targetLanguages]
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}