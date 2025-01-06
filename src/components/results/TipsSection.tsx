import { Lightbulb, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Tip {
  content: string;
  category?: string;
  importance?: 'high' | 'medium' | 'low';
}

interface TipsSectionProps {
  tips?: Tip[];
  isMobile?: boolean;
}

export const TipsSection = ({ tips, isMobile }: TipsSectionProps) => {
  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
      <div className="space-y-4">
        {tips?.map((tip, index) => (
          <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <Lightbulb className={`h-5 w-5 flex-shrink-0 mt-1 ${getImportanceColor(tip.importance)}`} />
              <div className="flex-1">
                <p className="text-muted-foreground">{tip.content}</p>
                {tip.category && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {tip.category}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!tips || tips.length === 0) && (
          <p className="text-center text-muted-foreground">No tips available.</p>
        )}
      </div>
    </ScrollArea>
  );
};