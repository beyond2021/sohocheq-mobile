// supabase/functions/gsc-data/index.ts
// Fetches real traffic data from Google Search Console API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GSC_API = "https://www.googleapis.com/webmasters/v3";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// Estimate CPC savings based on clicks and industry average CPC ($2.50)
function estimateCpcSavings(clicks: number): number {
  const avgCpc = 2.5;
  return Math.round(clicks * avgCpc);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const { accessToken, siteUrl } = await req.json();
    if (!accessToken || !siteUrl)
      throw new Error("Missing accessToken or siteUrl");

    const authHeader = { Authorization: `Bearer ${accessToken}` };
    const startDate = daysAgo(90);
    const endDate = daysAgo(1);

    // Normalize site URL for GSC (must match exactly what's in Search Console)
    const normalizedUrl = siteUrl.startsWith("http")
      ? siteUrl
      : `https://${siteUrl}`;

    // ── 1. Summary: total clicks, impressions, avg position ──
    const summaryRes = await fetch(
      `${GSC_API}/sites/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: [],
        }),
      },
    );

    if (!summaryRes.ok) {
      const err = await summaryRes.json();
      // If 403, site not verified in GSC
      if (summaryRes.status === 403)
        throw new Error("Site not verified in Google Search Console");
      throw new Error(err.error?.message || "Failed to fetch summary");
    }

    const summary = await summaryRes.json();
    const totalClicks = Math.round(summary.rows?.[0]?.clicks || 0);
    const totalImpressions = Math.round(summary.rows?.[0]?.impressions || 0);
    const avgPosition = summary.rows?.[0]?.position
      ? parseFloat(summary.rows[0].position.toFixed(1))
      : null;

    // ── 2. Top keywords ──
    const keywordsRes = await fetch(
      `${GSC_API}/sites/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 20,
          orderBy: [{ fieldName: "clicks", sortOrder: "DESCENDING" }],
        }),
      },
    );

    const keywordsData = await keywordsRes.json();
    const keywords = (keywordsData.rows || []).map((row: any) => ({
      query: row.keys[0],
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: parseFloat((row.ctr * 100).toFixed(1)),
      position: parseFloat(row.position.toFixed(1)),
    }));

    // ── 3. Top pages ──
    const pagesRes = await fetch(
      `${GSC_API}/sites/${encodeURIComponent(normalizedUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["page"],
          rowLimit: 10,
          orderBy: [{ fieldName: "clicks", sortOrder: "DESCENDING" }],
        }),
      },
    );

    const pagesData = await pagesRes.json();
    const pages = (pagesData.rows || []).map((row: any) => ({
      page: row.keys[0],
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      position: parseFloat(row.position.toFixed(1)),
    }));

    return new Response(
      JSON.stringify({
        totalClicks,
        totalImpressions,
        avgPosition,
        estimatedCpcSavings: estimateCpcSavings(totalClicks),
        keywords,
        pages,
        period: { startDate, endDate },
      }),
      { headers },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers,
    });
  }
});
