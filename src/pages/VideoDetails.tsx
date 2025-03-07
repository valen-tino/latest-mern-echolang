import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Globe, MessageSquare, Play, Settings } from 'lucide-react';
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm';
import { submitProductFeedback } from '@/features/feedback/api/feedback';
import { useFeedbackStore } from '@/features/feedback/hooks/useFeedbackStore';
import { getVideoById } from '@/features/videos/api/videos';
import type { Video } from '@/features/videos/types';
import type { FeedbackFormData } from '@/features/feedback/types';

export default function VideoDetails() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('translations');
  const addFeedback = useFeedbackStore((state) => state.addFeedback);

  useEffect(() => {
    async function loadVideo() {
      if (!id) return;
      
      try {
        const data = await getVideoById(id);
        setVideo(data);
      } catch (error) {
        console.error('Failed to load video:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideo();
  }, [id]);

  const handleFeedbackSubmit = async (data: FeedbackFormData) => {
    if (!video) return;

    const feedback = await submitProductFeedback(
      video.id,
      video.title,
      data
    );
    addFeedback(feedback);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Video not found</h1>
          <p className="text-muted-foreground">The requested video could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
              />
              <Button
                size="icon"
                className="absolute inset-0 m-auto h-16 w-16 rounded-full"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{video.title}</h1>
                <Badge>{video.status}</Badge>
              </div>
              <p className="text-muted-foreground">{video.description}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList>
                <TabsTrigger value="translations">
                  <Globe className="w-4 h-4 mr-2" />
                  Translations
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="translations" className="mt-4 space-y-4">
                {video.translations.map((translation) => (
                  <Card key={translation.language}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{translation.language}</h3>
                          <Badge variant="outline">{translation.status}</Badge>
                        </div>
                        {translation.status === 'completed' && (
                          <Button size="sm">Download</Button>
                        )}
                      </div>
                      {translation.status === 'processing' && (
                        <div className="space-y-1">
                          <Progress value={translation.progress} />
                          <p className="text-sm text-muted-foreground">
                            {translation.progress}% complete
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="feedback" className="mt-4">
                <FeedbackForm
                  productName={video.title}
                  onSubmit={handleFeedbackSubmit}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-muted-foreground">
                      Video settings and preferences will appear here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="py-4">
                <h3 className="font-medium mb-2">Video Information</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd>{video.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Source Language</dt>
                    <dd>{video.sourceLanguage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Target Languages</dt>
                    <dd>{video.translations.length}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <h3 className="font-medium mb-2">Processing Status</h3>
                <div className="space-y-2">
                  {video.translations.map((translation) => (
                    <div
                      key={translation.language}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{translation.language}</span>
                      <Badge variant="outline">{translation.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}