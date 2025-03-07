import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload as UploadIcon } from 'lucide-react';
import { SUPPORTED_FORMATS } from '../constants';

interface UploadZoneProps {
  onFileDrop: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileDrop, disabled }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileDrop(acceptedFiles[0]),
    accept: {
      'video/*': SUPPORTED_FORMATS.map(format => `.${format}`)
    },
    maxFiles: 1,
    multiple: false,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Supported formats: {SUPPORTED_FORMATS.join(', ').toUpperCase()}
      </p>
      <Button variant="outline" disabled={disabled}>Select Video</Button>
    </div>
  );
}