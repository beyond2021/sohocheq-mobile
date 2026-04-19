import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const TROPHY_DEFINITIONS = [
  {
    key: "speed_demon",
    name: "Speed Demon",
    emoji: "⚡",
    description: "LCP under 2.5 seconds",
    category: "website",
  },
  {
    key: "fort_knox",
    name: "Fort Knox",
    emoji: "🛡️",
    description: "Security score 100%",
    category: "website",
  },
  {
    key: "mobile_first",
    name: "Mobile First",
    emoji: "📱",
    description: "Mobile score above 90%",
    category: "website",
  },
  {
    key: "seo_star",
    name: "SEO Star",
    emoji: "⭐",
    description: "Overall score above 80",
    category: "website",
  },
  {
    key: "rocket_ship",
    name: "Rocket Ship",
    emoji: "🚀",
    description: "Performance above 90%",
    category: "website",
  },
  {
    key: "perfect_score",
    name: "Perfect Score",
    emoji: "💯",
    description: "Overall score 100",
    category: "website",
  },
  {
    key: "first_1k",
    name: "First 1K",
    emoji: "👥",
    description: "1,000 followers on any platform",
    category: "social",
  },
  {
    key: "ten_k_club",
    name: "10K Club",
    emoji: "🔥",
    description: "10,000 followers",
    category: "social",
  },
  {
    key: "hundred_k",
    name: "100K Diamond",
    emoji: "💎",
    description: "100,000 followers",
    category: "social",
  },
  {
    key: "million_club",
    name: "Million Club",
    emoji: "👑",
    description: "1 million followers",
    category: "social",
  },
  {
    key: "multi_platform",
    name: "Multi-Platform",
    emoji: "🌍",
    description: "Active on 3+ platforms",
    category: "social",
  },
  {
    key: "verified",
    name: "Verified",
    emoji: "✅",
    description: "Verified on any platform",
    category: "social",
  },
  {
    key: "full_house",
    name: "Full House",
    emoji: "✅✅",
    description: "Verified on all active platforms",
    category: "social",
  },
  {
    key: "engagement_king",
    name: "Engagement King",
    emoji: "👊",
    description: "Engagement rate above 5%",
    category: "social",
  },
  {
    key: "content_machine",
    name: "Content Machine",
    emoji: "🎬",
    description: "100+ posts on any platform",
    category: "social",
  },
  {
    key: "growing_fast",
    name: "Growing Fast",
    emoji: "📊",
    description: "Grew followers 10% since last check",
    category: "social",
  },
  {
    key: "first_analysis",
    name: "First Check",
    emoji: "🎯",
    description: "First own analysis tracked",
    category: "progress",
  },
  {
    key: "five_saves",
    name: "Consistent",
    emoji: "📈",
    description: "5 meaningful improvements",
    category: "progress",
  },
  {
    key: "ten_saves",
    name: "Dedicated",
    emoji: "🏅",
    description: "10 meaningful improvements",
    category: "progress",
  },
  {
    key: "big_jump",
    name: "Big Jump",
    emoji: "🚀",
    description: "Score improved 20+ points in one check",
    category: "progress",
  },
  {
    key: "on_fire",
    name: "On Fire",
    emoji: "🔥",
    description: "7 day streak",
    category: "streak",
  },
  {
    key: "unstoppable",
    name: "Unstoppable",
    emoji: "💫",
    description: "30 day streak",
    category: "streak",
  },
  {
    key: "legendary_streak",
    name: "Legendary Streak",
    emoji: "🌟",
    description: "90 day streak",
    category: "streak",
  },
];

