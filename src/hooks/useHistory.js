import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useHistory(user, isPremium, isProfessional) {
  const [seoHistory, setSeoHistory] = useState([]);
  const [socialHistory, setSocialHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const isUnlocked = isPremium || isProfessional;
  const LIMIT = isUnlocked ? 25 : 2;

  useEffect(() => {
    if (user) fetchHistory();
  }, [user?.id]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [seoRes, socialRes] = await Promise.all([
        supabase
          .from("seo_analysis_history")
          .select("id, url, score, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(25),
        supabase
          .from("social_analysis_history")
          .select("id, handles, social_score, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(25),
      ]);

      setSeoHistory(seoRes.data || []);
      setSocialHistory(socialRes.data || []);
    } catch (e) {
      console.error("❌ History fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const personalBest = seoHistory.length
    ? Math.max(...seoHistory.filter((h) => h.score).map((h) => h.score))
    : 0;

  return {
    seoHistory: isUnlocked ? seoHistory : seoHistory.slice(0, LIMIT),
    socialHistory: isUnlocked ? socialHistory : socialHistory.slice(0, LIMIT),
    allSeoCount: seoHistory.length,
    allSocialCount: socialHistory.length,
    personalBest,
    loading,
    isUnlocked,
    fetchHistory,
  };
}
