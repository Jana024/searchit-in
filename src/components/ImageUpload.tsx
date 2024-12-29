import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    onImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real app, we would handle the camera stream here
      toast.info("Camera functionality coming soon!");
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast.error("Unable to access camera");
    }
  };

  return (
    <div
      className={`p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Drag & drop an image or
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: JPG, PNG, GIF
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload size={20} />
            Choose File
          </Button>
          <Button
            onClick={openCamera}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera size={20} />
            Use Camera
          </Button>
        </div>
      </div>
    </div>
  );
};