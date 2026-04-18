import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Brain, MessageSquare, Settings,
  Newspaper, Sun, Moon, Kanban, BarChart3, FileText, Sheet, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import tataCapitalLogo from "@/assets/tata-capital-logo.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ai-assistant", label: "Pulse AI", icon: Bot },
  { path: "/kanban", label: "Task Board", icon: Kanban },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/daily-digest", label: "Daily Digest", icon: FileText },
  { path: "/data-sheet", label: "Data Sheet", icon: Sheet },
  { path: "/meeting-intelligence", label: "Meeting Intel", icon: Brain },
  { path: "/news", label: "Market News", icon: Newspaper },
  { path: "/slack-digest", label: "Slack Digest", icon: MessageSquare },
  { path: "/settings", label: "Settings", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const { darkMode, setDarkMode } = useAppContext();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border flex flex-col z-30">
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img src={tataCapitalLogo} alt="Tata Capital" className="h-20 w-auto" />
        </div>
        <p className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase mt-1">AI Command Center</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {darkMode ? "Dark" : "Light"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
