import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error("Unable to access camera");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  if (showCamera) {
    return (
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button onClick={capturePhoto} variant="default">
            Take Photo
          </Button>
          <Button onClick={stopCamera} variant="destructive">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

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
            onClick={startCamera}
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