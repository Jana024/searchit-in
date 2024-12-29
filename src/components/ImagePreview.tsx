import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg animate-fade-in">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-64 object-cover"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};