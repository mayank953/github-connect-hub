import { Shield, AlertTriangle, Activity, Target, CheckSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { mockKPIs } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  shield: Shield,
  alert: AlertTriangle,
  activity: Activity,
  target: Target,
  tasks: CheckSquare,
};

const KPIStatsBar = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-in">
    {mockKPIs.map((kpi, i) => {
      const Icon = iconMap[kpi.icon] || Activity;
      const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
      const trendColor = kpi.icon === "alert"
        ? (kpi.trend === "up" ? "text-destructive" : "text-success")
        : (kpi.trend === "up" ? "text-success" : kpi.trend === "down" ? "text-destructive" : "text-muted-foreground");

      return (
        <div
          key={kpi.label}
          className="rounded-lg bg-card border border-border shadow-card p-4 hover:shadow-hover transition-shadow"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className={cn("flex items-center gap-0.5 text-[11px] font-semibold", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              {kpi.change}
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{kpi.label}</p>
        </div>
      );
    })}
  </div>
);

export default KPIStatsBar;
