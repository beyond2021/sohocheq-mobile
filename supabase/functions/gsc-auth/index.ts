// supabase/functions/gsc-auth/index.ts
// Handles Google OAuth code exchange and token refresh for Search Console

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const body = await req.json();

    // ── Token refresh ──
    if (body.refreshToken) {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: body.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Refresh failed");

      return new Response(JSON.stringify({ access_token: data.access_token }), {
        headers,
      });
    }

    // ── Code exchange ──
    if (body.code) {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          code: body.code,
          redirect_uri: body.redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error_description || "Code exchange failed");

      return new Response(
        JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        }),
        { headers },
      );
    }

    throw new Error("Missing code or refreshToken");
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers,
    });
  }
});
