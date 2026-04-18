import { cn } from "@/lib/utils";

const SkeletonCard = ({ className, lines = 3 }: { className?: string; lines?: number }) => (
  <div className={cn("rounded-xl bg-card p-5 space-y-3 shadow-card", className)}>
    <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="skeleton-shimmer h-3 rounded-md" style={{ width: `${80 - i * 15}%` }} />
    ))}
  </div>
);

export default SkeletonCard;
