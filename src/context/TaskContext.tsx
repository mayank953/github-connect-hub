import React, { createContext, useContext, useState, ReactNode } from "react";
import { ActionItem, mockActionItems } from "@/data/mockData";
import { toast } from "sonner";

interface TaskContextType {
  tasks: ActionItem[];
  addTask: (task: Omit<ActionItem, "id">) => void;
  updateTask: (id: string, updates: Partial<ActionItem>) => void;
  deleteTask: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  setTasks: () => {},
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<ActionItem[]>(mockActionItems);

  const addTask = (task: Omit<ActionItem, "id">) => {
    const newTask: ActionItem = { ...task, id: Date.now().toString() + Math.random().toString(36).slice(2) };
    setTasks(prev => [newTask, ...prev]);
    toast.success(`Task "${newTask.title}" added to board`);
  };

  const updateTask = (id: string, updates: Partial<ActionItem>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success("Task deleted");
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
