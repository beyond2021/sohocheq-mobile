import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import SkeletonCard from "../components/SkeletonCard";

export default function HybridScreen({ navigation, analysisHook, authHook }) {
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const { analyze, loading, result, error, ready, step } = analysisHook;
  const { user } = authHook;

  useEffect(() => {
    if (ready === true && result !== null) {
      navigation.navigate("Results");
    }
  }, [ready, result]);

  const handleAnalyze = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    analyze({ url: trimmedUrl, twitter, instagram, tiktok, youtube });
  };

  // ── Skeleton loading state ──
  if (loading) {
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            color: COLORS.primary,
            fontSize: 13,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {step || "Analyzing..."}
        </Text>

        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <SkeletonCard
            height={140}
            style={{
              width: 140,
              borderRadius: 70,
              backgroundColor: "rgba(253,54,110,0.15)",
              borderColor: "rgba(253,54,110,0.3)",
            }}
            showMorph
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
        </View>

        <SkeletonCard height={180} />
        <SkeletonCard height={58} style={{ marginTop: 12 }} />

        <TouchableOpacity
          onPress={() => analysisHook.reset()}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={{ color: COLORS.red, fontSize: 14, fontWeight: "700" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Form ──
  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={globalStyles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />
          {user && (
            <View style={globalStyles.avatar}>
              <Text style={globalStyles.avatarText}>
                {user.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {user && (
          <Text style={globalStyles.greeting}>
            Hey {user.email?.split("@")[0]} 👋
          </Text>
        )}

        <View style={globalStyles.hero}>
          <Text style={globalStyles.eyebrow}>Complete Analysis</Text>
          <Text style={globalStyles.heroTitle}>
            Website + Social{"\n"}in one shot
          </Text>
          <Text style={globalStyles.heroSub}>
            AI-powered analysis for brands that move fast
          </Text>
        </View>

        <AnimatedInput
          label="Website URL"
          value={url}
          onChangeText={setUrl}
          placeholder="yourdomain.com"
          keyboardType="url"
          icon="🌐"
        />
        <AnimatedInput
          label="Twitter / X"
          value={twitter}
          onChangeText={setTwitter}
          placeholder="handle"
          icon="𝕏"
        />
        <AnimatedInput
          label="Instagram"
          value={instagram}
          onChangeText={setInstagram}
          placeholder="handle"
          icon="📸"
        />
        <AnimatedInput
          label="TikTok"
          value={tiktok}
          onChangeText={setTiktok}
          placeholder="handle"
          icon="🎵"
        />
        <AnimatedInput
          label="YouTube"
          value={youtube}
          onChangeText={setYoutube}
          placeholder="handle"
          icon="▶️"
        />

        {error && <Text style={globalStyles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={globalStyles.btnWrap}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={globalStyles.btn}
          >
            <Text style={globalStyles.btnText}>Analyze →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={globalStyles.ticker}>
          Social media earnings calculator · Influencer earnings per post
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
