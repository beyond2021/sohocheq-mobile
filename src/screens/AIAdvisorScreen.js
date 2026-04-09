import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
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
      const issues = seo.issues?.slice(0, 2).join(", ") || "No issues";
      const url = `${API_BASE}/analyze-seo?action=ai-summary&url=${encodeURIComponent(seo.analyzedUrl)}&score=${seo.score}&performance=${seo.technical?.performance}&mobile=${seo.technical?.mobile}&issues=${encodeURIComponent(issues)}`;

      console.log("🤖 AI URL:", url);
      const res = await fetch(url);
      console.log("🤖 AI status:", res.status);

      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      console.log("🤖 AI data:", JSON.stringify(data));
      setAdvice(data.summary || data.text || JSON.stringify(data));
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
        <Text style={globalStyles.btnText}>🔄 Refresh Analysis</Text>
      </TouchableOpacity>
    </View>
  );
}
