import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    name: string;
    description: string;
    confidence: number;
  } | null>(null);

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          
          // Call the Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('analyze-image', {
            body: { image: base64Image }
          });

          if (error) throw error;

          setResults(data);

          // Store the analysis in the database
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
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SearchIt.in
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image and let AI identify it for you
          </p>
        </div>

        <div className="space-y-8">
          {!selectedImage ? (
            <ImageUpload onImageSelect={handleImageSelect} />
          ) : (
            <>
              <ImagePreview
                imageUrl={selectedImage}
                onRemove={() => {
                  setSelectedImage(null);
                  setResults(null);
                }}
              />
              <ResultsDisplay isLoading={isAnalyzing} results={results} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;