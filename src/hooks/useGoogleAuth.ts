import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOOGLE_CLIENT_ID = "458263062208-lsijpgkufh0bfrnhgvbl2utkeghga6oc.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly";

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

export function useGoogleAuth() {
  const [tokens, setTokens] = useState<GoogleTokens | null>(() => {
    const stored = localStorage.getItem("google_tokens");
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsConnected(!!tokens && tokens.expires_at > Date.now());
  }, [tokens]);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    
    if (code && state === "google_oauth") {
      setIsConnecting(true);
      window.history.replaceState({}, "", window.location.pathname);
      
      exchangeCode(code).then((newTokens) => {
        setTokens(newTokens);
        localStorage.setItem("google_tokens", JSON.stringify(newTokens));
        setIsConnecting(false);
      }).catch((err) => {
        console.error("OAuth exchange failed:", err);
        setIsConnecting(false);
      });
    }
  }, []);

  const startAuth = useCallback(() => {
    const redirectUri = window.location.origin + "/settings";
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", SCOPES);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", "google_oauth");
    window.location.href = authUrl.toString();
  }, []);

  const disconnect = useCallback(() => {
    setTokens(null);
    localStorage.removeItem("google_tokens");
    setIsConnected(false);
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!tokens) return null;

    // If token not expired, use it
    if (tokens.expires_at > Date.now() + 60000) {
      return tokens.access_token;
    }

    // Try to refresh
    if (tokens.refresh_token) {
      try {
        const { data, error } = await supabase.functions.invoke("google-auth", {
          body: { action: "refresh", refresh_token: tokens.refresh_token },
        });
        if (error || data?.error) throw new Error(data?.error || error?.message);
        
        const newTokens: GoogleTokens = {
          access_token: data.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + (data.expires_in * 1000),
        };
        setTokens(newTokens);
        localStorage.setItem("google_tokens", JSON.stringify(newTokens));
        return data.access_token;
      } catch (err) {
        console.error("Token refresh failed:", err);
        disconnect();
        return null;
      }
    }

    disconnect();
    return null;
  }, [tokens, disconnect]);

  return { isConnected, isConnecting, startAuth, disconnect, getAccessToken };
}

async function exchangeCode(code: string): Promise<GoogleTokens> {
  const redirectUri = window.location.origin + "/settings";
  const { data, error } = await supabase.functions.invoke("google-auth", {
    body: { action: "exchange", code, redirect_uri: redirectUri },
  });
  if (error || data?.error) throw new Error(data?.error || error?.message);
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
  };
}
