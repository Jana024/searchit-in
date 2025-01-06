import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EducationalResource } from "./types";
import { Badge } from "@/components/ui/badge";

interface EducationalResourcesSectionProps {
  resources?: EducationalResource[];
  isMobile?: boolean;
}

export const EducationalResourcesSection = ({ resources, isMobile }: EducationalResourcesSectionProps) => (
  <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
    <div className="space-y-4">
      {resources?.map((resource, index) => (
        <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{resource.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {resource.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
            </div>
            {resource.url && resource.url !== "N/A" && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Visit
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ))}
      {(!resources || resources.length === 0) && (
        <p className="text-center text-muted-foreground">No educational resources available.</p>
      )}
    </div>
  </ScrollArea>
);