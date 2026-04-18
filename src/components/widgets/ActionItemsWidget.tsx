import { CheckSquare, Plus, Hash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import WidgetCard from "@/components/WidgetCard";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { mockActionItems, ActionItem } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ActionItemsWidget = () => {
  const [items, setItems] = useState<ActionItem[]>(mockActionItems);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filteredItems = items.filter((item) => {
    if (filter === "today") return item.dueLabel === "Due Today" || item.dueLabel === "Overdue";
    if (filter === "week") return ["Due Today", "Overdue", "Due Tomorrow", "This Week"].includes(item.dueLabel);
    return true;
  });

  const cycleStatus = (id: string) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const next = item.status === "pending" ? "in-progress" : item.status === "in-progress" ? "done" : "pending";
      return { ...item, status: next };
    }));
  };

  const addItem = () => {
    if (!newTitle.trim()) return;
    const newItem: ActionItem = {
      id: Date.now().toString(),
      title: newTitle,
      source: "Manual",
      dueDate: new Date().toISOString().split("T")[0],
      dueLabel: "Due Today",
      status: "pending",
      priority: "medium",
      owner: "Mayank",
    };
    setItems([newItem, ...items]);
    setNewTitle("");
    setShowAdd(false);
    toast.success("Action item added!");
  };

  const activeCount = items.filter(i => i.status !== "done").length;
  const overdueCount = items.filter(i => i.dueLabel === "Overdue" && i.status !== "done").length;

  return (
    <WidgetCard
      title="Action Items"
      icon={<CheckSquare className="w-4 h-4" />}
      badge={
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold bg-warning/10 text-warning px-1.5 py-0.5 rounded">{activeCount} active</span>
          {overdueCount > 0 && (
            <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{overdueCount} overdue</span>
          )}
        </div>
      }
      actions={
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      }
    >
      {/* Filter */}
      <div className="flex gap-1.5 mb-3">
        {(["all", "today", "week"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider transition-colors",
              filter === f
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? "All" : f === "today" ? "Today" : "This Week"}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="flex gap-2 mb-3 animate-fade-in">
          <input
            type="text"
            className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="New action item..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button size="sm" onClick={addItem} className="h-9">Add</Button>
        </div>
      )}

      {/* Items */}
      <div className="space-y-1.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-2.5 rounded-md bg-secondary border border-border transition-all cursor-pointer hover:bg-card-hover",
              item.dueLabel === "Overdue" && item.status !== "done" && "border-destructive/30"
            )}
            onClick={() => cycleStatus(item.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-medium text-foreground",
                  item.status === "done" && "line-through opacity-50"
                )}>
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {item.owner && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <User className="w-2.5 h-2.5" />
                      {item.owner}
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] font-semibold",
                    item.dueLabel === "Overdue" ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {item.dueLabel}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <PriorityBadge priority={item.priority} className="text-[8px] px-1.5 py-0" />
                <StatusBadge status={item.status} className="text-[8px] px-1.5 py-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default ActionItemsWidget;
