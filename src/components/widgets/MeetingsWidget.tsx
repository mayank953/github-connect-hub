import { Calendar, Users, Clock, FileText, MapPin, Video, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import WidgetCard from "@/components/WidgetCard";
import { mockMeetings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const MeetingsWidget = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const statusStyles = {
    past: { dot: "bg-muted-foreground", card: "opacity-50", label: "Completed", labelClass: "text-muted-foreground bg-muted" },
    current: { dot: "bg-success animate-pulse-dot", card: "border-success/30 bg-success/5", label: "Live Now", labelClass: "text-success bg-success/10" },
    upcoming: { dot: "bg-primary", card: "", label: "Upcoming", labelClass: "text-primary bg-primary/10" },
  };

  const currentMeeting = mockMeetings.find(m => m.status === "current");

  return (
    <WidgetCard
      title="Today's Meetings"
      icon={<Calendar className="w-4 h-4" />}
      badge={<span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{mockMeetings.length}</span>}
    >
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-1">
          {mockMeetings.map((meeting) => {
            const styles = statusStyles[meeting.status];
            const isExpanded = expandedId === meeting.id;

            return (
              <div key={meeting.id} className="relative">
                <button
                  className={cn(
                    "w-full text-left pl-6 pr-2 py-2.5 rounded-lg border border-transparent transition-all hover:bg-card-hover",
                    styles.card,
                    isExpanded && "bg-secondary border-border"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : meeting.id)}
                >
                  {/* Dot on timeline */}
                  <div className={cn("absolute left-1 top-4 w-3 h-3 rounded-full border-2 border-card z-10", styles.dot)} />

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-xs font-semibold text-foreground truncate">{meeting.title}</h4>
                        <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", styles.labelClass)}>
                          {styles.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time} – {meeting.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {meeting.attendees}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground mt-1" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mt-1" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="ml-6 mr-2 mb-2 space-y-2 animate-fade-in">
                    {/* Key Topics */}
                    <div className="flex flex-wrap gap-1">
                      {meeting.keyTopics.map(topic => (
                        <span key={topic} className="text-[10px] font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Prep Notes */}
                    {meeting.prepNotes && (
                      <div className="p-2.5 rounded-md bg-warning/5 border border-warning/20">
                        <p className="text-[10px] font-semibold text-warning mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Meeting Prep
                        </p>
                        <p className="text-[11px] text-foreground/80 leading-relaxed">{meeting.prepNotes}</p>
                      </div>
                    )}

                    {/* Organizer */}
                    {meeting.organizer && (
                      <p className="text-[10px] text-muted-foreground">
                        Organized by <span className="font-semibold text-foreground">{meeting.organizer}</span>
                      </p>
                    )}

                    {/* Post-meeting notes */}
                    {meeting.status === "past" && (
                      <div>
                        <textarea
                          className="w-full bg-secondary border border-border rounded-md p-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={2}
                          placeholder="Add post-meeting notes & action items..."
                          value={notes[meeting.id] || ""}
                          onChange={(e) => setNotes({ ...notes, [meeting.id]: e.target.value })}
                        />
                        <Button size="sm" className="mt-1 h-6 text-[10px]" onClick={() => { toast.success("Notes saved!"); }}>
                          Save Notes
                        </Button>
                      </div>
                    )}

                    {/* Join button for current/upcoming */}
                    {(meeting.status === "current" || meeting.status === "upcoming") && (
                      <Button
                        variant={meeting.status === "current" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => toast.info("Opening meeting link...")}
                      >
                        <Video className="w-3 h-3" />
                        {meeting.status === "current" ? "Join Now" : "Join Meeting"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
};

export default MeetingsWidget;
