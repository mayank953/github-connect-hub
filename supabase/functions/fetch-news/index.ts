import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();

    const TAVILY_API_KEY = Deno.env.get("TAVILY_API_KEY");
    if (!TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is not configured");

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query || "Tata Capital NBFC lending financial services India news",
        search_depth: "basic",
        include_answer: true,
        max_results: 8,
        topic: "news",
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("Tavily error:", response.status, t);
      throw new Error(`Tavily API error [${response.status}]`);
    }

    const data = await response.json();

    const results = (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      content: r.content?.slice(0, 200),
      publishedDate: r.published_date,
      score: r.score,
    }));

    return new Response(JSON.stringify({ results, answer: data.answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-news error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
