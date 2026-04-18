import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { TaskProvider } from "@/context/TaskContext";
import Dashboard from "./pages/Dashboard";
import MeetingIntelligence from "./pages/MeetingIntelligence";
import SlackDigest from "./pages/SlackDigest";
import NewsPage from "./pages/NewsPage";
import SettingsPage from "./pages/SettingsPage";
import KanbanBoard from "./pages/KanbanBoard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DailyDigest from "./pages/DailyDigest";
import DataSheetView from "./pages/DataSheetView";
import AiAssistant from "./pages/AiAssistant";
import NotFound from "./pages/NotFound";
import PulseAiWidget from "./components/PulseAiWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/meeting-intelligence" element={<MeetingIntelligence />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/slack-digest" element={<SlackDigest />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/daily-digest" element={<DailyDigest />} />
              <Route path="/data-sheet" element={<DataSheetView />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PulseAiWidget />
          </BrowserRouter>
        </TaskProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
