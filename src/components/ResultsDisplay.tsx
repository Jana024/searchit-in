import { Loader2, ExternalLink, Info, ShoppingCart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Section {
  title: string;
  content: string;
}

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: {
    name: string;
    sections: Section[];
    confidence: number;
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
          {results.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Confidence Score</h4>
            <div className="flex items-center gap-2">
              <Progress value={results.confidence} className="flex-1" />
              <span className="text-sm font-medium">{results.confidence}%</span>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {renderDetails()}
    </div>
  );
};