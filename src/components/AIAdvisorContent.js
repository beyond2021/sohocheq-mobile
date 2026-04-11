import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS, API_BASE } from "../constants";
import { globalStyles } from "../styles";

export default function AIAdvisorContent({ analysisHook }) {
  const { result } = analysisHook;
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if ((result?.seo || result?.social) && !hasFetched.current) {
      hasFetched.current = true;
      fetchAdvice();
    }
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const seo = result?.seo;
      const social = result?.social;

      const issues = seo?.issues?.slice(0, 3).join(", ") || "No major issues";

      // Build social summary
      const socialSummary = social
        ? Object.entries(social)
            .map(([platform, data]) => {
              const followers = data.followers || data.subscribers || 0;
              const posts = data.videos || data.tweets || data.posts || 0;
              return `${platform}: ${followers.toLocaleString()} followers, ${posts} posts`;
            })
            .join(". ")
        : "No social data";

      const url =
        `${API_BASE}/analyze-seo?action=ai-summary` +
        `&url=${encodeURIComponent(seo?.analyzedUrl || "unknown")}` +
        `&score=${seo?.score || 0}` +
        `&performance=${seo?.technical?.performance || 0}` +
        `&mobile=${seo?.technical?.mobile || 0}` +
        `&issues=${encodeURIComponent(issues)}` +
        `&social=${encodeURIComponent(socialSummary)}`;

      console.log("🤖 AI URL:", url);
      const res = await fetch(url);
      console.log("🤖 AI status:", res.status);
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      setAdvice(data.summary || data.text || null);
      if (!data.summary && !data.text) throw new Error("No advice returned");
    } catch (e) {
      console.error("🤖 AI error:", e);
      setError("Could not load AI advice. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 14 }}>
          AI analyzing your site...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text
          style={{ color: COLORS.red, marginBottom: 16, textAlign: "center" }}
        >
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => {
            hasFetched.current = false;
            fetchAdvice();
          }}
          style={globalStyles.btn}
        >
          <Text style={globalStyles.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!advice) return null;

  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.primary,
        }}
      >
        <Text style={{ fontSize: 14, color: COLORS.text, lineHeight: 24 }}>
          {advice}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          hasFetched.current = false;
          fetchAdvice();
        }}
        style={globalStyles.btn}
      >
        <Text style={globalStyles.btnText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
