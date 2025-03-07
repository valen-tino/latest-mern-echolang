import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function VideoUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const onDrop = useCallback(async acceptedFiles => {
    const formData = new FormData();
    formData.append('video', acceptedFiles[0]);
    formData.append('title', acceptedFiles[0].name);
    formData.append('sourceLang', 'en');
    formData.append('targetLangs', JSON.stringify(['es', 'fr']));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });

      const data = await response.json();
      onUploadComplete(data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'video/*': ['.mp4', '.mov']},
    maxFiles: 1
  });

  return (
    <div className="border-2 border-dashed rounded-xl p-8 text-center">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop video here' : 'Drag & drop or browse files'}
        </h3>
        <p className="text-muted-foreground mb-4">
          Supported formats: MP4, MOV (Max 2GB)
        </p>
      </div>

      {file && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <video 
                src={URL.createObjectURL(file)} 
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium">{file.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setFile(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Progress value={progress} className="h-2" />
          <div className="mt-2 text-sm text-muted-foreground">
            {Math.round(progress)}% uploaded
          </div>
        </div>
      )}
    </div>
  );
}
