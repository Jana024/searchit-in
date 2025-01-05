import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted"
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      {isDragActive ? (
        <p className="text-center text-muted-foreground">Drop the image here...</p>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Drag & drop an image here, or click to select</p>
          <p className="text-sm text-muted-foreground/70">Supports JPEG, PNG and WebP</p>
        </div>
      )}
    </div>
  );
};