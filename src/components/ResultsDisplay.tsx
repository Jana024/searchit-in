import { Info, Lightbulb, History, Settings, ThumbsUp, ThumbsDown, Target, BookOpen, Type, Link, ExternalLink, Trophy, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { EducationalResourcesSection } from "./results/EducationalResourcesSection";
import { TipsSection } from "./results/TipsSection";
import { AchievementsSection } from "./results/AchievementsSection";
import { SpecificationsSection } from "./results/SpecificationsSection";
import type { AnalysisResult } from "./results/types";

interface ResultsDisplayProps {
  isLoading: boolean;
  results?: AnalysisResult | null;
  view: "details" | "tips" | "resources" | "achievements" | "specs";
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

  const scrollAreaHeight = isMobile ? "h-[400px]" : "h-[600px]";

  const renderDetails = () => (
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
        <ScrollArea className={scrollAreaHeight + " pr-4"}>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{results.description}</p>
            </div>

            {results.historical_context && results.historical_context.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <History className="h-4 w-4" />
                  Historical Context
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.historical_context.map((item, index) => (
                    <li key={index} className="text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.technical_details && results.technical_details.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Settings className="h-4 w-4" />
                  Technical Details
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.technical_details.map((detail, index) => (
                    <li key={index} className="text-muted-foreground">{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.advantages && results.advantages.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  Advantages
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.advantages.map((advantage, index) => (
                    <li key={index} className="text-muted-foreground">{advantage}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.disadvantages && results.disadvantages.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <ThumbsDown className="h-4 w-4" />
                  Disadvantages
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.disadvantages.map((disadvantage, index) => (
                    <li key={index} className="text-muted-foreground">{disadvantage}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.cultural_significance && results.cultural_significance.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4" />
                  Cultural Significance
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.cultural_significance.map((item, index) => (
                    <li key={index} className="text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.related_events && results.related_events.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <History className="h-4 w-4" />
                  Related Events
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.related_events.map((event, index) => (
                    <li key={index} className="text-muted-foreground">{event}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2 text-foreground">Confidence Score</h4>
              <div className="flex items-center gap-2">
                <Progress value={results.confidence} className="flex-1" />
                <span className="text-sm font-medium text-foreground">{results.confidence}%</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderTips = () => (
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

  const renderResources = () => (
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

  const renderAchievements = () => (
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

  const renderSpecs = () => (
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

  return (
    <div className="space-y-6 animate-fade-in">
      {view === "details" && renderDetails()}
      {view === "tips" && renderTips()}
      {view === "resources" && renderResources()}
      {view === "achievements" && renderAchievements()}
      {view === "specs" && renderSpecs()}
    </div>
  );
};
