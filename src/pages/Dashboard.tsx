import AppLayout from "@/components/AppLayout";
import MyDayWidget from "@/components/widgets/MyDayWidget";
import KPIStatsBar from "@/components/widgets/KPIStatsBar";
import MeetingsWidget from "@/components/widgets/MeetingsWidget";
import EmailPulseWidget from "@/components/widgets/EmailPulseWidget";
import ActionItemsWidget from "@/components/widgets/ActionItemsWidget";
import NewsWidget from "@/components/widgets/NewsWidget";
import RevenuePLWidget from "@/components/widgets/RevenuePLWidget";
import TeamPerformanceWidget from "@/components/widgets/TeamPerformanceWidget";

const Dashboard = () => (
  <AppLayout>
    <div className="space-y-4">
      <MyDayWidget />
      <KPIStatsBar />

      {/* Row 1: Meetings + Email + Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <MeetingsWidget />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <EmailPulseWidget />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <ActionItemsWidget />
        </div>
      </div>

      {/* Row 2: Revenue & P&L + Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <RevenuePLWidget />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <TeamPerformanceWidget />
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <NewsWidget />
      </div>
    </div>
  </AppLayout>
);

export default Dashboard;
