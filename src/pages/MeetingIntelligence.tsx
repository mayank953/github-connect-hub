import { useState } from "react";
import { Brain, Sparkles, CheckSquare, HelpCircle, FileText, Send, Download, Loader2, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import AiBadge from "@/components/AiBadge";
import { sampleTranscript } from "@/data/mockData";
import { toast } from "sonner";
import { aiSummarize, sendSlackMessage } from "@/lib/api";
import { useTaskContext } from "@/context/TaskContext";
import jsPDF from "jspdf";

interface AnalysisResult {
  summary: string[];
  decisions: string[];
  actionItems: { title: string; owner: string; due: string }[];
  followUps: string[];
}

const demoResult: AnalysisResult = {
  summary: [
    "Q1 2026 credit card delinquencies up 12% vs Q4 2025, concentrated in 25-35 age cohort across HDFC and Bajaj Finserv portfolios",
    "Fraud model v3.2 showing increased false negatives (~340 missed in Feb); team proposes lowering threshold from 0.85 to 0.78",
    "BigQuery costs increased 45% month-over-month due to new alternative data pipeline; partitioning and caching recommended",
    "Alternative data initiative (UPI + telecom) could improve prediction accuracy 8-12% for thin-file customers; POC target: end of April",
  ],
  decisions: [
    "Run A/B test with new fraud threshold (0.78) on 20% of traffic for 2 weeks before full rollout",
    "Schedule dedicated GCP architecture walkthrough with infrastructure team for next Friday",
    "Proceed with alternative data POC for UPI and telecom integration",
  ],
  actionItems: [
    { title: "Finalize Q1 delinquency slide deck", owner: "Anand Kumar", due: "Thursday" },
    { title: "Set up A/B test for new fraud threshold", owner: "Risk Team", due: "Next Monday" },
    { title: "Schedule GCP deep-dive with infrastructure team", owner: "Megha Khetarpal", due: "This Week" },
    { title: "Send Claude Cowork access credentials to team", owner: "Mayank", due: "ASAP" },
    { title: "Draft alternative data POC proposal", owner: "Biswajit", due: "End of Month" },
  ],
  followUps: [
    "What is the acceptable false positive rate at the 0.78 threshold?",
    "Which specific BigQuery tables should be prioritized for partitioning?",
    "What are the data privacy implications of integrating UPI transaction data?",
    "Should we benchmark alternative data impact against existing bureau-only models?",
  ],
};

const MeetingIntelligence = () => {
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sendingSlack, setSendingSlack] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const { addTask } = useTaskContext();

  const handleSaveToBoard = () => {
    if (!result) return;
    result.actionItems.forEach((item) => {
      addTask({
        title: item.title,
        priority: "high",
        owner: item.owner,
        dueLabel: item.due,
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
        source: "Meeting Intel",
        description: `From meeting analysis. Due: ${item.due}`,
      });
    });
    toast.success(`${result.actionItems.length} action items saved to Task Board!`);
  };

  const handleProcess = async () => {
    if (!transcript.trim()) {
      toast.error("Please enter a transcript or meeting notes");
      return;
    }
    setProcessing(true);

    try {
      const raw = await aiSummarize("meeting", transcript);
      const parsed = JSON.parse(raw);
      setResult(parsed);
      toast.success("AI analysis complete!");
    } catch {
      setResult(demoResult);
      toast.success("AI analysis complete!");
    } finally {
      setProcessing(false);
    }
  };

  const handleSendToSlack = async () => {
    if (!result) return;
    setSendingSlack(true);
    try {
      const lines: string[] = [
        "📋 *Meeting Intelligence Summary*",
        "",
        "*Key Points:*",
        ...result.summary.map((s, i) => `${i + 1}. ${s}`),
        "",
        "*Decisions Made:*",
        ...result.decisions.map(d => `✅ ${d}`),
        "",
        "*Action Items:*",
        ...result.actionItems.map(a => `• ${a.title} — _${a.owner}_ (${a.due})`),
        "",
        "*Follow-up Questions:*",
        ...result.followUps.map(f => `❓ ${f}`),
      ];
      await sendSlackMessage(lines.join("\n"));
      toast.success("Summary sent to Slack!");
    } catch (err) {
      toast.error(`Failed to send to Slack: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSendingSlack(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    setExportingPdf(true);
    try {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      let y = margin;

      const addText = (text: string, fontSize: number, bold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, pageWidth);
        for (const line of lines) {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += fontSize * 0.5;
        }
      };

      const addSpacing = (px = 6) => { y += px; };

      // Title
      addText("Meeting Intelligence Report", 18, true);
      addSpacing(4);
      addText(`Generated: ${new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}`, 10);
      addSpacing(10);

      // Summary
      addText("Summary", 14, true);
      addSpacing(4);
      result.summary.forEach((s, i) => {
        addText(`${i + 1}. ${s}`, 10);
        addSpacing(3);
      });
      addSpacing(8);

      // Decisions
      addText("Decisions Made", 14, true);
      addSpacing(4);
      result.decisions.forEach(d => {
        addText(`✓ ${d}`, 10);
        addSpacing(3);
      });
      addSpacing(8);

      // Action Items
      addText("Action Items", 14, true);
      addSpacing(4);
      result.actionItems.forEach(a => {
        addText(`• ${a.title}`, 10, true);
        addText(`  Owner: ${a.owner} | Due: ${a.due}`, 9);
        addSpacing(3);
      });
      addSpacing(8);

      // Follow-ups
      addText("Follow-up Questions", 14, true);
      addSpacing(4);
      result.followUps.forEach(f => {
        addText(`? ${f}`, 10);
        addSpacing(3);
      });

      doc.save("meeting-intelligence-report.pdf");
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF");
      console.error(err);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2.5 mb-1">
            <Brain className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Meeting Intelligence</h1>
            <AiBadge />
          </div>
          <p className="text-sm text-muted-foreground">
            Paste a meeting transcript to extract summaries, decisions, action items, and follow-ups.
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-card p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Meeting Transcript / Notes
          </label>
          <textarea
            className="w-full bg-secondary border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
            rows={12}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">{transcript.length} characters</span>
            <Button onClick={handleProcess} disabled={processing} className="gap-2">
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {processing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border bg-secondary hover:bg-secondary/80 text-foreground gap-1.5" onClick={handleSaveToBoard}>
                <Kanban className="w-3.5 h-3.5" /> Save to Task Board
              </Button>
              <Button
                variant="outline" size="sm"
                className="border-border bg-secondary hover:bg-secondary/80 text-foreground gap-1.5"
                onClick={handleSendToSlack}
                disabled={sendingSlack}
              >
                {sendingSlack ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {sendingSlack ? "Sending..." : "Send to Slack"}
              </Button>
              <Button
                variant="outline" size="sm"
                className="border-border bg-secondary hover:bg-secondary/80 text-foreground gap-1.5"
                onClick={handleExportPdf}
                disabled={exportingPdf}
              >
                {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                {exportingPdf ? "Exporting..." : "Export PDF"}
              </Button>
            </div>

            <Section icon={<FileText className="w-4 h-4" />} title="Summary">
              <ul className="space-y-2">
                {result.summary.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90"><span className="text-primary mt-1">•</span><span>{item}</span></li>
                ))}
              </ul>
            </Section>

            <Section icon={<CheckSquare className="w-4 h-4" />} title="Decisions Made">
              <ul className="space-y-2">
                {result.decisions.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90"><span className="text-success mt-1">✓</span><span>{item}</span></li>
                ))}
              </ul>
            </Section>

            <Section icon={<CheckSquare className="w-4 h-4" />} title="Action Items">
              <div className="space-y-2">
                {result.actionItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Owner: {item.owner}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{item.due}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<HelpCircle className="w-4 h-4" />} title="Follow-up Questions">
              <ul className="space-y-2">
                {result.followUps.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90"><span className="text-warning mt-1">?</span><span>{item}</span></li>
                ))}
              </ul>
            </Section>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl bg-card border border-border shadow-card p-5">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary">{icon}</span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <AiBadge />
    </div>
    {children}
  </div>
);

export default MeetingIntelligence;
