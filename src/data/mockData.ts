import { Mail, Calendar, Clock, User, CheckSquare, AlertTriangle } from "lucide-react";

export interface MockEmail {
  id: string;
  sender: string;
  subject: string;
  time: string;
  priority: "high" | "medium" | "low";
  summary: string;
  actioned: boolean;
}

export interface MockMeeting {
  id: string;
  title: string;
  time: string;
  endTime: string;
  attendees: number;
  status: "past" | "current" | "upcoming";
  keyTopics: string[];
  prepNotes?: string;
  meetLink?: string;
  organizer?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  source: string;
  dueDate: string;
  dueLabel: string;
  status: "pending" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  owner?: string;
  description?: string;
}

export interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export const mockKPIs: KPIData[] = [
  { label: "AUM Growth", value: "₹88,400 Cr", change: "+14.2%", trend: "up", icon: "activity" },
  { label: "NPA Ratio", value: "1.82%", change: "-0.15%", trend: "down", icon: "shield" },
  { label: "Disbursements Today", value: "₹342 Cr", change: "+11.5%", trend: "up", icon: "target" },
  { label: "Collection Efficiency", value: "97.3%", change: "+1.2%", trend: "up", icon: "target" },
  { label: "Open Action Items", value: "7", change: "-2", trend: "down", icon: "tasks" },
];

export const mockEmails: MockEmail[] = [
  {
    id: "1",
    sender: "Rajiv Sabharwal",
    subject: "Urgent: Q1 AUM Review & Board Presentation",
    time: "9:15 AM",
    priority: "high",
    summary: "Rajiv is requesting the final Q1 AUM growth report with segment-wise breakdown for the board presentation on Friday.",
    actioned: false,
  },
  {
    id: "2",
    sender: "Sarosh Amaria",
    subject: "Housing Finance — NPA Provisioning Update",
    time: "10:42 AM",
    priority: "medium",
    summary: "Sarosh shared the updated NPA provisioning numbers for the housing finance portfolio. Needs review before RBI submission.",
    actioned: false,
  },
  {
    id: "3",
    sender: "Risk Team",
    subject: "MSME Loan Default Model — Threshold Change Needed",
    time: "11:30 AM",
    priority: "high",
    summary: "The risk team wants to adjust the MSME default prediction threshold from 0.85 to 0.78 based on recent delinquency patterns.",
    actioned: false,
  },
  {
    id: "4",
    sender: "Abonty Banerjee",
    subject: "Digital Lending Product Brief — Co-Lending Partnership",
    time: "1:05 PM",
    priority: "low",
    summary: "Product team has drafted a brief for the co-lending partnership with SBI for MSME loans. Review by end of month.",
    actioned: false,
  },
  {
    id: "5",
    sender: "Vivek Sharma",
    subject: "Wealth Management AUM Cross-Sell Opportunity",
    time: "3:22 PM",
    priority: "medium",
    summary: "Vivek shared analysis on cross-selling wealth management products to existing home loan customers. Potential ₹2,200 Cr incremental AUM.",
    actioned: false,
  },
];

export const mockMeetings: MockMeeting[] = [
  {
    id: "1",
    title: "Retail Lending Portfolio Review",
    time: "10:00 AM",
    endTime: "11:00 AM",
    attendees: 5,
    status: "past",
    keyTopics: ["Q1 Disbursements", "NPA Trends", "Collection Strategy"],
    prepNotes: "Review the Q1 disbursement data. Rajiv will present the retail lending growth analysis. Bring updated NPA metrics.",
    organizer: "Rajiv Sabharwal",
  },
  {
    id: "2",
    title: "MSME Risk Analytics Sync",
    time: "2:00 PM",
    endTime: "3:00 PM",
    attendees: 3,
    status: "current",
    keyTopics: ["Default Model Refresh", "Threshold Tuning", "Sector-wise Risk"],
    prepNotes: "A/B test results from the 0.78 threshold pilot are ready. Discuss sector-wise MSME risk concentration and next steps for model v3.3.",
    organizer: "Risk Team Lead",
  },
  {
    id: "3",
    title: "Digital Lending Platform Walkthrough",
    time: "4:30 PM",
    endTime: "5:30 PM",
    attendees: 6,
    status: "upcoming",
    keyTopics: ["API Integration", "Co-Lending Flow", "TAT Reduction"],
    prepNotes: "Abonty will present the co-lending API architecture. Review turnaround time benchmarks and partner bank integration status.",
    organizer: "Abonty Banerjee",
  },
  {
    id: "4",
    title: "Wealth & Investment Strategy",
    time: "6:00 PM",
    endTime: "6:45 PM",
    attendees: 4,
    status: "upcoming",
    keyTopics: ["MF Distribution", "Insurance Cross-Sell", "HNI Segment"],
    prepNotes: "Vivek to present the wealth management cross-sell proposal. Key question: regulatory compliance for MF distribution via digital channels.",
    organizer: "Vivek Sharma",
  },
];

