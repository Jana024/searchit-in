import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EducationalResource } from "./types";

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
            <div>
              <h4 className="font-semibold mb-1">{resource.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                {resource.type}
              </span>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
      {(!resources || resources.length === 0) && (
        <p className="text-center text-muted-foreground">No educational resources available.</p>
      )}
    </div>
  </ScrollArea>
);