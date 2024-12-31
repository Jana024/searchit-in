import { Loader2, ExternalLink, Info, ShoppingCart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SimilarItem {
  name: string;
  similarity: number;
  purchase_url?: string;
  price?: string;
}

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: {
    name: string;
    description: string;
    confidence: number;
    similar_items?: SimilarItem[];
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
      <CardContent className="space-y-6">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{results.description}</p>
            </div>
            
            {results.category && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Category</h4>
                <p className="text-gray-600">{results.category}</p>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Confidence Score</h4>
              <div className="flex items-center gap-2">
                <Progress value={results.confidence} className="flex-1" />
                <span className="text-sm font-medium">{results.confidence}%</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderSimilar = () => (
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
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{item.name}</h4>
                  <span className="text-sm text-gray-500">{item.similarity}% match</span>
                </div>
                {item.price && <p className="text-sm text-gray-600">Price: {item.price}</p>}
                {item.purchase_url && (
                  <a
                    href={item.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    View Item <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderTips = () => (
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
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {view === "details" && renderDetails()}
      {view === "similar" && renderSimilar()}
      {view === "tips" && renderTips()}
    </div>
  );
};