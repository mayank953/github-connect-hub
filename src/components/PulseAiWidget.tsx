import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Loader2, X, CheckSquare, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MSG: Message = {
  role: "assistant",
  content:
    "👋 Hi! I'm **Pulse AI**. I can create tasks, plan workflows, and answer questions. Try: *\"Create a task for Q1 report review\"*",
};

const PulseAiWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addTask } = useTaskContext();

  // Load persisted messages on first open
  useEffect(() => {
    if (open && !loaded) {
      (async () => {
        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(100);
        if (data && data.length > 0) {
          setMessages([
            WELCOME_MSG,
            ...data.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })),
          ]);
        }
        setLoaded(true);
      })();
    }
  }, [open, loaded]);

  useEffect(() => {
    if (open) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  }, [messages, open]);

  const persist = async (role: string, content: string) => {
    await supabase.from("chat_messages").insert({ role, content });
  };

  const extractAndCreateTasks = useCallback(
    (content: string) => {
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
        if (created > 0) toast.success(`${created} task${created > 1 ? "s" : ""} added to Task Board!`);
      } catch {
        // skip
      }
    },
    [addTask],
  );

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    persist("user", input);

    try {
      const history = newMessages
        .filter((m) => m !== WELCOME_MSG)
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("ai-summarize", {
        body: { type: "assistant", content: JSON.stringify(history) },
      });
      if (error) throw error;

      const assistantContent = data?.result || "I'm sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);
      persist("assistant", assistantContent);
      extractAndCreateTasks(assistantContent);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = ["Create a task for Q1 review", "Plan sprint tasks", "Summarize my day"];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-primary text-primary-foreground hover:scale-105 active:scale-95",
          open && "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-50 w-[380px] h-[560px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Pulse AI</p>
              <p className="text-[10px] text-muted-foreground">Always online</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary border border-border rounded-bl-sm",
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1.5 [&>ul]:mb-1.5 [&>ul]:ml-3">
                    <ReactMarkdown>{msg.content.replace(/```json[\s\S]*?```/g, "").trim() || msg.content}</ReactMarkdown>
                    {msg.content.includes('"create_task"') && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-primary font-medium">
                        <CheckSquare className="w-3 h-3" /> Task(s) added
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
              <div className="bg-secondary border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-3 pb-1 flex gap-1.5 flex-wrap">
          {quickActions.map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-[10px] bg-secondary border border-border rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border">
          <div className="flex gap-2 items-end bg-secondary rounded-xl px-3 py-2">
            <textarea
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[36px] max-h-[80px]"
              rows={1}
              placeholder="Ask Pulse AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button size="icon" className="h-8 w-8 shrink-0 rounded-lg" onClick={handleSend} disabled={!input.trim() || loading}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PulseAiWidget;
