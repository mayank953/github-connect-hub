import { Mail, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import WidgetCard from "@/components/WidgetCard";
import PriorityBadge from "@/components/PriorityBadge";
import AiBadge from "@/components/AiBadge";
import { mockEmails, MockEmail } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EmailPulseWidget = () => {
  const [emails, setEmails] = useState<MockEmail[]>(mockEmails);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAction = (id: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, actioned: true } : e));
    toast.success("Email marked as actioned");
  };

  const unreadCount = emails.filter(e => !e.actioned).length;
  const highPriority = emails.filter(e => e.priority === "high" && !e.actioned).length;

  return (
    <WidgetCard
      title="Email Pulse"
      icon={<Mail className="w-4 h-4" />}
      badge={
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{unreadCount} unread</span>
          {highPriority > 0 && (
            <span className="text-[10px] font-bold bg-priority-high/10 text-priority-high px-1.5 py-0.5 rounded">{highPriority} urgent</span>
          )}
        </div>
      }
    >
      <div className="space-y-1.5">
        {emails.map((email) => (
          <div
            key={email.id}
            className={cn(
              "rounded-md border border-border transition-all",
              email.actioned ? "opacity-40 bg-secondary/30" : "bg-secondary"
            )}
          >
            <button
              className="w-full p-2.5 text-left"
              onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-semibold text-foreground truncate">{email.sender}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{email.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{email.subject}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <PriorityBadge priority={email.priority} />
                  {expandedId === email.id ? (
                    <ChevronUp className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>

            {expandedId === email.id && (
              <div className="px-2.5 pb-2.5 animate-fade-in">
                <div className="p-2 rounded bg-muted/50 border border-border mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <AiBadge />
                    <span className="text-[10px] text-muted-foreground">Summary</span>
                  </div>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">{email.summary}</p>
                </div>
                {!email.actioned && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] gap-1"
                    onClick={(e) => { e.stopPropagation(); handleAction(email.id); }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Actioned
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default EmailPulseWidget;
