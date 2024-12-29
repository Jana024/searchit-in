import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: {
    name: string;
    description: string;
    confidence: number;
    similar_items?: Array<{
      name: string;
      similarity: number;
    }>;
  };
}

export const ResultsDisplay = ({ isLoading, results }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{results.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-gray-600">{results.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Confidence Score</h4>
            <div className="flex items-center gap-2">
              <Progress value={results.confidence} className="flex-1" />
              <span className="text-sm font-medium">{results.confidence}%</span>
            </div>
          </div>

          {results.similar_items && results.similar_items.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Similar Items</h4>
              <div className="space-y-2">
                {results.similar_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.name}</span>
                    <Progress value={item.similarity} className="w-24" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};