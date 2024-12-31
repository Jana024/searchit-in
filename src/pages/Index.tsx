import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
  name: string;
  description: string;
  confidence: number;
  similar_items?: Array<{
    name: string;
    similarity: number;
    purchase_url?: string;
    price?: string;
  }>;
  category?: string;
  usage_tips?: string[];
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    analyzeImage(file);
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

          if (error) throw error;

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-5xl py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 animate-fade-in">
            SearchIt.in
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
            Upload or capture a photo to discover detailed information about any object
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div className="space-y-6">
            {!selectedImage ? (
              <Card className="p-6 animate-fade-in">
                <ImageUpload onImageSelect={handleImageSelect} />
              </Card>
            ) : (
              <Card className="p-6 animate-fade-in">
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
              <Tabs defaultValue="details" className="animate-fade-in">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="similar">Similar Items</TabsTrigger>
                  <TabsTrigger value="tips">Usage Tips</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <ResultsDisplay
                    isLoading={isAnalyzing}
                    results={results}
                    view="details"
                  />
                </TabsContent>
                <TabsContent value="similar">
                  <ResultsDisplay
                    isLoading={isAnalyzing}
                    results={results}
                    view="similar"
                  />
                </TabsContent>
                <TabsContent value="tips">
                  <ResultsDisplay
                    isLoading={isAnalyzing}
                    results={results}
                    view="tips"
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
