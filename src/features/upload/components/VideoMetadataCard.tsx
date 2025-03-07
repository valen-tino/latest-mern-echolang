import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes, formatDuration } from '@/lib/utils';
import { Clock, Film, HardDrive, Calendar } from 'lucide-react';
import { VideoMetadata } from '../types';

interface VideoMetadataCardProps {
  metadata: VideoMetadata;
}

export function VideoMetadataCard({ metadata }: VideoMetadataCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Video Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {metadata.thumbnail && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={metadata.thumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetadataItem
              icon={Film}
              label="Format"
              value={metadata.format.toUpperCase()}
            />
            <MetadataItem
              icon={Clock}
              label="Duration"
              value={formatDuration(metadata.duration)}
            />
            <MetadataItem
              icon={HardDrive}
              label="File Size"
              value={formatBytes(metadata.size)}
            />
            <MetadataItem
              icon={Calendar}
              label="Uploaded"
              value={new Date(metadata.uploadDate).toLocaleString()}
            />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetadataItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function MetadataItem({ icon: Icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}