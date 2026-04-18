import { useState } from "react";
import {
  Plus, Calendar as CalendarIcon, User, Trash2, Edit2, Search,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AppLayout from "@/components/AppLayout";
import PriorityBadge from "@/components/PriorityBadge";
import { ActionItem } from "@/data/mockData";
import { useTaskContext } from "@/context/TaskContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

type Column = { id: ActionItem["status"]; label: string; color: string; bgAccent: string };

const columns: Column[] = [
  { id: "pending", label: "To Do", color: "border-t-muted-foreground", bgAccent: "bg-muted/30" },
  { id: "in-progress", label: "In Progress", color: "border-t-primary", bgAccent: "bg-primary/5" },
  { id: "done", label: "Done", color: "border-t-success", bgAccent: "bg-success/5" },
];

const owners = ["Mayank", "Anand Kumar", "Megha Khetarpal", "Biswajit", "Risk Team"];

const KanbanBoard = () => {
  const { tasks: items, setTasks: setItems, deleteTask: removeTask } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newOwner, setNewOwner] = useState("Mayank");
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);

  const filteredItems = items.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPriority !== "all" && item.priority !== filterPriority) return false;
    if (filterOwner !== "all" && item.owner !== filterOwner) return false;
    return true;
  });

  const getColumnItems = (status: ActionItem["status"]) =>
    filteredItems.filter(i => i.status === status);

  const onDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as ActionItem["status"];
    const item = items.find(i => i.id === draggableId);
    if (!item || item.status === newStatus) return;
    setItems(items.map(i => i.id === draggableId ? { ...i, status: newStatus } : i));
    toast.success(`Task moved to ${columns.find(c => c.id === newStatus)?.label}`);
  };

  const createTask = () => {
    if (!newTitle.trim()) return;
    const task: ActionItem = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      source: "Kanban Board",
      dueDate: newDueDate ? format(newDueDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      dueLabel: newDueDate ? format(newDueDate, "MMM d") : "No date",
      status: "pending",
      priority: newPriority,
      owner: newOwner,
    };
    setItems([task, ...items]);
    resetForm();
    setShowCreateDialog(false);
    toast.success("Task created!");
  };

  const updateTask = () => {
    if (!editingItem) return;
    setItems(items.map(item =>
      item.id === editingItem.id ? {
        ...editingItem,
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        owner: newOwner,
        dueDate: newDueDate ? format(newDueDate, "yyyy-MM-dd") : item.dueDate,
        dueLabel: newDueDate ? format(newDueDate, "MMM d") : item.dueLabel,
      } : item
    ));
    resetForm();
    setEditingItem(null);
    toast.success("Task updated!");
  };

  const handleDeleteTask = (id: string) => {
    removeTask(id);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setNewOwner("Mayank");
    setNewDueDate(undefined);
  };

  const startEditing = (item: ActionItem) => {
    setEditingItem(item);
    setNewTitle(item.title);
    setNewDescription(item.description || "");
    setNewPriority(item.priority);
    setNewOwner(item.owner || "Mayank");
    setNewDueDate(item.dueDate ? new Date(item.dueDate) : undefined);
  };

  const columnCounts = {
    pending: getColumnItems("pending").length,
    "in-progress": getColumnItems("in-progress").length,
    done: getColumnItems("done").length,
  };

  return (
    <AppLayout>
      <div className="space-y-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-lg font-bold text-foreground">Task Board</h1>
            <p className="text-xs text-muted-foreground">{items.length} tasks · {items.filter(i => i.status !== "done").length} active</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 h-8 text-xs">
                <Plus className="w-3.5 h-3.5" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                title={newTitle} setTitle={setNewTitle}
                description={newDescription} setDescription={setNewDescription}
                priority={newPriority} setPriority={setNewPriority}
                owner={newOwner} setOwner={setNewOwner}
                dueDate={newDueDate} setDueDate={setNewDueDate}
                onSubmit={createTask} submitLabel="Create Task"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              className="w-full bg-secondary border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
          >
            <option value="all">All Owners</option>
            {owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Kanban Columns with DnD */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {columns.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "rounded-lg bg-card border border-border border-t-4 shadow-card min-h-[400px] transition-all",
                      col.color,
                      snapshot.isDraggingOver && "ring-2 ring-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                        <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                          {columnCounts[col.id]}
                        </span>
                      </div>
                      <Button
                        variant="ghost" size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => { resetForm(); setShowCreateDialog(true); }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="px-3 pb-3 space-y-2">
                      {getColumnItems(col.id).map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-3 rounded-md bg-secondary border border-border transition-all hover:shadow-hover hover:border-primary/20 group",
                                snapshot.isDragging && "shadow-lg ring-2 ring-primary/20 rotate-1",
                                item.dueLabel === "Overdue" && item.status !== "done" && "border-l-2 border-l-destructive"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className={cn(
                                  "text-xs font-medium text-foreground leading-relaxed flex-1",
                                  item.status === "done" && "line-through opacity-60"
                                )}>
                                  {item.title}
                                </p>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button className="p-1 rounded hover:bg-muted" onClick={(e) => { e.stopPropagation(); startEditing(item); }}>
                                    <Edit2 className="w-3 h-3 text-muted-foreground" />
                                  </button>
                                  <button className="p-1 rounded hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteTask(item.id); }}>
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </button>
                                </div>
                              </div>

                              {item.description && (
                                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <PriorityBadge priority={item.priority} className="text-[8px] px-1.5 py-0" />
                                  {item.owner && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <User className="w-2.5 h-2.5" />
                                      {item.owner.split(" ")[0]}
                                    </span>
                                  )}
                                </div>
                                {item.dueLabel && (
                                  <span className={cn(
                                    "text-[10px] font-medium flex items-center gap-0.5",
                                    item.dueLabel === "Overdue" ? "text-destructive" : "text-muted-foreground"
                                  )}>
                                    <CalendarIcon className="w-2.5 h-2.5" />
                                    {item.dueLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {getColumnItems(col.id).length === 0 && (
                        <div className="py-8 text-center">
                          <p className="text-[11px] text-muted-foreground">No tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            title={newTitle} setTitle={setNewTitle}
            description={newDescription} setDescription={setNewDescription}
            priority={newPriority} setPriority={setNewPriority}
            owner={newOwner} setOwner={setNewOwner}
            dueDate={newDueDate} setDueDate={setNewDueDate}
            onSubmit={updateTask} submitLabel="Update Task"
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

interface TaskFormProps {
  title: string; setTitle: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  priority: "high" | "medium" | "low"; setPriority: (v: "high" | "medium" | "low") => void;
  owner: string; setOwner: (v: string) => void;
  dueDate: Date | undefined; setDueDate: (v: Date | undefined) => void;
  onSubmit: () => void; submitLabel: string;
}

const TaskForm = ({ title, setTitle, description, setDescription, priority, setPriority, owner, setOwner, dueDate, setDueDate, onSubmit, submitLabel }: TaskFormProps) => (
  <div className="space-y-3">
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
      <input type="text" className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Task title..." value={title} onChange={(e) => setTitle(e.target.value)} />
    </div>
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
      <textarea className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" rows={3} placeholder="Task description..." value={description} onChange={(e) => setDescription(e.target.value)} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
        <select className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Owner</label>
        <select className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" value={owner} onChange={(e) => setOwner(e.target.value)}>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left text-sm font-normal h-9", !dueDate && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
    <Button onClick={onSubmit} className="w-full h-9 text-sm">{submitLabel}</Button>
  </div>
);

export default KanbanBoard;
