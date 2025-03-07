import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoCard } from '@/components/VideoCard';
import { Upload, History, Settings } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: '1',
      title: 'Product Demo',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
      duration: '2:30',
      status: 'completed',
      languages: ['English', 'Spanish', 'French'],
    },
    {
      id: '2',
      title: 'Company Overview',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
      duration: '5:45',
      status: 'processing',
      languages: ['English', 'German'],
    },
    // Add more videos as needed
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="videos">My Videos</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="text-center text-muted-foreground py-8">
            <History className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">No recent activity</h3>
            <p>Your video processing history will appear here</p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="text-center text-muted-foreground py-8">
            <Settings className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Settings</h3>
            <p>Account and preference settings will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}