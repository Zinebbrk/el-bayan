interface ProgressBarProps {
  progress: number;
  total: number;
  label?: string;
}

export function ProgressBar({ progress, total, label }: ProgressBarProps) {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-muted-foreground">{progress}/{total}</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-[#E8E2D5] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#6B8F3D] transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
