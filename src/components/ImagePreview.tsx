import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative">
      <AspectRatio ratio={9/16}>
        <img
          src={imageUrl}
          alt="Preview"
          className="rounded-lg object-contain w-full h-full"
        />
      </AspectRatio>
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