export const mockActionItems: ActionItem[] = [
  {
    id: "1",
    title: "Prepare Q1 AUM growth presentation for board",
    source: "CEO Review",
    dueDate: "2026-04-03",
    dueLabel: "Overdue",
    status: "pending",
    priority: "high",
    owner: "Mayank",
    description: "Compile segment-wise AUM data (retail, MSME, housing, wealth) for the quarterly board presentation.",
  },
  {
    id: "2",
    title: "Finalize NPA provisioning report for RBI",
    source: "Compliance Review",
    dueDate: "2026-04-05",
    dueLabel: "Due Today",
    status: "in-progress",
    priority: "high",
    owner: "Sarosh Amaria",
    description: "Complete the NPA provisioning calculations for housing finance portfolio and prepare RBI submission package.",
  },
  {
    id: "3",
    title: "Review MSME default model threshold changes",
    source: "Risk Team Email",
    dueDate: "2026-04-06",
    dueLabel: "Due Tomorrow",
    status: "pending",
    priority: "medium",
    owner: "Mayank",
    description: "Evaluate the proposed threshold change from 0.85 to 0.78 and assess false positive impact on MSME loan decisions.",
  },
  {
    id: "4",
    title: "Schedule co-lending API integration review",
    source: "Abonty's Email",
    dueDate: "2026-04-08",
    dueLabel: "This Week",
    status: "pending",
    priority: "low",
    owner: "Abonty Banerjee",
    description: "Coordinate with SBI tech team for the co-lending platform API integration walkthrough.",
  },
  {
    id: "5",
    title: "Set up A/B test for MSME default threshold",
    source: "MSME Risk Analytics",
    dueDate: "2026-04-10",
    dueLabel: "Next Week",
    status: "pending",
    priority: "high",
    owner: "Risk Team",
    description: "Configure 20% traffic split for testing new 0.78 default detection threshold vs current 0.85.",
  },
  {
    id: "6",
    title: "Draft wealth management cross-sell proposal",
    source: "Investment Strategy",
    dueDate: "2026-04-15",
    dueLabel: "This Month",
    status: "pending",
    priority: "medium",
    owner: "Vivek Sharma",
    description: "Create detailed proposal for cross-selling MF and insurance products to existing home loan customers.",
  },
  {
    id: "7",
    title: "Implement digital lending TAT dashboard",
    source: "Digital Lending Review",
    dueDate: "2026-04-12",
    dueLabel: "Next Week",
    status: "in-progress",
    priority: "medium",
    owner: "Abonty Banerjee",
    description: "Build real-time turnaround time tracking for personal loan and MSME loan disbursement pipeline.",
  },
];

export const sampleTranscript = `Meeting: Tata Capital — Lending & Risk Analytics Weekly Sync
Date: April 4, 2026
Attendees: Mayank, Rajiv Sabharwal, Sarosh Amaria, Abonty Banerjee, Vivek Sharma, Risk Team Lead

Discussion Points:

1. Q1 AUM Growth & Retail Lending:
Rajiv presented the Q1 2026 AUM update. Total AUM crossed ₹88,400 Cr, up 14.2% YoY. Retail lending disbursements grew 18% with strong traction in personal loans and consumer durable financing. Housing finance AUM steady at ₹24,500 Cr. The team agreed to prepare a detailed segment-wise breakdown for the board presentation on Friday.

2. MSME Loan Default Model Refresh:
The current MSME default model (v3.2) is showing increased false negatives — approximately 280 missed defaults in March. The risk team proposes lowering the detection threshold from 0.85 to 0.78 and retraining with Q4 2025 + Q1 2026 data. Mayank raised concerns about false positive rates affecting MSME disbursement speed. Decision: Run an A/B test with the new threshold on 20% of applications for 2 weeks before full rollout.

3. Digital Lending & Co-Lending Partnerships:
Abonty highlighted the co-lending partnership progress with SBI for MSME loans. API integration is 70% complete. Digital lending TAT has reduced from 48 hours to 18 hours for personal loans. A dedicated platform walkthrough is scheduled for next week with the tech team.

4. Wealth Management Cross-Sell:
Vivek shared analysis on cross-selling MF distribution and insurance products to existing home loan customers. Potential incremental AUM of ₹2,200 Cr. Need to ensure SEBI compliance for digital MF distribution. Timeline: pilot launch by end of April.

Action Items:
- Rajiv to finalize the Q1 AUM presentation for board by Thursday
- Risk team to set up A/B test for new MSME default threshold by next Monday
- Abonty to schedule co-lending API integration review with SBI
- Mayank to prepare quarterly risk dashboard updates
- Vivek to draft the wealth management cross-sell proposal
- Sarosh to complete NPA provisioning report for RBI submission

Follow-up: Next sync on April 11th, same time.`;
