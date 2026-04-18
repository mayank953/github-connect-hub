import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "in-progress" | "done";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles = {
    pending: "bg-muted text-muted-foreground",
    "in-progress": "bg-primary/15 text-primary",
    done: "bg-success/15 text-success",
  };

  const labels = {
    pending: "Pending",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <span className={cn(
      "text-xs font-medium px-2.5 py-1 rounded-md",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
