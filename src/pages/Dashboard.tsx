import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoCard } from '@/components/VideoCard';
import { Upload, History, Settings } from 'lucide-react';

const Dashboard = () => {
  const [tabValue] = useState('videos');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/upload">Upload New</Link>
        </Button>
      </div>

      <Tabs value={tabValue} className="space-y-4">
        <TabsList>
          <TabsTrigger value="videos">My Videos</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <VideoCard />
              <VideoCard />
              <VideoCard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
