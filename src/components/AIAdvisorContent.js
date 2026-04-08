import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import { API_BASE } from "../constants";

export default function AIAdvisorContent({ analysisHook }) {
  const { result } = analysisHook;
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result?.seo) fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const seo = result.seo;
      const issues = seo.issues?.slice(0, 2).join(", ") || "No issues";
      const res = await fetch(
        `${API_BASE}/analyze-seo?action=ai-summary&url=${encodeURIComponent(seo.analyzedUrl)}&score=${seo.score}&performance=${seo.technical?.performance}&mobile=${seo.technical?.mobile}&issues=${encodeURIComponent(issues)}`,
      );
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      setAdvice(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 14 }}>
          DeepSeek AI analyzing...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text style={globalStyles.error}>{error}</Text>
        <TouchableOpacity
          onPress={fetchAdvice}
          style={[globalStyles.btn, { marginTop: 12 }]}
        >
          <Text style={globalStyles.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!advice) return null;

  return (
    <View style={{ gap: 16 }}>
      {advice.summary && (
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              gap: 10,
            }}
          >
            <View
              style={{
                width: 3,
                height: 20,
                borderRadius: 2,
                backgroundColor: COLORS.primary,
              }}
            />
            <Text
              style={{ fontSize: 15, fontWeight: "700", color: COLORS.text }}
            >
              AI Summary
            </Text>
          </View>
          <Text
            style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}
          >
            {advice.summary}
          </Text>
        </View>
      )}

      {advice.recommendations?.map((rec, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderLeftWidth: 3,
            borderLeftColor: COLORS.purple,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: COLORS.purple + "33",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
              marginTop: 2,
            }}
          >
            <Text
              style={{ color: COLORS.purple, fontWeight: "800", fontSize: 12 }}
            >
              {i + 1}
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              color: COLORS.text,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {rec}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        onPress={fetchAdvice}
        style={[globalStyles.btn, { marginTop: 8 }]}
      >
        <Text style={globalStyles.btnText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}
