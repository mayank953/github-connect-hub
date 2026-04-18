import { useState } from "react";
import { Settings as SettingsIcon, MessageSquare, Bell, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const { userName, setUserName } = useAppContext();
  const [role, setRole] = useState("Senior Analytics Lead");
  const [notifications, setNotifications] = useState({
    dailyDigest: true,
    meetingReminders: true,
    overdueAlerts: true,
    emailSummaries: false,
  });

  return (
    <AppLayout>
      <div className="space-y-4 max-w-3xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-0.5">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-xs text-muted-foreground">Configure your TransUnion AI Command Center.</p>
        </div>

        {/* Profile */}
        <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
              <input
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Role</label>
              <input
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Integrations</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary border border-border">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">Slack</p>
                  <p className="text-[10px] text-muted-foreground">Connected — sending digests</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-success font-semibold">
                <Check className="w-3 h-3" />
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg bg-card border border-border shadow-card p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="space-y-1.5">
            {Object.entries(notifications).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className="w-full flex items-center justify-between p-2.5 rounded-md bg-secondary border border-border text-left"
              >
                <span className="text-xs text-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className={cn(
                  "w-8 h-4 rounded-full transition-colors relative",
                  value ? "bg-primary" : "bg-muted"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all",
                    value ? "left-4" : "left-0.5"
                  )} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button size="sm" onClick={() => toast.success("Settings saved!")} className="h-8 text-xs">
          Save Settings
        </Button>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
