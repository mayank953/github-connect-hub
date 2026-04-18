import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, CheckSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import AiBadge from "@/components/AiBadge";
import { useTaskContext } from "@/context/TaskContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are "Pulse AI", the smart assistant for Tata Capital's AI Command Center. You help professionals manage tasks, meetings, and workflows.

When a user asks you to create a task, extract the details and respond with a JSON block wrapped in \`\`\`json ... \`\`\` containing:
{
  "action": "create_task",
  "title": "...",
  "priority": "high" | "medium" | "low",
  "owner": "...",
  "dueLabel": "...",
  "description": "..."
}

If multiple tasks, return an array of objects.

For general questions, answer helpfully and concisely. Use markdown formatting. Be professional but friendly. Reference financial services / credit bureau context when relevant.`;

const AiAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm **Pulse AI**, your intelligent assistant. I can help you:\n\n- 📋 **Create tasks** — just tell me what needs to be done\n- 🧠 **Plan workflows** — describe your goals and I'll break them down\n- 💡 **Answer questions** — about your dashboard, data, or strategy\n\nTry: *\"Create a high priority task for Anand to review Q1 delinquency report by Friday\"*" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addTask } = useTaskContext();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const extractAndCreateTasks = (content: string) => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return;
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      let created = 0;
      for (const item of items) {
        if (item.action === "create_task" && item.title) {
          addTask({
            title: item.title,
            priority: item.priority || "medium",
            owner: item.owner || "Mayank",
            dueLabel: item.dueLabel || "This Week",
            dueDate: new Date().toISOString().split("T")[0],
            status: "pending",
            source: "Pulse AI",
            description: item.description || "",
          });
          created++;
        }
      }
      if (created > 0) {
        toast.success(`${created} task${created > 1 ? "s" : ""} added to Task Board!`);
      }
    } catch {
      // Not valid JSON, skip
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-summarize", {
        body: {
          type: "assistant",
          content: JSON.stringify(newMessages.map(m => ({ role: m.role, content: m.content }))),
        },
      });

      if (error) throw error;
      const assistantContent = data?.result || "I'm sorry, I couldn't process that. Please try again.";
      const assistantMsg: Message = { role: "assistant", content: assistantContent };
      setMessages(prev => [...prev, assistantMsg]);
      extractAndCreateTasks(assistantContent);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Something went wrong. Please try again." }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl">
        <div className="animate-fade-in mb-4">
          <div className="flex items-center gap-2.5 mb-1">
            <Bot className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Pulse AI</h1>
            <AiBadge />
          </div>
          <p className="text-sm text-muted-foreground">
            Your AI assistant for task creation, workflow planning, and intelligent insights.
          </p>
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border shadow-card rounded-bl-md"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:ml-4 [&>ol]:mb-2 [&>ol]:ml-4">
                    <ReactMarkdown>{msg.content.replace(/```json[\s\S]*?```/g, "").trim() || msg.content}</ReactMarkdown>
                    {msg.content.includes('"create_task"') && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
                        <CheckSquare className="w-3.5 h-3.5" />
                        Task(s) added to Task Board
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border shadow-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pulse AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {[
            "Create a task for Q1 report review",
            "Plan tasks for sprint planning",
            "What's my dashboard summary?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-secondary border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 items-end bg-card border border-border rounded-2xl p-3 shadow-card">
          <textarea
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[40px] max-h-[120px]"
            rows={1}
            placeholder="Ask Pulse AI to create tasks, plan workflows, or answer questions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 rounded-xl"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default AiAssistant;
