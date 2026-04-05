import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

export default function HomeScreen({ navigation, analysisHook, authHook }) {
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState("hybrid"); // hybrid | website | social
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const { analyze, loading, error } = analysisHook;
  const { user, isPremium } = authHook;

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    const handles =
      tab === "website" ? {} : { twitter, instagram, tiktok, youtube };
    await analyze({ url, ...handles });
    navigation.navigate("ResultsScreen");
  };

  const tabs = [
    { key: "hybrid", label: "⚡ Hybrid" },
    { key: "website", label: "🌐 Website" },
    { key: "social", label: "📱 Social" },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoSub}>SOH·O</Text>
            <Text style={styles.logo}>CHEQ</Text>
          </View>
          {user && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {user.email?.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Greeting */}
        {user && (
          <Text style={styles.greeting}>
            Hey {user.email?.split("@")[0]} 👋
          </Text>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text
                style={[styles.tabText, tab === t.key && styles.tabTextActive]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            {tab === "hybrid"
              ? "Complete Analysis"
              : tab === "website"
                ? "Website Analysis"
                : "Social Analysis"}
          </Text>
          <Text style={styles.heroTitle}>
            {tab === "hybrid"
              ? "Website + Social\nin one shot"
              : tab === "website"
                ? "Full website\nhealth check"
                : "Social media\nearnings report"}
          </Text>
          <Text style={styles.heroSub}>
            AI-powered analysis for brands that move fast
          </Text>
        </View>

        {/* URL Input */}
        {tab !== "social" && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://yourdomain.com"
              placeholderTextColor={COLORS.textFaint}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Social Handles */}
        {tab !== "website" && (
          <View style={styles.socialGrid}>
            <View style={styles.socialField}>
              <Text style={styles.inputLabel}>𝕏 Twitter</Text>
              <TextInput
                style={styles.input}
                placeholder="@handle"
                placeholderTextColor={COLORS.textFaint}
                value={twitter}
                onChangeText={setTwitter}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.socialField}>
              <Text style={styles.inputLabel}>📸 Instagram</Text>
              <TextInput
                style={styles.input}
                placeholder="@handle"
                placeholderTextColor={COLORS.textFaint}
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.socialField}>
              <Text style={styles.inputLabel}>▶ TikTok</Text>
              <TextInput
                style={styles.input}
                placeholder="@handle"
                placeholderTextColor={COLORS.textFaint}
                value={tiktok}
                onChangeText={setTiktok}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.socialField}>
              <Text style={styles.inputLabel}>▶️ YouTube</Text>
              <TextInput
                style={styles.input}
                placeholder="@handle"
                placeholderTextColor={COLORS.textFaint}
                value={youtube}
                onChangeText={setYoutube}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading || !url.trim()}
          style={styles.btnWrap}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.btn, (loading || !url.trim()) && styles.btnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Analyze →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Keyword ticker */}
        <Text style={styles.ticker}>
          Social media earnings calculator · Influencer earnings per post
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: 20, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoSub: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 3 },
  logo: { fontSize: 28, fontWeight: "900", color: COLORS.text },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  greeting: { fontSize: 15, color: COLORS.textMuted, marginBottom: 20 },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  hero: { marginBottom: 28 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 38,
    marginBottom: 10,
  },
  heroSub: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  socialGrid: { gap: 12, marginBottom: 16 },
  socialField: {},
  error: {
    color: COLORS.red,
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  btnWrap: { marginTop: 8 },
  btn: { borderRadius: 14, padding: 18, alignItems: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  ticker: {
    marginTop: 20,
    fontSize: 11,
    color: COLORS.textFaint,
    textAlign: "center",
  },
});
