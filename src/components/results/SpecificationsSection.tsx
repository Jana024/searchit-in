import { Cpu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpecificationsSectionProps {
  specifications?: Record<string, string>;
  isMobile?: boolean;
}

export const SpecificationsSection = ({ specifications, isMobile }: SpecificationsSectionProps) => (
  <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[600px]'} pr-4`}>
    <div className="space-y-4">
      {specifications && Object.keys(specifications).length > 0 ? (
        <div className="grid gap-4">
          {Object.entries(specifications).map(([key, value], index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm">{key}</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No specifications available.</p>
      )}
    </div>
  </ScrollArea>
);