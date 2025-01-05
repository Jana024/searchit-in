import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LocationSuggestion {
  name: string;
  type: 'landmark' | 'plant' | 'animal';
  distance: string;
  description: string;
  confidence: number;
}

interface LocationSuggestionsProps {
  suggestions?: LocationSuggestion[];
  isMobile?: boolean;
}

export const LocationSuggestions = ({ suggestions, isMobile }: LocationSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No location-based suggestions available for this item.
      </div>
    );
  }

  return (
    <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">{suggestion.name}</h4>
                  <Badge variant="secondary">{suggestion.distance}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
              <Badge variant="outline">{suggestion.type}</Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};