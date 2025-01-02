import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { SimilarItem } from "./types";

interface SimilarItemsSectionProps {
  items?: SimilarItem[];
  isMobile?: boolean;
}

export const SimilarItemsSection = ({ items, isMobile }: SimilarItemsSectionProps) => (
  <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
    <div className="space-y-3 sm:space-y-4">
      {items?.map((item, index) => (
        <div key={index} className="p-3 sm:p-4 border rounded-lg hover:border-primary transition-colors">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm sm:text-base">{item.name}</h4>
            <Badge variant="secondary" className="w-fit">{item.similarity}% match</Badge>
          </div>
          {item.price && (
            <p className="text-xs sm:text-sm text-gray-600 font-medium">{item.price}</p>
          )}
          {item.purchase_url && (
            <a
              href={item.purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 mt-2"
            >
              View Product <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          )}
        </div>
      ))}
    </div>
  </ScrollArea>
);