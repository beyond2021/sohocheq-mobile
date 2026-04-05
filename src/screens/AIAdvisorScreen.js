// src/screens/AIAdvisorScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import { API_BASE } from "../constants";

export default function AIAdvisorScreen({ navigation, analysisHook }) {
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
      const url = result.url;
      const score = seo.score || 0;
      const performance = seo.technical?.performance || 0;
      const mobile = seo.technical?.mobile || 0;

      const res = await fetch(
        `${API_BASE}/analyze-seo?action=ai-summary&url=${encodeURIComponent(url)}&score=${score}&performance=${performance}&mobile=${mobile}&issues=${encodeURIComponent(issues)}`,
      );

      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();

      setAdvice(data);
    } catch (e) {
      setError(e.message || "AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!result?.seo) {
    return (
      <View style={globalStyles.empty}>
        <Text style={globalStyles.emptyText}>Run an analysis first</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={globalStyles.backLink}>← Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={globalStyles.inner}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.back}
      >
        <Text style={globalStyles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={globalStyles.aiHeader}>
        <View style={globalStyles.aiIconWrap}>
          <Text style={globalStyles.aiIcon}>🤖</Text>
        </View>
        <View>
          <Text style={globalStyles.aiTitle}>AI Social Media Advisor</Text>
          <Text style={globalStyles.aiSubtitle}>Powered by DeepSeek AI</Text>
        </View>
      </View>

      {loading && (
        <View style={globalStyles.aiLoading}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={globalStyles.aiLoadingText}>
            DeepSeek AI is analyzing...
          </Text>
        </View>
      )}

      {error && (
        <View style={globalStyles.aiError}>
          <Text style={globalStyles.error}>{error}</Text>
          <TouchableOpacity onPress={fetchAdvice} style={globalStyles.btnWrap}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={globalStyles.btn}
            >
              <Text style={globalStyles.btnText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {advice && !loading && (
        <View style={globalStyles.aiContent}>
          {/* AI Summary */}
          {advice.summary && (
            <View style={globalStyles.aiCard}>
              <View style={globalStyles.aiCardHeader}>
                <View style={globalStyles.aiCardBar} />
                <Text style={globalStyles.aiCardTitle}>AI Summary</Text>
              </View>
              <Text style={globalStyles.aiCardText}>{advice.summary}</Text>
            </View>
          )}

          {/* Recommendations */}
          {advice.recommendations?.length > 0 && (
            <View style={globalStyles.section}>
              <Text style={globalStyles.sectionTitle}>
                Actionable Recommendations
              </Text>
              {advice.recommendations.map((rec, i) => (
                <View key={i} style={globalStyles.aiRecCard}>
                  <View style={globalStyles.aiRecNum}>
                    <Text style={globalStyles.aiRecNumText}>{i + 1}</Text>
                  </View>
                  <Text style={globalStyles.aiRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Refresh */}
          <TouchableOpacity onPress={fetchAdvice} style={globalStyles.btnWrap}>
            <LinearGradient
              colors={["#7c3aed", "#db2777"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={globalStyles.btn}
            >
              <Text style={globalStyles.btnText}>🔄 Refresh Analysis</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
