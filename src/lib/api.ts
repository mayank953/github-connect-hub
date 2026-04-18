import { supabase } from "@/integrations/supabase/client";

const DEFAULT_SLACK_CHANNEL = "C0ANUHWAK9A";

export async function aiSummarize(type: "meeting" | "daily-brief" | "email-digest", content: string) {
  const { data, error } = await supabase.functions.invoke("ai-summarize", {
    body: { type, content },
  });
  if (error) throw new Error(error.message || "AI summarization failed");
  if (data?.error) throw new Error(data.error);
  return data.result;
}

export async function sendSlackMessage(message: string, channel?: string) {
  const { data, error } = await supabase.functions.invoke("send-slack", {
    body: { message, channel: channel || DEFAULT_SLACK_CHANNEL },
  });
  if (error) throw new Error(error.message || "Slack send failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function fetchNews(query?: string) {
  const { data, error } = await supabase.functions.invoke("fetch-news", {
    body: { query: query || "Tata Capital NBFC lending financial services India" },
  });
  if (error) throw new Error(error.message || "News fetch failed");
  if (data?.error) throw new Error(data.error);
  return data.results;
}

export async function fetchEmails(accessToken: string, maxResults = 10) {
  const { data, error } = await supabase.functions.invoke("fetch-emails", {
    body: { access_token: accessToken, max_results: maxResults },
  });
  if (error) throw new Error(error.message || "Email fetch failed");
  if (data?.error) throw new Error(data.error);
  return data.emails;
}

export async function fetchCalendar(accessToken: string, days = 1) {
  const { data, error } = await supabase.functions.invoke("fetch-calendar", {
    body: { access_token: accessToken, days },
  });
  if (error) throw new Error(error.message || "Calendar fetch failed");
  if (data?.error) throw new Error(data.error);
  return data.meetings;
}