export const PERSONAS = [
  {
    key: "digital_empire",
    name: "Digital Empire",
    emoji: "👑",
    minWebsite: 90,
    minSocial: 90,
    message:
      "You're running a Digital Empire. Both your website and social are elite. Keep dominating.",
  },
  {
    key: "seo_kingpin",
    name: "SEO Kingpin",
    emoji: "🎯",
    minWebsite: 90,
    maxSocial: 50,
    message:
      "You're an SEO Kingpin — your website is crushing it but your social is sleeping. Time to wake it up.",
  },
  {
    key: "influence_machine",
    name: "Influence Machine",
    emoji: "🔥",
    maxWebsite: 50,
    minSocial: 90,
    message:
      "You're an Influence Machine — massive social presence but your website isn't keeping up. Fix that foundation.",
  },
  {
    key: "rising_brand",
    name: "Rising Brand",
    emoji: "📈",
    minWebsite: 70,
    minSocial: 70,
    message:
      "You're a Rising Brand — strong on both fronts and building real momentum. Keep pushing.",
  },
  {
    key: "building_momentum",
    name: "Building Momentum",
    emoji: "💪",
    minWebsite: 50,
    minSocial: 50,
    message:
      "You're Building Momentum — solid foundation, now it's time to accelerate.",
  },
  {
    key: "social_explorer",
    name: "Social Explorer",
    emoji: "🌊",
    maxWebsite: 50,
    minSocial: 30,
    message:
      "You're a Social Explorer — you've found your voice online, now build the home base to match.",
  },
  {
    key: "seo_builder",
    name: "SEO Builder",
    emoji: "🏗️",
    minWebsite: 30,
    maxSocial: 30,
    message:
      "You're an SEO Builder — your website is the focus. Now amplify it with social.",
  },
  {
    key: "day_one",
    name: "Day 1 Grinder",
    emoji: "🏋️",
    message:
      "You're a Day 1 Grinder — everyone starts here. The gap between you and the top is just consistency.",
  },
];

export const LEVELS = [
  { level: 1, label: "Unknown", min: 0, max: 20 },
  { level: 2, label: "Emerging", min: 21, max: 40 },
  { level: 3, label: "Gaining Ground", min: 41, max: 60 },
  { level: 4, label: "Making Waves", min: 61, max: 75 },
  { level: 5, label: "Established", min: 76, max: 85 },
  { level: 6, label: "Dominant", min: 86, max: 95 },
  { level: 7, label: "Legendary", min: 96, max: 100 },
];

const num = (val) => parseFloat(val) || 0;

export function calculateScore(seo, social) {
  if (seo && social) {
    const websiteHealth =
      num(seo.technical?.performance) * 0.3 +
      num(seo.technical?.mobile) * 0.25 +
      num(seo.technical?.security) * 0.2 +
      num(seo.score) * 0.15 +
      num(seo.technical?.accessibility) * 0.1;
    const platforms = Object.values(social);
    const maxFollowers = Math.max(
      ...platforms.map(
        (p) => p.profileData?.followers || p.followers || p.subscribers || 0,
      ),
    );
    const reachScore = Math.min(
      100,
      (Math.log10(maxFollowers + 1) / Math.log10(1000000)) * 100,
    );
    return Math.round(websiteHealth * 0.6 + reachScore * 0.4);
  }
  if (seo && !social) {
    return Math.round(
      num(seo.technical?.performance) * 0.3 +
        num(seo.technical?.mobile) * 0.25 +
        num(seo.technical?.security) * 0.2 +
        num(seo.score) * 0.15 +
        num(seo.technical?.accessibility) * 0.1,
    );
  }
  if (social && !seo) {
    const platforms = Object.values(social);
    const maxFollowers = Math.max(
      ...platforms.map(
        (p) => p.profileData?.followers || p.followers || p.subscribers || 0,
      ),
    );
    return Math.round(
      Math.min(100, (Math.log10(maxFollowers + 1) / Math.log10(1000000)) * 100),
    );
  }
  return 0;
}

export function getPersona(websiteScore, socialScore) {
  for (const persona of PERSONAS) {
    const webOk = persona.minWebsite
      ? websiteScore >= persona.minWebsite
      : true;
    const webCap = persona.maxWebsite
      ? websiteScore <= persona.maxWebsite
      : true;
    const socOk = persona.minSocial ? socialScore >= persona.minSocial : true;
    const socCap = persona.maxSocial ? socialScore <= persona.maxSocial : true;
    if (webOk && webCap && socOk && socCap) return persona;
  }
  return PERSONAS[PERSONAS.length - 1];
}

export function getLevel(score) {
  return LEVELS.find((l) => score >= l.min && score <= l.max) || LEVELS[0];
}

function normalizeUrl(u) {
  return u
    ?.toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .trim();
}

