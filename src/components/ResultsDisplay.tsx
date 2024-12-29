import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: {
    name: string;
    description: string;
    confidence: number;
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
    <Card className="p-6 animate-fade-in">
      <h3 className="text-2xl font-bold mb-4">{results.name}</h3>
      <p className="text-gray-600 mb-4">{results.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Confidence:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2"
            style={{ width: `${results.confidence}%` }}
          />
        </div>
        <span className="text-sm font-medium">{results.confidence}%</span>
      </div>
    </Card>
  );
};