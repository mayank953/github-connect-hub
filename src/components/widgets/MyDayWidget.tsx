import { Sun, Moon, CloudSun, Hash, Sparkles, Calendar, Mail, CheckSquare, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AiBadge from "@/components/AiBadge";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "sonner";
import { sendSlackMessage } from "@/lib/api";

const MyDayWidget = () => {
  const { userName } = useAppContext();
  const [sending, setSending] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const Icon = hour < 12 ? Sun : hour < 17 ? CloudSun : Moon;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const aiSummary = "You have 4 meetings today, 2 urgent emails from Rajiv Sabharwal and the Risk Team, and 1 overdue action item. Focus on the Q1 AUM board presentation — it's due this Friday.";

  const quickStats = [
    { icon: Calendar, label: "4 Meetings", color: "text-primary" },
    { icon: Mail, label: "2 Urgent", color: "text-destructive" },
    { icon: CheckSquare, label: "7 Tasks", color: "text-warning" },
    { icon: AlertTriangle, label: "1 Overdue", color: "text-destructive" },
  ];

  const handleSendSlack = async () => {
    setSending(true);
    try {
      await sendSlackMessage(`*${greeting}, ${userName}!*\n📅 ${today}\n\n${aiSummary}`);
      toast.success("Morning brief sent to Slack!");
    } catch (e: any) {
      toast.error(e.message || "Failed to send to Slack");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden animate-fade-in">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">{today}</p>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Icon className="w-5 h-5 text-warning" />
              {greeting}, {userName}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendSlack}
            disabled={sending}
            className="text-xs gap-1.5 h-8"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Hash className="w-3.5 h-3.5" />}
            {sending ? "Sending..." : "Send to Slack"}
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-3 mb-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[11px] font-semibold text-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-md bg-secondary border border-border">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">AI Daily Brief</span>
                <AiBadge />
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{aiSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDayWidget;
