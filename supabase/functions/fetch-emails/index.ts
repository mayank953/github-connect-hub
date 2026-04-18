import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { access_token, max_results } = await req.json();

    if (!access_token) throw new Error("access_token is required");

    // Fetch unread emails
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max_results || 10}&q=is:unread`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!listRes.ok) {
      const err = await listRes.json();
      throw new Error(`Gmail API error [${listRes.status}]: ${err.error?.message || JSON.stringify(err)}`);
    }

    const listData = await listRes.json();
    const messageIds = (listData.messages || []).map((m: any) => m.id);

    if (messageIds.length === 0) {
      return new Response(JSON.stringify({ emails: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch each message's details
    const emails = await Promise.all(
      messageIds.slice(0, max_results || 10).map(async (id: string) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        const msg = await msgRes.json();
        
        const headers = msg.payload?.headers || [];
        const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
        
        const fromRaw = getHeader("From");
        const senderMatch = fromRaw.match(/^"?([^"<]+)"?\s*</);
        const sender = senderMatch ? senderMatch[1].trim() : fromRaw.split("@")[0];

        return {
          id: msg.id,
          threadId: msg.threadId,
          sender,
          senderEmail: fromRaw,
          subject: getHeader("Subject"),
          date: getHeader("Date"),
          snippet: msg.snippet || "",
          labelIds: msg.labelIds || [],
        };
      })
    );

    // Use AI to assess priority
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let enrichedEmails = emails.map(e => ({ ...e, priority: "medium" as string, summary: e.snippet }));

    if (LOVABLE_API_KEY) {
      try {
        const emailSummaries = emails.map(e => `From: ${e.sender} | Subject: ${e.subject} | Snippet: ${e.snippet}`).join("\n");
        
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: `You are an email priority analyzer for a Tata Capital professional. For each email, determine priority (high/medium/low) and write a 1-2 sentence summary. Return a JSON array with objects having "index" (0-based), "priority", and "summary" fields. Return ONLY valid JSON array.`
              },
              { role: "user", content: emailSummaries },
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || "";
          // Extract JSON from potential markdown
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const priorities = JSON.parse(jsonMatch[0]);
            enrichedEmails = emails.map((e, i) => {
              const p = priorities.find((pr: any) => pr.index === i);
              return {
                ...e,
                priority: p?.priority || "medium",
                summary: p?.summary || e.snippet,
              };
            });
          }
        }
      } catch (aiErr) {
        console.error("AI priority assessment failed, using defaults:", aiErr);
      }
    }

    return new Response(JSON.stringify({ emails: enrichedEmails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-emails error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
