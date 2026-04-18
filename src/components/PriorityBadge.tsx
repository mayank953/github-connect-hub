import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
  className?: string;
}

const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const styles = {
    high: "bg-priority-high/15 text-priority-high border-priority-high/30",
    medium: "bg-priority-medium/15 text-priority-medium border-priority-medium/30",
    low: "bg-priority-low/15 text-priority-low border-priority-low/30",
  };

  return (
    <span className={cn(
      "text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
      styles[priority],
      className
    )}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
