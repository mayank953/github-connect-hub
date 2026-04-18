import { useState } from "react";
import { Hash, Clock, CheckSquare, Mail, Sparkles, Eye, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendSlackMessage } from "@/lib/api";

const SlackDigest = () => {
  const [digestTime, setDigestTime] = useState("08:00");
  const [sending, setSending] = useState(false);
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
• 10:00 AM — Credit Risk Review (5 attendees)
• 2:00 PM — Fraud Analytics Sync (3 attendees)
• 4:30 PM — GCP Architecture Walkthrough (6 attendees)

` : ""}${includes.overdue ? `⚠️ *Overdue Action Items*
• 🔴 Send access credentials for Claude Cowork to team
• 🔴 Finalize Q1 delinquency slide deck (Due Today)

` : ""}${includes.emails ? `📧 *Top Priority Emails*
• Anand Kumar — Urgent: Q1 Delinquency Report
• Risk Team — Fraud Model Threshold Change
• Megha Khetarpal — GCP Session Scheduling

` : ""}${includes.focusTip ? `✨ *AI Focus Tip*
_"Prioritize the Q1 delinquency report — it's needed for the board deck by Friday. Block 1 hour before your first meeting to review Anand's data."_` : ""}`;

  const handleSendTest = async () => {
    setSending(true);
    try {
      await sendSlackMessage(previewMessage);
      toast.success("Test digest sent to Slack!");
    } catch (e: any) {
      toast.error(e.message || "Failed to send to Slack");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-3xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-0.5">
            <Hash className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Slack Digest</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure your daily morning brief to post to Slack channel.
          </p>
        </div>

        {/* Schedule */}
        <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Daily Send Time</label>
            <input
              type="time"
              className="w-full max-w-xs bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Include in Digest</h3>
          <div className="space-y-2">
            {[
              { key: "meetings" as const, label: "Today's meetings" },
              { key: "overdue" as const, label: "Overdue action items" },
              { key: "emails" as const, label: "Top 3 priority emails" },
              { key: "focusTip" as const, label: "AI-generated focus tip" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleInclude(key)}
                className={cn(
                  "w-full flex items-center gap-2.5 p-2.5 rounded-md border transition-all text-left text-sm",
                  includes[key]
                    ? "bg-accent border-primary/20 text-foreground"
                    : "bg-secondary border-border text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                  includes[key] ? "bg-primary border-primary" : "border-muted-foreground"
                )}>
                  {includes[key] && <span className="text-primary-foreground text-[10px] font-bold">✓</span>}
                </div>
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            {showPreview ? "Hide" : "Preview"}
          </Button>
          <Button
            onClick={handleSendTest}
            disabled={sending}
            size="sm"
            className="gap-1.5 h-8 text-xs"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {sending ? "Sending..." : "Send Test Now"}
          </Button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Slack Preview</h3>
            </div>
            <div className="bg-secondary rounded-md p-3 border border-border">
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

export default SlackDigest;
