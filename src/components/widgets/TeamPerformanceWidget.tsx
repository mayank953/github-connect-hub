import { Users, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import WidgetCard from "@/components/WidgetCard";
import { cn } from "@/lib/utils";

const teamMembers = [
  { name: "Mayank", role: "Lead", completed: 12, pending: 3, overdue: 1, velocity: 92, avatar: "M" },
  { name: "Rajiv S.", role: "CEO", completed: 9, pending: 4, overdue: 0, velocity: 88, avatar: "RS" },
  { name: "Sarosh A.", role: "Housing Finance", completed: 15, pending: 2, overdue: 0, velocity: 95, avatar: "SA" },
  { name: "Abonty B.", role: "Digital Lending", completed: 7, pending: 5, overdue: 2, velocity: 74, avatar: "AB" },
  { name: "Vivek S.", role: "Wealth Mgmt", completed: 11, pending: 3, overdue: 1, velocity: 85, avatar: "VS" },
];

const TeamPerformanceWidget = () => {
  const totalCompleted = teamMembers.reduce((s, m) => s + m.completed, 0);
  const totalPending = teamMembers.reduce((s, m) => s + m.pending, 0);
  const totalOverdue = teamMembers.reduce((s, m) => s + m.overdue, 0);

  return (
    <WidgetCard
      title="Team Performance"
      icon={<Users className="w-4 h-4" />}
      badge={
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded">{totalCompleted} done</span>
          <span className="text-[10px] font-bold bg-warning/10 text-warning px-1.5 py-0.5 rounded">{totalPending} pending</span>
        </div>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-md bg-success/10 border border-success/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-success mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">{totalCompleted}</p>
          <p className="text-[9px] text-muted-foreground">Completed</p>
        </div>
        <div className="text-center p-2 rounded-md bg-warning/10 border border-warning/20">
          <Clock className="w-3.5 h-3.5 text-warning mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">{totalPending}</p>
          <p className="text-[9px] text-muted-foreground">In Progress</p>
        </div>
        <div className="text-center p-2 rounded-md bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">{totalOverdue}</p>
          <p className="text-[9px] text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-2">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-center gap-3 p-2 rounded-md bg-secondary border border-border hover:bg-card-hover transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-primary">{member.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  member.velocity >= 90 ? "bg-success/10 text-success" :
                  member.velocity >= 80 ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                )}>
                  {member.velocity}%
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[9px] text-muted-foreground">{member.role}</span>
                <span className="text-[9px] text-success">{member.completed} done</span>
                {member.overdue > 0 && <span className="text-[9px] text-destructive">{member.overdue} overdue</span>}
              </div>
              {/* Velocity bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className={cn("h-full rounded-full transition-all",
                    member.velocity >= 90 ? "bg-success" : member.velocity >= 80 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${member.velocity}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default TeamPerformanceWidget;
