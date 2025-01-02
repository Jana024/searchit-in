import { Loader2, ExternalLink, Info, ShoppingCart, Lightbulb, History, Settings, ThumbsUp, ThumbsDown, Target, Recycle, Shield, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
    category?: string;
    historical_context?: string[];
    technical_details?: string[];
    advantages?: string[];
    disadvantages?: string[];
    usage_applications?: string[];
    market_information?: string[];
    product_links?: string;
    similar_items?: SimilarItem[];
    maintenance_care?: string[];
    environmental_impact?: string[];
    safety_considerations?: string[];
    expert_tips?: string[];
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
          {results.category && (
            <Badge variant="secondary" className="ml-2">
              {results.category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

            {results.market_information && results.market_information.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Market Information
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.market_information.map((info, index) => (
                    <li key={index} className="text-gray-600">{info}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.product_links && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Product Links</h4>
                <p className="text-gray-600">{results.product_links}</p>
              </div>
            )}

            {results.maintenance_care && results.maintenance_care.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Maintenance & Care
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.maintenance_care.map((care, index) => (
                    <li key={index} className="text-gray-600">{care}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.environmental_impact && results.environmental_impact.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Recycle className="h-4 w-4" />
                  Environmental Impact
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.environmental_impact.map((impact, index) => (
                    <li key={index} className="text-gray-600">{impact}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.safety_considerations && results.safety_considerations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety Considerations
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  {results.safety_considerations.map((safety, index) => (
                    <li key={index} className="text-gray-600">{safety}</li>
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
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {results.similar_items?.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{item.name}</h4>
                  <Badge variant="secondary">{item.similarity}% match</Badge>
                </div>
                {item.price && (
                  <p className="text-sm text-gray-600 font-medium">{item.price}</p>
                )}
                {item.purchase_url && (
                  <a
                    href={item.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    View Product <ExternalLink className="h-4 w-4" />
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
          Expert Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {results.expert_tips?.map((tip, index) => (
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
