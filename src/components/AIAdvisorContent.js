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
    if (result?.seo && !hasFetched.current) {
      hasFetched.current = true;
      fetchAdvice();
    }
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const seo = result.seo;
      const prompt = `Website: ${seo.analyzedUrl}. Score: ${seo.score}/100. Performance: ${seo.technical?.performance}. Mobile: ${seo.technical?.mobile}. Issues: ${seo.issues?.slice(0, 3).join(", ")}. Give 3 specific actionable recommendations to improve this website's SEO and performance. Be concise.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setAdvice(text);
    } catch (e) {
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
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
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
