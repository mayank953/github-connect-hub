import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, Database, TrendingUp, Users, Mail, Calendar, CheckSquare } from "lucide-react";
import { mockEmails, mockMeetings, mockActionItems, mockKPIs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";

const revenueData = [
  { segment: "Credit Bureau Services", q4Rev: "₹38.2 Cr", q1Rev: "₹42.8 Cr", growth: "+12.0%", margin: "51.8%", clients: 142 },
  { segment: "Fraud Solutions", q4Rev: "₹25.1 Cr", q1Rev: "₹28.3 Cr", growth: "+12.7%", margin: "48.2%", clients: 89 },
  { segment: "Analytics & Insights", q4Rev: "₹17.4 Cr", q1Rev: "₹19.6 Cr", growth: "+12.6%", margin: "62.1%", clients: 56 },
  { segment: "Consumer Direct", q4Rev: "₹8.1 Cr", q1Rev: "₹9.6 Cr", growth: "+18.5%", margin: "44.5%", clients: 1200000 },
];

const teamData = [
  { name: "Anand Kumar", role: "Credit Risk Lead", tasks: 12, completed: 9, overdue: 1, velocity: "92%", focus: "Q1 Delinquency" },
  { name: "Megha Khetarpal", role: "GCP Architect", tasks: 8, completed: 6, overdue: 0, velocity: "88%", focus: "BigQuery Optimization" },
  { name: "Biswajit", role: "Product Strategy", tasks: 6, completed: 4, overdue: 0, velocity: "85%", focus: "Alt Data POC" },
  { name: "Risk Team Lead", role: "Fraud Analytics", tasks: 10, completed: 7, overdue: 2, velocity: "78%", focus: "Model v3.3" },
  { name: "Mayank", role: "VP Analytics", tasks: 7, completed: 5, overdue: 1, velocity: "90%", focus: "Board Prep" },
];

const financialKPIs = [
  { metric: "Total Revenue", q4: "₹88.8 Cr", q1: "₹100.3 Cr", change: "+13.0%", target: "₹95 Cr", status: "Above" },
  { metric: "Operating Margin", q4: "48.2%", q1: "51.8%", change: "+3.6pp", target: "50%", status: "Above" },
  { metric: "Net Profit", q4: "₹18.4 Cr", q1: "₹22.2 Cr", change: "+20.7%", target: "₹20 Cr", status: "Above" },
  { metric: "Bureau Pulls (Monthly)", q4: "11.2K", q1: "14.2K", change: "+26.8%", target: "13K", status: "Above" },
  { metric: "Portfolio Risk Score", q4: "78.2", q1: "72.4", change: "-7.4%", target: "< 75", status: "On Track" },
  { metric: "Fraud Detection Rate", q4: "93.8%", q1: "94.7%", change: "+0.9pp", target: "95%", status: "Near" },
  { metric: "Client Retention", q4: "96.1%", q1: "97.2%", change: "+1.1pp", target: "96%", status: "Above" },
  { metric: "Active Fraud Alerts", q4: "18", q1: "23", change: "+27.8%", target: "< 20", status: "Alert" },
];

const statusColor = (s: string) =>
  s === "Above" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950" :
  s === "On Track" ? "text-primary bg-primary/10" :
  s === "Near" ? "text-warning bg-warning/10" :
  "text-destructive bg-destructive/10";

const DataSheetView = () => {
  const [activeTab, setActiveTab] = useState("financials");

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2">
            <Sheet className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Data Sheet View</h1>
          </div>
          <p className="text-xs text-muted-foreground">Spreadsheet-style view of all dashboard data — demonstrating Google Sheets / database backend capability</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="financials" className="gap-1.5 text-xs"><TrendingUp className="w-3.5 h-3.5" />Financial KPIs</TabsTrigger>
            <TabsTrigger value="revenue" className="gap-1.5 text-xs"><Database className="w-3.5 h-3.5" />Revenue Segments</TabsTrigger>
            <TabsTrigger value="actions" className="gap-1.5 text-xs"><CheckSquare className="w-3.5 h-3.5" />Action Items</TabsTrigger>
            <TabsTrigger value="meetings" className="gap-1.5 text-xs"><Calendar className="w-3.5 h-3.5" />Meetings</TabsTrigger>
            <TabsTrigger value="emails" className="gap-1.5 text-xs"><Mail className="w-3.5 h-3.5" />Emails</TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5 text-xs"><Users className="w-3.5 h-3.5" />Team</TabsTrigger>
          </TabsList>

          {/* Financial KPIs */}
          <TabsContent value="financials">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">📊 Financial KPIs — Q4 FY25 vs Q1 FY26</p>
                <p className="text-[10px] text-muted-foreground">Source: Internal Finance DB · Updated daily</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Metric</TableHead>
                    <TableHead className="text-[11px]">Q4 FY25</TableHead>
                    <TableHead className="text-[11px]">Q1 FY26</TableHead>
                    <TableHead className="text-[11px]">Change</TableHead>
                    <TableHead className="text-[11px]">Target</TableHead>
                    <TableHead className="text-[11px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialKPIs.map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="text-xs font-medium">{row.metric}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.q4}</TableCell>
                      <TableCell className="text-xs font-semibold">{row.q1}</TableCell>
                      <TableCell className={cn("text-xs font-semibold", row.change.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : row.change.startsWith("-") && row.metric === "Portfolio Risk Score" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>{row.change}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.target}</TableCell>
                      <TableCell><span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusColor(row.status))}>{row.status}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Revenue Segments */}
          <TabsContent value="revenue">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">💰 Revenue by Business Segment</p>
                <p className="text-[10px] text-muted-foreground">Source: Finance ERP · Quarterly rollup</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Segment</TableHead>
                    <TableHead className="text-[11px]">Q4 Revenue</TableHead>
                    <TableHead className="text-[11px]">Q1 Revenue</TableHead>
                    <TableHead className="text-[11px]">Growth</TableHead>
                    <TableHead className="text-[11px]">Margin</TableHead>
                    <TableHead className="text-[11px]">Clients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((row) => (
                    <TableRow key={row.segment}>
                      <TableCell className="text-xs font-medium">{row.segment}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.q4Rev}</TableCell>
                      <TableCell className="text-xs font-semibold">{row.q1Rev}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{row.growth}</TableCell>
                      <TableCell className="text-xs">{row.margin}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{typeof row.clients === "number" && row.clients > 1000 ? `${(row.clients / 1000000).toFixed(1)}M` : row.clients}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Action Items */}
          <TabsContent value="actions">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">✅ Action Items Tracker</p>
                <p className="text-[10px] text-muted-foreground">Source: action_items table · Real-time sync</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Title</TableHead>
                    <TableHead className="text-[11px]">Owner</TableHead>
                    <TableHead className="text-[11px]">Source</TableHead>
                    <TableHead className="text-[11px]">Due</TableHead>
                    <TableHead className="text-[11px]">Priority</TableHead>
                    <TableHead className="text-[11px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActionItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs font-medium max-w-[250px] truncate">{item.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.source}</TableCell>
                      <TableCell className="text-xs"><span className={cn(item.dueLabel === "Overdue" ? "text-destructive font-semibold" : item.dueLabel === "Due Today" ? "text-warning font-semibold" : "text-muted-foreground")}>{item.dueLabel}</span></TableCell>
                      <TableCell><PriorityBadge priority={item.priority} /></TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Meetings */}
          <TabsContent value="meetings">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">📅 Today's Meeting Schedule</p>
                <p className="text-[10px] text-muted-foreground">Source: Calendar API · Auto-synced</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Meeting</TableHead>
                    <TableHead className="text-[11px]">Time</TableHead>
                    <TableHead className="text-[11px]">Organizer</TableHead>
                    <TableHead className="text-[11px]">Attendees</TableHead>
                    <TableHead className="text-[11px]">Status</TableHead>
                    <TableHead className="text-[11px]">Key Topics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMeetings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-xs font-medium">{m.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.time} – {m.endTime}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.organizer}</TableCell>
                      <TableCell className="text-xs">{m.attendees}</TableCell>
                      <TableCell><span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", m.status === "past" ? "bg-muted text-muted-foreground" : m.status === "current" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-primary/10 text-primary")}>{m.status}</span></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{m.keyTopics.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Emails */}
          <TabsContent value="emails">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">📧 Email Priority Queue</p>
                <p className="text-[10px] text-muted-foreground">Source: Gmail API · AI-prioritized</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Sender</TableHead>
                    <TableHead className="text-[11px]">Subject</TableHead>
                    <TableHead className="text-[11px]">Time</TableHead>
                    <TableHead className="text-[11px]">Priority</TableHead>
                    <TableHead className="text-[11px]">AI Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmails.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-xs font-medium">{e.sender}</TableCell>
                      <TableCell className="text-xs max-w-[250px] truncate">{e.subject}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.time}</TableCell>
                      <TableCell><PriorityBadge priority={e.priority} /></TableCell>
                      <TableCell className="text-[11px] text-muted-foreground max-w-[300px] truncate">{e.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team">
            <div className="rounded-lg bg-card border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-foreground">👥 Team Performance Tracker</p>
                <p className="text-[10px] text-muted-foreground">Source: Task Board + HR DB · Weekly rollup</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Name</TableHead>
                    <TableHead className="text-[11px]">Role</TableHead>
                    <TableHead className="text-[11px]">Total Tasks</TableHead>
                    <TableHead className="text-[11px]">Completed</TableHead>
                    <TableHead className="text-[11px]">Overdue</TableHead>
                    <TableHead className="text-[11px]">Velocity</TableHead>
                    <TableHead className="text-[11px]">Current Focus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.map((t) => (
                    <TableRow key={t.name}>
                      <TableCell className="text-xs font-medium">{t.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.role}</TableCell>
                      <TableCell className="text-xs">{t.tasks}</TableCell>
                      <TableCell className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{t.completed}</TableCell>
                      <TableCell className={cn("text-xs font-semibold", t.overdue > 0 ? "text-destructive" : "text-muted-foreground")}>{t.overdue}</TableCell>
                      <TableCell className="text-xs font-semibold">{t.velocity}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.focus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DataSheetView;
