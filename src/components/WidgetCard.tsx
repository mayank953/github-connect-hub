import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const WidgetCard = ({ title, icon, badge, actions, children, className }: WidgetCardProps) => (
  <div className={cn(
    "rounded-lg bg-card border border-border shadow-card overflow-hidden",
    className
  )}>
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {badge}
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
    <div className="px-4 pb-4">{children}</div>
  </div>
);

export default WidgetCard;
