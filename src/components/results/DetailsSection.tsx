import { Info, History, Settings, ThumbsUp, ThumbsDown, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult } from "./types";

interface DetailsSectionProps {
  results: AnalysisResult;
}

export const DetailsSection = ({ results }: DetailsSectionProps) => (
  <ScrollArea className="h-[600px] pr-4">
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-2">Description</h4>
        <p className="text-gray-600 whitespace-pre-wrap">{results.description}</p>
      </div>

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
);