import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    status: string;
    languages: string[];
  };
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded-md text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {video.duration}
          </div>
          <Badge 
            variant={video.status === 'completed' ? 'default' : 'secondary'}
            className="absolute top-2 right-2"
          >
            {video.status}
          </Badge>
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <div className="text-sm text-muted-foreground">
            {video.languages.length} languages
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}