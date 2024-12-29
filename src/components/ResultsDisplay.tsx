import { Loader2, ExternalLink, Info, ShoppingCart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: {
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
  };
  view: "details" | "similar" | "tips";
}

export const ResultsDisplay = ({ isLoading, results, view }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!results) return null;

  const renderDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          {results.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-gray-600">{results.description}</p>
        </div>
        
        {results.category && (
          <div>
            <h4 className="text-sm font-medium mb-2">Category</h4>
            <p className="text-gray-600">{results.category}</p>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-2">Confidence Score</h4>
          <div className="flex items-center gap-2">
            <Progress value={results.confidence} className="flex-1" />
            <span className="text-sm font-medium">{results.confidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSimilarItems = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Similar Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {results.similar_items?.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.price && (
                      <p className="text-sm text-gray-600">{item.price}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Progress value={item.similarity} className="w-24" />
                      <span className="text-sm text-gray-500">
                        {item.similarity}% match
                      </span>
                    </div>
                  </div>
                  {item.purchase_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4"
                      onClick={() => window.open(item.purchase_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderUsageTips = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Usage Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {results.usage_tips?.map((tip, index) => (
              <Card key={index} className="p-4">
                <p className="text-gray-600">{tip}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {view === "details" && renderDetails()}
      {view === "similar" && renderSimilarItems()}
      {view === "tips" && renderUsageTips()}
    </div>
  );
};