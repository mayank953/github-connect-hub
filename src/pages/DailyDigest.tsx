import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AiBadge from "@/components/AiBadge";
import {
  Mail, Calendar, CheckSquare, AlertTriangle, TrendingUp, TrendingDown,
  Sparkles, Send, Clock, Hash, DollarSign, Shield, Loader2,
  ArrowUpRight, ArrowDownRight, Target, Activity, BarChart3, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sendSlackMessage } from "@/lib/api";

/* ── KPI card data ─────────────────────────────────────────────── */
const kpis = [
  { label: "AUM", value: "₹88,400 Cr", change: "+14.2%", positive: true, target: "₹85,000 Cr", icon: DollarSign },
  { label: "Net Interest Margin", value: "7.8%", change: "+0.4pp", positive: true, target: "7.5%", icon: TrendingUp },
  { label: "Net Profit", value: "₹580 Cr", change: "+18.3%", positive: true, target: "₹550 Cr", icon: BarChart3 },
  { label: "NPA Ratio", value: "1.82%", change: "↓0.15%", positive: true, target: "<2.0%", icon: Shield },
];

/* ── Section data ──────────────────────────────────────────────── */
const riskItems = [
  { text: "MSME Default Alerts", value: "18", status: "critical" as const, detail: "+22% — above 15 threshold" },
  { text: "Collection Efficiency", value: "97.3%", status: "warning" as const, detail: "target is 98%" },
  { text: "Personal Loan Delinquency", value: "2.1%", status: "warning" as const, detail: "+8% QoQ — needs attention" },
  { text: "Housing NPA", value: "1.4%", status: "warning" as const, detail: "within acceptable range" },
];

const alertItems = [
  { text: "Q1 AUM report due for board — presentation Friday", severity: "critical" as const },
  { text: "MSME default model threshold review pending — false negatives up 12%", severity: "critical" as const },
  { text: "NPA provisioning report due for RBI submission", severity: "warning" as const },
  { text: "Co-lending API integration with SBI at 70% — deadline approaching", severity: "warning" as const },
];

const scheduleItems = [
  { time: "10:00 AM", title: "Retail Lending Portfolio Review", attendees: 5, tag: "Q1 disbursement data" },
  { time: "2:00 PM", title: "MSME Risk Analytics Sync", attendees: 3, tag: "A/B test results ready" },
  { time: "4:30 PM", title: "Digital Lending Platform Walkthrough", attendees: 6, tag: "Co-lending API" },
  { time: "6:00 PM", title: "Wealth & Investment Strategy", attendees: 4, tag: "MF cross-sell" },
];

const emailItems = [
  { from: "Rajiv Sabharwal", subject: "Urgent: Q1 AUM Review & Board Presentation", priority: "high" as const },
  { from: "Risk Team", subject: "MSME Default Model Threshold Change - Review Needed", priority: "high" as const },
  { from: "Sarosh Amaria", subject: "Housing Finance NPA Provisioning Update", priority: "medium" as const },
  { from: "Abonty Banerjee", subject: "Co-Lending Partnership Brief", priority: "low" as const },
];

const actionItems = [
  { text: "Prepare Q1 AUM growth presentation for board", status: "overdue" as const, owner: "Mayank" },
  { text: "Finalize NPA provisioning report for RBI", status: "today" as const, owner: "Sarosh Amaria" },
  { text: "Review MSME default model threshold changes (0.85 → 0.78)", status: "tomorrow" as const, owner: "Risk Team" },
  { text: "Schedule co-lending API integration review", status: "week" as const, owner: "Abonty" },
];

