import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalysisResult } from "@/components/results/types";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState<"details" | "tips">("details");
  const isMobile = useIsMobile();

  const preprocessImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Target dimensions (maintain aspect ratio)
        const maxDimension = 1024;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Apply some basic image optimization
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.9
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (file: File) => {
    try {
      const optimizedFile = await preprocessImage(file);
      const imageUrl = URL.createObjectURL(optimizedFile);
      setSelectedImage(imageUrl);
      await analyzeImage(optimizedFile);
    } catch (error) {
      console.error('Image preprocessing error:', error);
      toast.error('Failed to process image. Please try again.');
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          
          const { data, error } = await supabase.functions.invoke('analyze-image', {
            body: { image: base64Image }
          });

          if (error) {
            console.error('Analysis error:', error);
            throw error;
          }

          console.log('Analysis results:', data);
          setResults(data);

          const user = await supabase.auth.getUser();
          if (user.data.user) {
            await supabase.from('analysis_history').insert({
              user_id: user.data.user.id,
              image_url: base64Image,
              results: data
            });
          }

        } catch (error) {
          console.error('Analysis error:', error);
          toast.error('Failed to analyze image. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read image file. Please try again.');
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('File handling error:', error);
      toast.error('Failed to process image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">
            SearchIt.in
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Upload or capture a photo to discover detailed information about any object
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-start">
          <div className="space-y-6">
            {!selectedImage ? (
              <Card className="p-4 sm:p-6 animate-fade-in">
                <ImageUpload onImageSelect={handleImageSelect} />
              </Card>
            ) : (
              <Card className="p-4 sm:p-6 animate-fade-in">
                <ImagePreview
                  imageUrl={selectedImage}
                  onRemove={() => {
                    setSelectedImage(null);
                    setResults(null);
                  }}
                />
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {(isAnalyzing || results) && (
              <Card className="p-4 sm:p-6 animate-fade-in">
                <Tabs 
                  defaultValue="details" 
                  className="w-full" 
                  onValueChange={(value) => setActiveView(value as "details" | "tips")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <ResultsDisplay
                      isLoading={isAnalyzing}
                      results={results}
                      view="details"
                      isMobile={isMobile}
                    />
                  </TabsContent>
                  <TabsContent value="tips">
                    <ResultsDisplay
                      isLoading={isAnalyzing}
                      results={results}
                      view="tips"
                      isMobile={isMobile}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
