import AppLayout from "@/components/AppLayout";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const riskTrend = [
  { month: "Oct", score: 78.2, alerts: 18 },
  { month: "Nov", score: 76.5, alerts: 21 },
  { month: "Dec", score: 74.8, alerts: 19 },
  { month: "Jan", score: 75.1, alerts: 25 },
  { month: "Feb", score: 73.6, alerts: 22 },
  { month: "Mar", score: 72.4, alerts: 23 },
];

const revenueData = [
  { month: "Oct", revenue: 38.2, cost: 19.8, profit: 18.4 },
  { month: "Nov", revenue: 39.5, cost: 20.1, profit: 19.4 },
  { month: "Dec", revenue: 41.0, cost: 19.5, profit: 21.5 },
  { month: "Jan", revenue: 40.2, cost: 20.8, profit: 19.4 },
  { month: "Feb", revenue: 41.8, cost: 20.2, profit: 21.6 },
  { month: "Mar", revenue: 42.8, cost: 20.6, profit: 22.2 },
];

const bureauPulls = [
  { month: "Oct", pulls: 11200 },
  { month: "Nov", pulls: 12100 },
  { month: "Dec", pulls: 10800 },
  { month: "Jan", pulls: 13400 },
  { month: "Feb", pulls: 13100 },
  { month: "Mar", pulls: 14200 },
];

const segmentData = [
  { name: "Credit Bureau", value: 42.5 },
  { name: "Fraud Solutions", value: 28.3 },
  { name: "Analytics", value: 19.6 },
  { name: "Others", value: 9.6 },
];

const COLORS = ["hsl(271, 76%, 53%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)"];

const delinquencyData = [
  { segment: "Credit Cards", q4: 3.2, q1: 3.6 },
  { segment: "Personal Loans", q4: 2.8, q1: 2.9 },
  { segment: "Auto Loans", q4: 1.9, q1: 2.1 },
  { segment: "Home Loans", q4: 1.2, q1: 1.1 },
  { segment: "MSME", q4: 4.1, q1: 4.5 },
];

const modelAccuracy = [
  { month: "Oct", accuracy: 93.8, falsePos: 4.2 },
  { month: "Nov", accuracy: 94.0, falsePos: 4.0 },
  { month: "Dec", accuracy: 94.1, falsePos: 3.9 },
  { month: "Jan", accuracy: 94.3, falsePos: 3.8 },
  { month: "Feb", accuracy: 94.5, falsePos: 3.6 },
  { month: "Mar", accuracy: 94.7, falsePos: 3.4 },
];

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="rounded-lg bg-card border border-border shadow-card p-4">
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const AnalyticsDashboard = () => (
  <AppLayout>
    <div className="space-y-4">
      <div className="animate-fade-in">
        <h1 className="text-lg font-bold text-foreground">Analytics</h1>
        <p className="text-xs text-muted-foreground">Financial performance & risk metrics · Q1 FY26</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <ChartCard title="Revenue & Profitability" subtitle="Monthly trend (₹ Cr)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(240, 6%, 90%)' }} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(271, 76%, 53%)" fill="hsl(271, 76%, 53%)" fillOpacity={0.15} strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="profit" stackId="2" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.15} strokeWidth={2} name="Net Profit" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Score Trend */}
        <ChartCard title="Portfolio Risk Score" subtitle="Lower is better">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[70, 80]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(240, 6%, 90%)' }} />
              <Line type="monotone" dataKey="score" stroke="hsl(0, 84%, 60%)" strokeWidth={2.5} dot={{ r: 3 }} name="Risk Score" />
              <Line type="monotone" dataKey="alerts" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} name="Fraud Alerts" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bureau Pulls */}
        <ChartCard title="Bureau Pull Volume" subtitle="Monthly pulls">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bureauPulls}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(240, 6%, 90%)' }} />
              <Bar dataKey="pulls" fill="hsl(271, 76%, 53%)" radius={[4, 4, 0, 0]} name="Pulls" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Segments Pie */}
        <ChartCard title="Revenue by Segment" subtitle="Q1 FY26 breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={{ strokeWidth: 1 }} style={{ fontSize: 9 }}>
                {segmentData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Delinquency Comparison */}
        <ChartCard title="Delinquency Rates by Segment" subtitle="Q4 vs Q1 comparison (%)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={delinquencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="segment" type="category" tick={{ fontSize: 9 }} width={90} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(240, 6%, 90%)' }} />
              <Bar dataKey="q4" fill="hsl(271, 76%, 53%)" radius={[0, 4, 4, 0]} name="Q4 FY25" barSize={10} />
              <Bar dataKey="q1" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} name="Q1 FY26" barSize={10} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Model Accuracy */}
        <ChartCard title="Fraud Model Performance" subtitle="Accuracy vs False Positive Rate">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={modelAccuracy}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(240, 6%, 90%)' }} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(142, 71%, 45%)" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
              <Line type="monotone" dataKey="falsePos" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="False Positive %" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  </AppLayout>
);

export default AnalyticsDashboard;
