import { Star } from "lucide-react";
import { Badge } from "./ui/badge";

interface GamificationBadgeProps {
  type: "xp" | "level";
  value: number | string;
  label?: string;
}

export function GamificationBadge({ type, value, label }: GamificationBadgeProps) {
  return (
    <Badge variant="outline" className="px-2.5 py-1 gap-1.5 bg-white border-[#D4A574] text-foreground">
      <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
      <span>{type === "xp" ? `+${value} XP` : value}</span>
      {label && <span className="opacity-70">{label}</span>}
    </Badge>
  );
}
