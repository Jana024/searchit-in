import { Info, Lightbulb, History, Settings, ThumbsUp, ThumbsDown, Target, BookOpen, Type, Link, ExternalLink, Trophy, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailedDescription } from "./results/DetailedDescription";
import { LinksSection } from "./results/LinksSection";
import { EducationalResourcesSection } from "./results/EducationalResourcesSection";
import { TipsSection } from "./results/TipsSection";
import { AchievementsSection } from "./results/AchievementsSection";
import { SpecificationsSection } from "./results/SpecificationsSection";
import type { AnalysisResult } from "./results/types";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: AnalysisResult | null;
  view: "details" | "tips" | "resources" | "achievements" | "specs" | "links";
  isMobile?: boolean;
}

export const ResultsDisplay = ({ isLoading, results, view, isMobile }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Analyzing image...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const renderContent = () => {
    switch (view) {
      case "details":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
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
              <DetailedDescription results={results} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      case "tips":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lightbulb className="h-5 w-5" />
                Expert Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TipsSection tips={results.expert_tips?.map(tip => ({ content: tip }))} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      case "resources":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5" />
                Educational Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EducationalResourcesSection resources={results.educational_resources} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      case "achievements":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5" />
                Achievements & Awards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AchievementsSection achievements={results.achievements} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      case "specs":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Cpu className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpecificationsSection specifications={results.specifications} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      case "links":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Link className="h-5 w-5" />
                Related Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LinksSection links={results.product_links} isMobile={isMobile} />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {renderContent()}
    </div>
  );
};