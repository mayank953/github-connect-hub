import { useState } from "react";
import { Send, Clock, CheckSquare, Mail, Sparkles, Bot, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TelegramDigest = () => {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [digestTime, setDigestTime] = useState("08:00");
  const [includes, setIncludes] = useState({
    meetings: true,
    overdue: true,
    emails: true,
    focusTip: true,
  });
  const [showPreview, setShowPreview] = useState(false);

  const toggleInclude = (key: keyof typeof includes) => {
    setIncludes({ ...includes, [key]: !includes[key] });
  };

  const previewMessage = `🌅 *Good Morning, Mayank!*
📅 _Tuesday, March 25, 2026_

${includes.meetings ? `📋 *Today's Meetings (3)*
├ 10:00 AM — Credit Risk Review (5 attendees)
├ 2:00 PM — Fraud Analytics Sync (3 attendees)
└ 4:30 PM — GCP Architecture Walkthrough (6 attendees)

` : ""}${includes.overdue ? `⚠️ *Overdue Action Items*
├ 🔴 Send access credentials for Claude Cowork to team
└ 🔴 Finalize Q1 delinquency slide deck (Due Today)

` : ""}${includes.emails ? `📧 *Top Priority Emails*
├ Anand Kumar — Urgent: Q1 Delinquency Report
├ Risk Team — Fraud Model Threshold Change
└ Megha Khetarpal — GCP Session Scheduling

` : ""}${includes.focusTip ? `✨ *AI Focus Tip*
_"Prioritize the Q1 delinquency report — it's needed for the board deck by Friday. Block 1 hour before your first meeting to review Anand's data."_` : ""}`;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-2.5 mb-1">
            <Send className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Telegram Digest</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your daily digest to receive a morning brief on Telegram.
          </p>
        </div>

        {/* Bot Configuration */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Bot Configuration</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bot Token</label>
              <input
                type="password"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="123456:ABC-DEF..."
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Chat ID</label>
              <input
                type="text"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="-1001234567890"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Daily Schedule</h3>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Send digest at:</label>
            <input
              type="time"
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">every day</span>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Include in Digest</h3>
          <div className="space-y-3">
            {[
              { key: "meetings" as const, icon: <CheckSquare className="w-4 h-4" />, label: "Today's meetings" },
              { key: "overdue" as const, icon: <CheckSquare className="w-4 h-4" />, label: "Overdue action items" },
              { key: "emails" as const, icon: <Mail className="w-4 h-4" />, label: "Top 3 priority emails" },
              { key: "focusTip" as const, icon: <Sparkles className="w-4 h-4" />, label: "AI-generated focus tip" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => toggleInclude(key)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  includes[key]
                    ? "bg-primary/5 border-primary/30 text-foreground"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                  includes[key] ? "bg-primary border-primary" : "border-muted-foreground"
                )}>
                  {includes[key] && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                </div>
                <span className="text-primary">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="border-border bg-secondary hover:bg-secondary/80 text-foreground gap-1.5"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Hide Preview" : "Preview Digest"}
          </Button>
          <Button
            onClick={() => toast.success("Test digest sent to Telegram!")}
            className="gap-1.5"
          >
            <Send className="w-4 h-4" />
            Send Test Digest Now
          </Button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="rounded-2xl bg-card border border-border shadow-card p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Telegram Preview</h3>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <pre className="text-xs text-foreground/90 whitespace-pre-wrap font-mono leading-relaxed">
                {previewMessage}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TelegramDigest;
