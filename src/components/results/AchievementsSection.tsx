import { Trophy, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  title: string;
  description: string;
  year?: string;
  category?: string;
}

interface AchievementsSectionProps {
  achievements?: Achievement[];
  isMobile?: boolean;
}

export const AchievementsSection = ({ achievements, isMobile }: AchievementsSectionProps) => (
  <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
    <div className="space-y-4">
      {achievements?.map((achievement, index) => (
        <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{achievement.title}</h4>
                {achievement.year && (
                  <Badge variant="outline">{achievement.year}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.category && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  {achievement.category}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {(!achievements || achievements.length === 0) && (
        <p className="text-center text-muted-foreground">No achievements available.</p>
      )}
    </div>
  </ScrollArea>
);