import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { access_token, days } = await req.json();

    if (!access_token) throw new Error("access_token is required");

    const now = new Date();
    const timeMin = new Date(now);
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date(now);
    timeMax.setDate(timeMax.getDate() + (days || 1));
    timeMax.setHours(23, 59, 59, 999);

    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "20",
    });

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!calRes.ok) {
      const err = await calRes.json();
      throw new Error(`Calendar API error [${calRes.status}]: ${err.error?.message || JSON.stringify(err)}`);
    }

    const calData = await calRes.json();

    const meetings = (calData.items || []).map((event: any) => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Determine status
      let status: "past" | "current" | "upcoming" = "upcoming";
      if (endDate < now) status = "past";
      else if (startDate <= now && endDate >= now) status = "current";

      const timeStr = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      const endTimeStr = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

      return {
        id: event.id,
        title: event.summary || "Untitled Meeting",
        time: timeStr,
        endTime: endTimeStr,
        startISO: start,
        endISO: end,
        attendees: event.attendees?.length || 1,
        status,
        description: event.description || "",
        location: event.location || "",
        meetLink: event.hangoutLink || "",
        keyTopics: [], // Will be enriched by AI or user
      };
    });

    return new Response(JSON.stringify({ meetings }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-calendar error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
