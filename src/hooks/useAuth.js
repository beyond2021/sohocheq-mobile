import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [profile, setProfile] = useState(null);

  const getDisplayName = (u) => {
    return (
      u?.user_metadata?.full_name ||
      u?.email?.split("@")[0].split(".")[0] ||
      "there"
    );
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserTier(session.user.id);
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserTier(session.user.id);
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      console.log("👤 Profile loaded:", JSON.stringify(data));
      console.log("👤 Profile error:", JSON.stringify(error));
      if (data) setProfile(data);
    } catch (e) {
      console.error("❌ Profile error:", e);
    }
  };

  // const loadUserTier = async (userId) => {
  //   try {
  //     const { data } = await supabase
  //       .from("users")
  //       .select("*, subscriptions(plan_tier, status)")
  //       .eq("id", userId)
  //       .single();
  //     if (data?.subscriptions?.length > 0) {
  //       const active = data.subscriptions.filter(
  //         (s) => s.status === "active" || s.status === "trialing",
  //       );
  //       const hasPro = active.some((s) => s.plan_tier === "professional");
  //       const hasPremium = active.some((s) => s.plan_tier === "premium");
  //       setIsProfessional(hasPro);
  //       setIsPremium(hasPro || hasPremium);
  //     }
  //   } catch (e) {
  //     console.error("Error loading tier:", e);
  //   }
  // };

  const loadUserTier = async (userId) => {
    try {
      // Step 1 — get users table (same as website)
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("⚠️ User not in DB:", error.message);
        return;
      }

      // Step 2 — start with is_premium flag (same as website)
      let highestTier = data.is_premium ? "premium" : null;

      // Step 3 — check subscriptions for professional (same as website)
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("plan_tier, stripe_price_id, status")
        .eq("user_id", userId);

      if (subs && subs.length > 0) {
        const hasPro = subs.find((s) => s.plan_tier === "professional");
        if (hasPro) {
          highestTier = "professional";
        }
      }

      console.log("🎯 Mobile tier:", highestTier);

      setIsProfessional(highestTier === "professional");
      setIsPremium(highestTier === "professional" || highestTier === "premium");
    } catch (e) {
      console.error("Error loading tier:", e);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email, password, fullName, handles = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (!error && data?.user) {
      const { error: fnError } = await supabase.functions.invoke(
        "swift-service",
        {
          body: {
            user_id: data.user.id,
            display_name: fullName,
            website_url: handles.website_url || null,
            instagram_handle: handles.instagram_handle || null,
            twitter_handle: handles.twitter_handle || null,
            tiktok_handle: handles.tiktok_handle || null,
            youtube_handle: handles.youtube_handle || null,
          },
        },
      );
      if (fnError) console.error("❌ Profile creation error:", fnError);
      else console.log("✅ Profile created securely");
    }

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsPremium(false);
    setIsProfessional(false);
    setProfile(null);
  };

  const updateName = async (fullName) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (!error && data?.user) setUser(data.user);
    return { error };
  };

  const updateProfile = async (updates) => {
    const { error } = await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (!error) setProfile((prev) => ({ ...prev, ...updates }));
    return { error };
  };

  return {
    user,
    session,
    loading,
    isPremium,
    isProfessional,
    signIn,
    signUp,
    signOut,
    updateName,
    updateProfile,
    displayName: getDisplayName(user),
    profile,
  };
}
