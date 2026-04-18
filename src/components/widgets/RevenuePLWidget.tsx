import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import WidgetCard from "@/components/WidgetCard";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "AUM (Q1)", value: "₹88,400Cr", change: "+14.2%", trend: "up" as const },
  { label: "Net Interest Margin", value: "7.8%", change: "+0.4pp", trend: "up" as const },
  { label: "Net Profit", value: "₹580Cr", change: "+18.3%", trend: "up" as const },
  { label: "Cost-to-Income", value: "42.1%", change: "-2.8pp", trend: "down" as const },
];

const segments = [
  { name: "Retail Lending", revenue: "₹32,500Cr", pct: 36.8, color: "bg-primary" },
  { name: "Housing Finance", revenue: "₹24,500Cr", pct: 27.7, color: "bg-info" },
  { name: "MSME Loans", revenue: "₹18,200Cr", pct: 20.6, color: "bg-success" },
  { name: "Wealth & Others", revenue: "₹13,200Cr", pct: 14.9, color: "bg-warning" },
];

const RevenuePLWidget = () => (
  <WidgetCard
    title="Revenue & P&L"
    icon={<DollarSign className="w-4 h-4" />}
    badge={
      <span className="text-[10px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded">
        Q1 FY26
      </span>
    }
  >
    {/* Key Metrics */}
    <div className="grid grid-cols-2 gap-2 mb-4">
      {metrics.map((m) => (
        <div key={m.label} className="p-2.5 rounded-md bg-secondary border border-border">
          <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-sm font-bold text-foreground">{m.value}</p>
            <span className={cn(
              "text-[10px] font-semibold flex items-center gap-0.5",
              m.trend === "up" ? "text-success" : "text-destructive"
            )}>
              {m.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {m.change}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Segment Breakdown */}
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revenue by Segment</p>
    <div className="space-y-2">
      {segments.map((seg) => (
        <div key={seg.name}>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-medium text-foreground">{seg.name}</span>
            <span className="text-[10px] text-muted-foreground">{seg.revenue} ({seg.pct}%)</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", seg.color)} style={{ width: `${seg.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </WidgetCard>
);

export default RevenuePLWidget;