function isOwnAnalysis(url, social, profile) {
  if (!profile) return false;
  const urlMatch =
    profile.website_url &&
    normalizeUrl(url) === normalizeUrl(profile.website_url);
  const socialMatch =
    social &&
    ((profile.instagram_handle &&
      social.instagram?.handle === profile.instagram_handle) ||
      (profile.twitter_handle &&
        social.twitter?.handle === profile.twitter_handle) ||
      (profile.tiktok_handle &&
        social.tiktok?.handle === profile.tiktok_handle) ||
      (profile.youtube_handle &&
        social.youtube?.handle === profile.youtube_handle));
  return !!(urlMatch || socialMatch);
}

function shouldSave(
  newScore,
  previousScore,
  newSocial,
  previousSocial,
  newTrophies,
) {
  if (previousScore === null) return true;
  if (Math.abs(newScore - previousScore) >= 3) return true;
  if (newTrophies?.length > 0) return true;
  const newPlatforms = newSocial ? Object.keys(newSocial).length : 0;
  const oldPlatforms = previousSocial ? Object.keys(previousSocial).length : 0;
  if (newPlatforms > oldPlatforms) return true;
  return false;
}

function evaluateTrophies(
  seo,
  social,
  savedCount,
  previousScore,
  previousSocial,
) {
  const earned = [];
  const tech = seo?.technical || {};
  const vitals = seo?.coreWebVitals || {};

  if (vitals.lcp?.displayValue && parseFloat(vitals.lcp.displayValue) < 2.5)
    earned.push("speed_demon");
  if (tech.security >= 100) earned.push("fort_knox");
  if (tech.mobile >= 90) earned.push("mobile_first");
  if ((seo?.score || 0) >= 80) earned.push("seo_star");
  if (tech.performance >= 90) earned.push("rocket_ship");
  if ((seo?.score || 0) >= 100) earned.push("perfect_score");

  if (previousScore !== null && seo?.score && seo.score - previousScore >= 20)
    earned.push("big_jump");

  if (social) {
    const platforms = Object.values(social);
    const maxFollowers = Math.max(
      ...platforms.map(
        (p) => p.profileData?.followers || p.followers || p.subscribers || 0,
      ),
    );
    const activePlatforms = platforms.filter((p) => p.exists !== false);
    const activePlatformCount = activePlatforms.length;
    const verifiedPlatforms = activePlatforms.filter((p) => p.verified);
    const isAnyVerified = verifiedPlatforms.length > 0;
    const isAllVerified =
      activePlatformCount > 0 &&
      verifiedPlatforms.length === activePlatformCount;

    if (maxFollowers >= 1000) earned.push("first_1k");
    if (maxFollowers >= 10000) earned.push("ten_k_club");
    if (maxFollowers >= 100000) earned.push("hundred_k");
    if (maxFollowers >= 1000000) earned.push("million_club");
    if (activePlatformCount >= 3) earned.push("multi_platform");
    if (isAnyVerified) earned.push("verified");
    if (isAllVerified && activePlatformCount >= 2) earned.push("full_house");

    const ig = social.instagram;
    if (ig?.engagement?.engagementRate) {
      const rate = parseFloat(ig.engagement.engagementRate);
      if (rate >= 5) earned.push("engagement_king");
    }

    const maxPosts = Math.max(
      social.instagram?.posts || 0,
      social.twitter?.tweets || 0,
      social.tiktok?.videos || 0,
      social.youtube?.videos || social.youtube?.videoCount || 0,
    );
    if (maxPosts >= 100) earned.push("content_machine");

    if (previousSocial) {
      const prevPlatforms = Object.values(previousSocial);
      const prevMaxFollowers = Math.max(
        ...prevPlatforms.map(
          (p) => p.profileData?.followers || p.followers || p.subscribers || 0,
        ),
      );
      if (prevMaxFollowers > 0 && maxFollowers >= prevMaxFollowers * 1.1)
        earned.push("growing_fast");
    }
  }

  if (savedCount === 1) earned.push("first_analysis");
  if (savedCount >= 5) earned.push("five_saves");
  if (savedCount >= 10) earned.push("ten_saves");

  return earned;
}

