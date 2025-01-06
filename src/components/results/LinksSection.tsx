import { ExternalLink, ShoppingCart, Youtube, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LinksSectionProps {
  links?: string[];
  isMobile?: boolean;
}

export const LinksSection = ({ links, isMobile }: LinksSectionProps) => {
  const getLinkIcon = (url: string) => {
    if (url.includes('amazon.com')) return <ShoppingCart className="h-4 w-4" />;
    if (url.includes('youtube.com')) return <Youtube className="h-4 w-4" />;
    if (url.includes('google.com')) return <Search className="h-4 w-4" />;
    return <ExternalLink className="h-4 w-4" />;
  };

  const getLinkType = (url: string) => {
    if (url.includes('amazon.com')) return 'Amazon';
    if (url.includes('ebay.com')) return 'eBay';
    if (url.includes('walmart.com')) return 'Walmart';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('google.com')) return 'Google';
    return 'External Link';
  };

  return (
    <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
      <div className="space-y-4">
        {links?.map((link, index) => (
          <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getLinkIcon(link)}
                <Badge variant="secondary">{getLinkType(link)}</Badge>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Visit
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
        {(!links || links.length === 0) && (
          <p className="text-center text-muted-foreground">No relevant links available.</p>
        )}
      </div>
    </ScrollArea>
  );
};