/* ── Component ─────────────────────────────────────────────────── */
const DailyDigest = () => {
  const [sending, setSending] = useState(false);
  const [sendingSlack, setSendingSlack] = useState(false);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const slackMsg = `🌅 *Daily Executive Digest — ${today}*\n\n💰 *Financial Snapshot*\n• Q1 Revenue: ₹100.3 Cr (+13.0%) — above target\n• Operating Margin: 51.8% (+3.6pp)\n• Net Profit: ₹22.2 Cr (+20.7%)\n\n🛡️ *Risk & Compliance*\n• Portfolio Risk Score: 72.4 (↓7.4%)\n• Active Fraud Alerts: 23 (⚠️ above threshold)\n• Fraud Model Accuracy: 94.7%\n\n⚠️ *Priority Alerts*\n• Q1 delinquency report due Friday\n• Fraud model threshold review pending\n• BigQuery costs up 45% MoM\n\n📅 *Today: 4 Meetings* | ✅ *4 Action Items (1 overdue)*\n\n✨ _Focus: Finalize Q1 report and review fraud model A/B test results at 2 PM._`;

  const handleSendSlack = async () => {
    setSendingSlack(true);
    try {
      await sendSlackMessage(slackMsg);
      toast.success("Daily digest sent to Slack!");
    } catch (e: any) {
      toast.error(e.message || "Failed to send to Slack");
    } finally {
      setSendingSlack(false);
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    toast.success("Daily digest sent to your inbox!");
  };

  return (
    <AppLayout>
      <div className="space-y-5 max-w-4xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Daily Digest</h1>
              <AiBadge />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{today} · AI-generated executive briefing</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Generated 7:00 AM
            </span>
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleSendSlack} disabled={sendingSlack}>
              {sendingSlack ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Hash className="w-3.5 h-3.5" />}
              {sendingSlack ? "Sending..." : "Send to Slack"}
            </Button>
            <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={handleSendEmail} disabled={sending}>
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {sending ? "Sending..." : "Send to Email"}
            </Button>
          </div>
        </div>

        {/* ── AI Executive Summary ───────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-card to-accent/10 border border-primary/20 p-5 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10 shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-2">AI Executive Summary</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Good morning, Mayank. <strong className="text-foreground">Q1 revenue hit ₹100.3 Cr</strong>, exceeding
                the ₹95 Cr target by 5.6%. Operating margins improved to 51.8%, the highest in 6 quarters.
                However, <strong className="text-destructive">fraud alerts are at 23</strong> (above the 20-alert threshold)
                and <strong className="text-warning">credit card delinquency rose 12.5% QoQ</strong>.
                Your top priority today is the Q1 delinquency report for Friday's board presentation.
                The fraud model A/B test results are ready for your 2 PM sync — the proposed threshold change from 0.85 to 0.78
                could reduce false negatives by ~40% but may increase false positives by ~8%.
              </p>
            </div>
          </div>
        </div>

        {/* ── KPI Cards Row ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl bg-card border border-border shadow-card p-4 hover:shadow-hover transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <kpi.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                  kpi.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {kpi.positive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
              <div className="mt-2 flex items-center gap-1">
                <Target className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Target: {kpi.target}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column: Risk & Alerts ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {/* Risk & Compliance */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <Shield className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Risk & Compliance</h3>
            </div>
            <div className="space-y-3">
              {riskItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      item.status === "critical" ? "bg-destructive" : "bg-warning"
                    )} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{item.detail}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-bold shrink-0 ml-2",
                    item.status === "critical" ? "text-destructive" : "text-warning"
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Alerts */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-warning/10">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Priority Alerts</h3>
              <span className="text-[9px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full ml-auto">
                {alertItems.filter(a => a.severity === "critical").length} critical
              </span>
            </div>
            <div className="space-y-2.5">
              {alertItems.map((item, i) => (
                <div key={i} className={cn(
                  "px-3 py-2.5 rounded-lg border text-xs leading-relaxed",
                  item.severity === "critical"
                    ? "bg-destructive/5 border-destructive/20 text-foreground"
                    : "bg-warning/5 border-warning/20 text-foreground"
                )}>
                  <div className="flex items-start gap-2">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                      item.severity === "critical" ? "bg-destructive" : "bg-warning"
                    )} />
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Today's Schedule ────────────────────────────────── */}
        <div className="rounded-xl bg-card border border-border shadow-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Today's Schedule</h3>
            <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-auto">
              {scheduleItems.length} meetings
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border hover:bg-card-hover transition-colors">
                <div className="text-center shrink-0 w-14">
                  <p className="text-xs font-bold text-primary">{item.time.split(" ")[0]}</p>
                  <p className="text-[9px] text-muted-foreground">{item.time.split(" ")[1]}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{item.attendees} attendees</span>
                    <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two-column: Emails & Actions ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          {/* Email Highlights */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-info/10">
                <Mail className="w-4 h-4 text-info" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Email Highlights</h3>
            </div>
            <div className="space-y-2">
              {emailItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary border border-border">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                    item.priority === "high" ? "bg-destructive" : item.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                  )} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground">{item.from}</p>
                    <p className="text-xs text-foreground truncate">{item.subject}</p>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0",
                    item.priority === "high" ? "bg-destructive/10 text-destructive" : item.priority === "medium" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  )}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items Due */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-warning/10">
                <CheckSquare className="w-4 h-4 text-warning" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Action Items Due</h3>
              <span className="text-[9px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full ml-auto">
                1 overdue
              </span>
            </div>
            <div className="space-y-2">
              {actionItems.map((item, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-lg border",
                  item.status === "overdue" ? "bg-destructive/5 border-destructive/20" : "bg-secondary border-border"
                )}>
                  <span className={cn(
                    "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 w-16 text-center",
                    item.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    item.status === "today" ? "bg-primary/10 text-primary" :
                    item.status === "tomorrow" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {item.status}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground truncate">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Actions Footer ───────────────────────────── */}
        <div className="rounded-xl bg-secondary/50 border border-border p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-bold text-foreground">Quick Actions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Open Task Board", icon: Activity },
              { label: "View Analytics", icon: BarChart3 },
              { label: "Check Meeting Notes", icon: Calendar },
              { label: "Review Risk Dashboard", icon: Shield },
            ].map((action) => (
              <Button key={action.label} variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 border-border bg-card hover:bg-card-hover">
                <action.icon className="w-3 h-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DailyDigest;
