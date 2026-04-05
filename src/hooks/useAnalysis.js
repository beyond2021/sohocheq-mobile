import { useState } from "react";
import { API_BASE } from "../constants";

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const analyze = async ({ url, twitter, instagram, tiktok, youtube }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(10);

    try {
      // Normalize URL
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

      setProgress(30);

      // Call existing Netlify SEO function
      const seoRes = await fetch(`${API_BASE}/analyze-seo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      setProgress(60);

      if (!seoRes.ok) throw new Error("SEO analysis failed");
      const seoData = await seoRes.json();

      setProgress(80);

      // Call social if handles provided
      let socialData = null;
      const handles = { twitter, instagram, tiktok, youtube };
      const hasHandles = Object.values(handles).some((h) => h?.trim());

      if (hasHandles) {
        try {
          const requests = [];
          if (instagram)
            requests.push(
              fetch(
                `${API_BASE}/instagram-data?username=${instagram.replace("@", "")}`,
              ).then((r) => (r.ok ? r.json() : null)),
            );
          if (twitter)
            requests.push(
              fetch(
                `${API_BASE}/twitter-data?username=${twitter.replace("@", "")}`,
              ).then((r) => (r.ok ? r.json() : null)),
            );
          if (tiktok)
            requests.push(
              fetch(
                `${API_BASE}/tiktok-data?username=${tiktok.replace("@", "")}`,
              ).then((r) => (r.ok ? r.json() : null)),
            );
          if (youtube)
            requests.push(
              fetch(
                `${API_BASE}/youtube-data?username=${youtube.replace("@", "")}`,
              ).then((r) => (r.ok ? r.json() : null)),
            );
          const results = await Promise.allSettled(requests);
          socialData = results
            .map((r) => (r.status === "fulfilled" ? r.value : null))
            .filter(Boolean);
        } catch (e) {
          console.warn("Social analysis failed:", e);
        }
      }

      setProgress(100);
      setResult({ seo: seoData, social: socialData, url: cleanUrl });
    } catch (e) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return { analyze, loading, result, error, progress, reset };
}
