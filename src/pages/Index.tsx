import { ImageAnalyzer } from "@/components/ImageAnalyzer";

const Index = () => {
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
        <ImageAnalyzer />
      </div>
    </div>
  );
};

export default Index;