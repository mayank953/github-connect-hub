import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/slack/api';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, channel } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
    if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY is not configured");

    const headers = {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SLACK_API_KEY,
      "Content-Type": "application/json",
    };

    let targetChannel = channel;

    // If no channel specified, find a public channel the bot can post to
    if (!targetChannel) {
      const listRes = await fetch(`${GATEWAY_URL}/conversations.list?types=public_channel&limit=20`, {
        headers,
      });
      const listData = await listRes.json();
      console.log("Channel list response:", JSON.stringify(listData?.channels?.map((c: any) => ({ id: c.id, name: c.name, is_member: c.is_member }))));
      
      // Prefer a channel bot is already in, then #general, then first available
      const memberChannel = listData.channels?.find((c: any) => c.is_member);
      const generalChannel = listData.channels?.find((c: any) => c.name === "general");
      targetChannel = memberChannel?.id || generalChannel?.id || listData.channels?.[0]?.id;
    }

    if (!targetChannel) {
      return new Response(JSON.stringify({ error: "No Slack channel found. Please specify a channel ID." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try to join the channel first (will succeed silently if already in)
    const joinRes = await fetch(`${GATEWAY_URL}/conversations.join`, {
      method: "POST",
      headers,
      body: JSON.stringify({ channel: targetChannel }),
    });
    const joinData = await joinRes.json();
    console.log("Join response:", JSON.stringify(joinData));

    // If join fails and it's not already_in_channel, log but try to post anyway
    if (!joinData.ok && joinData.error !== "already_in_channel") {
      console.log("Could not join channel:", joinData.error, "- attempting to post anyway");
    }

    const response = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        channel: targetChannel,
        text: message,
        username: "Tata Capital AI Command Center",
        icon_emoji: ":robot_face:",
      }),
    });

    const data = await response.json();
    console.log("Post response:", JSON.stringify(data));
    
    if (!response.ok || !data.ok) {
      throw new Error(`Slack API error: ${data.error || response.status}`);
    }

    return new Response(JSON.stringify({ success: true, ts: data.ts, channel: data.channel }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-slack error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
