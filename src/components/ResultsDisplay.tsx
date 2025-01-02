import { Info, ShoppingCart, Lightbulb, History, Settings, ThumbsUp, ThumbsDown, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult } from "./results/types";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: AnalysisResult | null;
  view: "details" | "similar" | "tips";
}

export const ResultsDisplay = ({ isLoading, results, view }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500">Analyzing image...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  console.log('Rendering results:', results);

  const renderDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          {results.name || "Analysis Results"}
          {results.category && (
            <Badge variant="secondary" className="ml-2">
              {results.category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {results.description && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{results.description}</p>
              </div>
            )}

            {results.historical_context && results.historical_context.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Historical Context
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.historical_context.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.technical_details && results.technical_details.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Technical Details
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.technical_details.map((detail, index) => (
                    <li key={index} className="text-gray-600">{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.advantages && results.advantages.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Advantages
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.advantages.map((advantage, index) => (
                    <li key={index} className="text-gray-600">{advantage}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.disadvantages && results.disadvantages.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4" />
                  Disadvantages
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.disadvantages.map((disadvantage, index) => (
                    <li key={index} className="text-gray-600">{disadvantage}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.usage_applications && results.usage_applications.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Usage & Applications
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.usage_applications.map((usage, index) => (
                    <li key={index} className="text-gray-600">{usage}</li>
                  ))}
                </ul>
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
          Similar Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {results.similar_items && results.similar_items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{item.name}</h3>
                {item.price && <p className="text-sm text-gray-600">Price: {item.price}</p>}
                {item.purchase_url && (
                  <a
                    href={item.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Product
                  </a>
                )}
                <div className="mt-2">
                  <Progress value={item.similarity} className="h-2" />
                  <span className="text-sm text-gray-500">{item.similarity}% similar</span>
                </div>
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
          Expert Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {results.expert_tips && results.expert_tips.map((tip, index) => (
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