import { ScrollArea } from "@/components/ui/scroll-area";

interface TipsSectionProps {
  tips?: string[];
}

export const TipsSection = ({ tips }: TipsSectionProps) => (
  <ScrollArea className="h-[600px] pr-4">
    <div className="space-y-4">
      {tips?.map((tip, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <p className="text-gray-600">{tip}</p>
        </div>
      ))}
    </div>
  </ScrollArea>
);