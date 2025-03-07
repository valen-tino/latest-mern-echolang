import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSelector } from '@/features/upload/components/LanguageSelector';
import { UploadZone } from '@/features/upload/components/UploadZone';
import { VideoMetadataCard } from '@/features/upload/components/VideoMetadataCard';
import { useVideoUpload } from '@/features/upload/hooks/useVideoUpload';
import type { VideoMetadata } from '@/features/upload/types';

export default function Upload() {
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { isUploading, progress, upload, reset } = useVideoUpload();

  const handleFileDrop = (file: File) => {
    if (!sourceLanguage) {
      toast.error('Please select a source language first');
      return;
    }
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      const result = await upload(file);
      if (result) {
        setUploadComplete(true);
        setMetadata({
          format: file.type.split('/')[1],
          duration: 0, // Will be updated after processing
          size: file.size,
          uploadDate: new Date().toISOString(),
          filename: file.name
        });
        
        // Extract video metadata
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        const duration = await new Promise<number>((resolve) => {
          video.onloadedmetadata = () => resolve(video.duration);
          video.src = URL.createObjectURL(file);
        });

        // Generate thumbnail
        const thumbnail = await new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          video.currentTime = 1; // Seek to 1 second
          video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
          };
        });

        setMetadata(prev => prev ? {
          ...prev,
          duration,
          thumbnail
        } : null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload video');
    }
  };

  const handleReset = () => {
    setFile(null);
    setMetadata(null);
    setUploadComplete(false);
    reset();
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

      <div className="space-y-6">
        {/* Step 1: Language Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Step 1: Select Source Language</h2>
              <LanguageSelector
                selectedLanguage={sourceLanguage}
                onLanguageChange={setSourceLanguage}
                disabled={isUploading || !!file}
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: File Upload */}
        {sourceLanguage && !file && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Step 2: Upload Video File</h2>
                <UploadZone 
                  onFileDrop={handleFileDrop}
                  disabled={!sourceLanguage || isUploading}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload Progress */}
        {file && !uploadComplete && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Step 3: Upload in Progress</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isUploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleUpload}
                  >
                    Start Upload
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Video Metadata */}
        {uploadComplete && metadata && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Step 4: Upload Complete</h2>
                <VideoMetadataCard metadata={metadata} />
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="w-full"
                >
                  Upload Another Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}