export function useTrophies(
  user,
  hybridAnalysis,
  websiteAnalysis,
  socialAnalysis,
) {
  const [trophies, setTrophies] = useState([]);
  const [newTrophies, setNewTrophies] = useState([]);
  const [streak, setStreak] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user?.id]);

  useEffect(() => {
    if (hybridAnalysis?.ready && hybridAnalysis?.result) {
      handleResult(
        hybridAnalysis.result.seo,
        hybridAnalysis.result.social,
        hybridAnalysis.result.url,
      );
    }
  }, [hybridAnalysis?.ready]);

  useEffect(() => {
    if (websiteAnalysis?.ready && websiteAnalysis?.result) {
      handleResult(
        websiteAnalysis.result.seo,
        null,
        websiteAnalysis.result.url,
      );
    }
  }, [websiteAnalysis?.ready]);

  useEffect(() => {
    if (socialAnalysis?.ready && socialAnalysis?.result?.social) {
      handleResult(null, socialAnalysis.result.social, "social");
    }
  }, [socialAnalysis?.ready]);

  const handleResult = async (seo, social, url) => {
    if (!user || !profile) return;
    if (!isOwnAnalysis(url, social, profile)) {
      console.log("🔍 Not own site/handles — not tracking");
      return;
    }
    console.log("✅ Own analysis confirmed — tracking progress");
    await saveProgress(seo, social, url);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [trophyRes, streakRes, analysisRes, profileRes, countRes] =
        await Promise.all([
          supabase
            .from("user_trophies")
            .select("trophy_key, earned_at")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false }),
          supabase
            .from("user_profiles")
            .select(
              "current_streak, longest_streak, last_check_date, streak_label",
            )
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("seo_analysis_history")
            .select("id, url, score, analysis_data, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("user_profiles")
            .select(
              "display_name, avatar_url, best_score, analysis_count_today, last_analysis_date, website_url, instagram_handle, twitter_handle, tiktok_handle, youtube_handle",
            )
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("seo_analysis_history")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

      const earned = (trophyRes.data || [])
        .map((row) => ({
          ...TROPHY_DEFINITIONS.find((d) => d.key === row.trophy_key),
          earned_at: row.earned_at,
        }))
        .filter(Boolean);
      setTrophies(earned);

      if (streakRes.data) setStreak(streakRes.data);
      if (analysisRes.data?.[0]) setLastAnalysis(analysisRes.data[0]);
      if (profileRes.data) setProfile(profileRes.data);
      setSavedCount(countRes.count || 0);
    } catch (e) {
      console.error("❌ Load data error:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let newStreak = 1;
      let longest = streak?.longest_streak || 0;
      if (streak?.last_check_date) {
        const diffDays = Math.floor(
          (new Date(today) - new Date(streak.last_check_date)) /
            (1000 * 60 * 60 * 24),
        );
        if (diffDays === 0) newStreak = streak.current_streak || 1;
        else if (diffDays === 1) newStreak = (streak.current_streak || 0) + 1;
        else newStreak = 1;
      }
      if (newStreak > longest) longest = newStreak;
      const streakLabel =
        newStreak >= 90
          ? "🌟 Legendary Streak"
          : newStreak >= 30
            ? "💫 Unstoppable"
            : newStreak >= 7
              ? "🔥 On Fire"
              : `${newStreak} day streak`;
      const streakData = {
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: longest,
        last_check_date: today,
        streak_label: streakLabel,
        updated_at: new Date().toISOString(),
      };
      await supabase
        .from("user_profiles")
        .upsert(streakData, { onConflict: "user_id" });
      setStreak(streakData);
      return { newStreak, streakLabel };
    } catch (e) {
      console.error("❌ Streak error:", e);
      return { newStreak: 0 };
    }
  };

  const saveProgress = async (seo, social, url) => {
    try {
      const score = calculateScore(seo, social);
      const previousScore = lastAnalysis?.score ?? null;
      const previousSocial = lastAnalysis?.social_data ?? null;
      const websiteScore = seo ? calculateScore(seo, null) : 0;
      const socialScore = social ? calculateScore(null, social) : 0;
      const persona = getPersona(websiteScore, socialScore);
      const level = getLevel(score);

      const earnedKeys = evaluateTrophies(
        seo,
        social,
        savedCount + 1,
        previousScore,
        previousSocial,
      );
      const existingKeys = trophies.map((t) => t.key);
      const newKeys = earnedKeys.filter((k) => !existingKeys.includes(k));
      const newDefs = TROPHY_DEFINITIONS.filter((d) => newKeys.includes(d.key));

      if (!shouldSave(score, previousScore, social, previousSocial, newDefs)) {
        console.log("⏭️ No meaningful change — skipping save");
        return;
      }

      console.log("💾 Saving meaningful progress — score:", score);

      const today = new Date().toISOString().split("T")[0];
      const isToday = profile?.last_analysis_date === today;
      const newDailyCount = isToday
        ? (profile?.analysis_count_today || 0) + 1
        : 1;

      // Save to seo_analysis_history (same table as website)
      if (seo) {
        await supabase.from("seo_analysis_history").insert({
          user_id: user.id,
          url,
          score: calculateScore(seo, null),
          analysis_data: seo,
          created_at: new Date().toISOString(),
        });
      }

      // Save to social_analysis_history (same table as website)
      if (social) {
        const handle =
          social.instagram?.handle ||
          social.twitter?.handle ||
          social.tiktok?.handle ||
          social.youtube?.handle ||
          null;
        await supabase.from("social_analysis_history").insert({
          user_id: user.id,
          handles: handle,
          social_score: calculateScore(null, social),
          social_data: social,
          created_at: new Date().toISOString(),
        });
      }

      const newCount = savedCount + 1;
      setSavedCount(newCount);
      setLastAnalysis({ score, social_data: social });

      // Award trophies
      if (newDefs.length > 0) {
        const inserts = newDefs.map((d) => ({
          user_id: user.id,
          trophy_key: d.key,
        }));
        const { data: awarded, error } = await supabase
          .from("user_trophies")
          .upsert(inserts, { onConflict: "user_id,trophy_key" })
          .select();

        console.log("🏆 Awarded:", awarded?.length, error);

        if (awarded?.length > 0) {
          const newEarned = awarded
            .map((row) => ({
              ...TROPHY_DEFINITIONS.find((d) => d.key === row.trophy_key),
              earned_at: row.earned_at,
            }))
            .filter(Boolean);
          setTrophies((prev) => [...newEarned, ...prev]);
          setNewTrophies(newEarned);
          setTimeout(() => setNewTrophies([]), 5000);
        }
      }

      // Update streak
      const { newStreak } = await updateStreak();

      // Update profile
      const newBestScore = Math.max(score, profile?.best_score || 0);
      await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          persona: persona.key,
          level: level.level,
          level_label: level.label,
          best_score: newBestScore,
          analysis_count_today: newDailyCount,
          last_analysis_date: today,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      setProfile((prev) => ({
        ...prev,
        best_score: newBestScore,
        analysis_count_today: newDailyCount,
        last_analysis_date: today,
      }));

      // Update leaderboard
      const platforms = social ? Object.values(social) : [];
      const totalFollowers = platforms.reduce(
        (acc, p) =>
          acc + (p.profileData?.followers || p.followers || p.subscribers || 0),
        0,
      );

      await supabase.from("leaderboard").upsert(
        {
          user_id: user.id,
          display_name: profile?.display_name || user.email?.split("@")[0],
          avatar_url: profile?.avatar_url,
          best_score: newBestScore,
          best_social_reach: totalFollowers,
          persona: persona.name,
          level: level.level,
          level_label: level.label,
          current_streak: newStreak,
          trophy_count: trophies.length + newDefs.length,
          is_legacy: newBestScore >= 95,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    } catch (e) {
      console.error("❌ Save progress error:", e);
    }
  };

  const updateProfile = async (updates) => {
    try {
      await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      setProfile((prev) => ({ ...prev, ...updates }));
    } catch (e) {
      console.error("❌ Update profile error:", e);
    }
  };

  return {
    trophies,
    newTrophies,
    streak,
    savedCount,
    lastAnalysis,
    profile,
    loading,
    updateProfile,
    loadData,
    saveProgress,
    TROPHY_DEFINITIONS,
    LEVELS,
    PERSONAS,
  };
}
