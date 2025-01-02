import { Info, ShoppingCart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "./results/LoadingState";
import { DetailsSection } from "./results/DetailsSection";
import { SimilarItemsSection } from "./results/SimilarItemsSection";
import { TipsSection } from "./results/TipsSection";
import type { AnalysisResult } from "./results/types";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: AnalysisResult;
  view: "details" | "similar" | "tips";
}

export const ResultsDisplay = ({ isLoading, results, view }: ResultsDisplayProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) return null;

  const renderDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          {results.name}
          {results.category && (
            <Badge variant="secondary" className="ml-2">
              {results.category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DetailsSection results={results} />
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
        <SimilarItemsSection items={results.similar_items} />
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
        <TipsSection tips={results.expert_tips} />
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