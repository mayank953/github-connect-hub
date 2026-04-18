import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, content } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let messagesPayload: { role: string; content: string }[] = [];
    
    if (type === "assistant") {
      systemPrompt = `You are "Pulse AI", the smart assistant for Tata Capital's AI Command Center. You help professionals manage tasks, meetings, and workflows.

When a user asks you to create a task, extract the details and respond with a JSON block wrapped in \`\`\`json ... \`\`\` containing:
{
  "action": "create_task",
  "title": "...",
  "priority": "high" | "medium" | "low",
  "owner": "...",
  "dueLabel": "...",
  "description": "..."
}

If multiple tasks, return an array of objects. Always include a brief natural language confirmation before the JSON block.

For general questions, answer helpfully and concisely. Use markdown formatting. Be professional but friendly. Reference NBFC / lending / financial services context when relevant.`;
      try {
        messagesPayload = JSON.parse(content);
      } catch {
        messagesPayload = [{ role: "user", content }];
      }
    } else if (type === "meeting") {
      systemPrompt = `You are an AI assistant for Tata Capital professionals. Analyze the meeting transcript and return a JSON object with:
- "summary": array of 3-5 key discussion points
- "decisions": array of decisions made
- "actionItems": array of objects with "title", "owner", "due" fields
- "followUps": array of unresolved questions

Be specific and actionable. Use NBFC / lending / financial services terminology where appropriate.
Return ONLY valid JSON, no markdown.`;
    } else if (type === "daily-brief") {
      systemPrompt = `You are an AI assistant for Tata Capital professionals. Given the user's meetings, emails, and action items for today, generate a concise 2-3 sentence daily briefing. Be specific about counts and priorities. Mention the most urgent items by name.
Return plain text, no JSON.`;
    } else if (type === "email-digest") {
      systemPrompt = `You are an AI assistant for Tata Capital professionals. Summarize the provided emails into a single concise paragraph highlighting the most important items and required actions.
Return plain text, no JSON.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: type === "assistant"
          ? [{ role: "system", content: systemPrompt }, ...messagesPayload]
          : [{ role: "system", content: systemPrompt }, { role: "user", content }],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-summarize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
