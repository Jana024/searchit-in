import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { SimilarItem } from "./types";

interface SimilarItemsSectionProps {
  items?: SimilarItem[];
}

export const SimilarItemsSection = ({ items }: SimilarItemsSectionProps) => (
  <ScrollArea className="h-[600px] pr-4">
    <div className="space-y-4">
      {items?.map((item, index) => (
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
);