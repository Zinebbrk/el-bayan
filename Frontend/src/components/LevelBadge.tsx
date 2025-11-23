import { Badge } from "./ui/badge";

interface LevelBadgeProps {
  level: "Beginner" | "Intermediate" | "Advanced";
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const styles = {
    Beginner: "bg-[#D4F1E8] text-[#0F7B5E] border-[#0F7B5E]/20",
    Intermediate: "bg-[#FFF4DC] text-[#B8860B] border-[#B8860B]/20",
    Advanced: "bg-[#FFE4E8] text-[#C41E3A] border-[#C41E3A]/20"
  };

  return (
    <Badge variant="outline" className={`px-2.5 py-0.5 ${styles[level]}`}>
      {level}
    </Badge>
  );
}
