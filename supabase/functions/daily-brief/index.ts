import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }),
      { status: 500, headers },
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const today = new Date().toISOString().split("T")[0];

    // Return existing brief if already generated today
    const { data: existing } = await supabase
      .from("daily_briefs")
      .select("*")
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ success: true, brief: existing }), {
        headers,
      });
    }

    // Call Claude
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are an SEO and social media expert. Generate a daily intelligence brief for small business owners.

Respond with ONLY a valid JSON object, no markdown, no explanation, just the JSON:

{
  "headline": "short punchy headline about today's biggest SEO or social trend",
  "seo_update": {
    "title": "short title",
    "insight": "2-3 sentences about what's happening in SEO today and why it matters",
    "impact": "high"
  },
  "social_update": {
    "title": "short title",
    "insight": "2-3 sentences about social media trends today",
    "platform": "general",
    "impact": "medium"
  },
  "action_today": "One specific action the user should take today",
  "threat_level": "yellow",
  "threat_reason": "One sentence explaining the current threat level",
  "pro_tip": "One insider tip most people don't know"
}`,
          },
        ],
      }),
    });

    const claudeJson = await claudeRes.json();

    if (!claudeRes.ok) {
      throw new Error(`Claude error: ${JSON.stringify(claudeJson)}`);
    }

    const text = claudeJson.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error(`No JSON in response: ${text.substring(0, 200)}`);
    }

    const brief = JSON.parse(match[0]);

    const { data, error } = await supabase
      .from("daily_briefs")
      .insert({
        date: today,
        headline: brief.headline,
        seo_update: brief.seo_update,
        social_update: brief.social_update,
        action_today: brief.action_today,
        threat_level: brief.threat_level,
        threat_reason: brief.threat_reason,
        pro_tip: brief.pro_tip,
      })
      .select()
      .single();

    if (error)
      throw new Error(`Supabase insert error: ${JSON.stringify(error)}`);

    return new Response(JSON.stringify({ success: true, brief: data }), {
      headers,
    });
  } catch (e) {
    console.error("daily-brief error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers,
    });
  }
});
