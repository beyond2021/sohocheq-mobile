import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserTier(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserTier(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserTier = async (userId) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("*, subscriptions(plan_tier, status)")
        .eq("id", userId)
        .single();

      if (data?.subscriptions?.length > 0) {
        const active = data.subscriptions.filter(
          (s) => s.status === "active" || s.status === "trialing",
        );
        const hasPro = active.some((s) => s.plan_tier === "professional");
        const hasPremium = active.some((s) => s.plan_tier === "premium");
        setIsProfessional(hasPro);
        setIsPremium(hasPro || hasPremium);
      }
    } catch (e) {
      console.error("Error loading tier:", e);
    }
  };

  const getDisplayName = (user) => {
    return (
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0].split(".")[0] ||
      "there"
    );
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsPremium(false);
    setIsProfessional(false);
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
    displayName: getDisplayName(user),
  };
}
