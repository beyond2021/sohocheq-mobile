import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useDailyBrief(user, isPremium, isProfessional) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [streak, setBriefStreak] = useState(0);

  const today = new Date().toISOString().split("T")[0];
  const hasAccess = isPremium || isProfessional;

  useEffect(() => {
    fetchBrief();
  }, []);

  useEffect(() => {
    if (user && brief) checkReadStatus();
  }, [user?.id, brief?.id]);

  const fetchBrief = async () => {
    setLoading(true);
    try {
      // Get today's brief
      const { data } = await supabase
        .from("daily_briefs")
        .select("*")
        .eq("date", today)
        .single();

      if (data) {
        setBrief(data);
      } else {
        // Trigger generation if not yet created today
        await supabase.functions.invoke("daily-brief");
        // Fetch again after generation
        const { data: fresh } = await supabase
          .from("daily_briefs")
          .select("*")
          .eq("date", today)
          .single();
        if (fresh) setBrief(fresh);
      }
    } catch (e) {
      console.error("❌ Daily brief fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const checkReadStatus = async () => {
    if (!user || !brief) return;
    try {
      const { data } = await supabase
        .from("user_brief_reads")
        .select("id, read_streak")
        .eq("user_id", user.id)
        .eq("brief_id", brief.id)
        .single();

      if (data) {
        setHasRead(true);
        setBriefStreak(data.read_streak || 0);
      }
    } catch (e) {
      // Not read yet
    }
  };

  const markAsRead = async () => {
    if (!user || !brief || hasRead || !hasAccess) return;
    try {
      // Get yesterday's read to calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const { data: yesterdayBrief } = await supabase
        .from("daily_briefs")
        .select("id")
        .eq("date", yesterdayStr)
        .single();

      let newStreak = 1;
      if (yesterdayBrief) {
        const { data: yesterdayRead } = await supabase
          .from("user_brief_reads")
          .select("read_streak")
          .eq("user_id", user.id)
          .eq("brief_id", yesterdayBrief.id)
          .single();
        if (yesterdayRead) newStreak = (yesterdayRead.read_streak || 0) + 1;
      }

      await supabase.from("user_brief_reads").insert({
        user_id: user.id,
        brief_id: brief.id,
        date: today,
        read_streak: newStreak,
      });

      setHasRead(true);
      setBriefStreak(newStreak);
    } catch (e) {
      console.error("❌ Mark brief read error:", e);
    }
  };

  return {
    brief,
    loading,
    hasRead,
    hasAccess,
    briefStreak: streak,
    markAsRead,
    refresh: fetchBrief,
  };
}
