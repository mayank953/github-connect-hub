import { cn } from "@/lib/utils";

interface AiBadgeProps {
  className?: string;
}

const AiBadge = ({ className }: AiBadgeProps) => (
  <span className={cn("ai-badge text-foreground inline-flex items-center gap-1", className)}>
    ✦ AI
  </span>
);

export default AiBadge;
