import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function VideoCard({ video }: { video: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="font-medium">{video.title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{video.duration}</span>
            <Badge variant={video.status === 'completed' ? 'default' : 'secondary'}>
              {video.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.languages.map((lang: string) => (
              <Badge key={lang} variant="outline">{lang}</Badge>
            ))}
          </div>
          <Link 
            to={`/video/${video.id}`}
            className="inline-block w-full mt-2"
          >
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
