import { useState } from "react";
import { API_BASE } from "../constants";
import { supabase } from "../lib/supabase";

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState("");

  const getToken = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("🔑 Token:", session?.access_token ? "EXISTS" : "MISSING");
      return session?.access_token || null;
    } catch (e) {
      console.error("❌ Token error:", e);
      return null;
    }
  };

  const analyze = async ({ url, twitter, instagram, tiktok, youtube }, trophyHook) => {
    console.log("🤣 Hybrid is analyzing");

    setLoading(true);
    setReady(false);
    setError(null);
    setResult(null);
    setProgress(10);
    setStep("Checking website speed...");

    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

      setProgress(30);
      setStep("Analyzing SEO score...");

      const token = await getToken();
      const authHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      /************************************SEO CALL********************************** */
      const seoRes = await fetch(`${API_BASE}/analyze-seo`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ url: cleanUrl }),
      });

      setProgress(60);
      if (!seoRes.ok) throw new Error("SEO analysis failed");
      const seoData = await seoRes.json();

      setProgress(80);

      let socialData = null;
      const hasHandles = [twitter, instagram, tiktok, youtube].some((h) =>
        h?.trim(),
      );

      if (hasHandles) {
        console.log("🇯🇲 handles Recognized");
        setStep("Calculating social reach...");
        socialData = {};
        const requests = [];

        if (instagram?.trim()) {
          requests.push(
            fetch(`${API_BASE}/instagram-data`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify({ username: instagram.replace("@", "") }),
            })
              .then((r) => {
                console.log("📸 Instagram status:", r.status);
                return r.ok ? r.json() : null;
              })
              .then((data) => {
                console.log("📸 Instagram data:", JSON.stringify(data));
                if (data)
                  socialData.instagram = {
                    ...data,
                    platform: "instagram",
                    handle: instagram.replace("@", ""),
                  };
              })
              .catch((e) => console.error("❌ Instagram error:", e)),
          );
        }

        if (twitter?.trim()) {
          requests.push(
            fetch(`${API_BASE}/twitter-data`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify({ username: twitter.replace("@", "") }),
            })
              .then((r) => {
                console.log("𝕏 Twitter status:", r.status);
                return r.ok ? r.json() : null;
              })
              .then((data) => {
                console.log("𝕏 Twitter data:", JSON.stringify(data));
                if (data)
                  socialData.twitter = {
                    ...data,
                    platform: "twitter",
                    handle: twitter.replace("@", ""),
                  };
              })
              .catch((e) => console.error("❌ Twitter error:", e)),
          );
        }

        if (tiktok?.trim()) {
          requests.push(
            fetch(`${API_BASE}/tiktok-data`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify({ username: tiktok.replace("@", "") }),
            })
              .then((r) => {
                console.log("🎵 TikTok status:", r.status);
                return r.ok ? r.json() : null;
              })
              .then((data) => {
                console.log("🎵 TikTok data:", JSON.stringify(data));
                if (data)
                  socialData.tiktok = {
                    ...data,
                    platform: "tiktok",
                    handle: tiktok.replace("@", ""),
                  };
              })
              .catch((e) => console.error("❌ TikTok error:", e)),
          );
        }

        if (youtube?.trim()) {
          requests.push(
            fetch(`${API_BASE}/youtube-data`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify({ username: youtube.replace("@", "") }),
            })
              .then((r) => {
                console.log("▶️ YouTube status:", r.status);
                return r.ok ? r.json() : null;
              })
              .then((data) => {
                console.log("▶️ YouTube data:", JSON.stringify(data));
                if (data)
                  socialData.youtube = {
                    ...data,
                    platform: "youtube",
                    handle: youtube.replace("@", ""),
                  };
              })
              .catch((e) => console.error("❌ YouTube error:", e)),
          );
        }

        await Promise.allSettled(requests);
        console.log("📱 Social data:", JSON.stringify(socialData));
        if (Object.keys(socialData).length === 0) socialData = null;
      }

      setProgress(100);
      setStep("Analysis complete!");
      setResult({ seo: seoData, social: socialData, url: cleanUrl });
      if (trophyHook) await trophyHook.saveAnalysis(seoData, socialData, cleanUrl);
      setReady(true);
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
    setReady(false);
    setStep("");
  };

  return { analyze, loading, result, error, progress, reset, ready, step };
}
