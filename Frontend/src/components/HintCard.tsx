import { Lightbulb } from "lucide-react";
import { Card } from "./ui/card";

interface HintCardProps {
  title: string;
  content: string;
}

export function HintCard({ title, content }: HintCardProps) {
  return (
    <Card className="p-5 bg-[#FFF9E6] border-[#D4A574] shadow-sm">
      <div className="flex gap-3">
        <div className="size-10 rounded-lg bg-[#FFE4A3] flex items-center justify-center flex-shrink-0">
          <Lightbulb className="size-5 text-[#B8860B]" />
        </div>
        <div className="flex-1">
          <h4 className="text-[#5A4A2F] mb-1.5">{title}</h4>
          <p className="text-[#6B6B6B] leading-relaxed">{content}</p>
        </div>
      </div>
    </Card>
  );
}
