import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import SkeletonCard from "../components/SkeletonCard";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomModal from "../components/BottomModal";
import DailyBriefCard from "../components/DailyBriefCard";
import { useDailyBrief } from "../hooks/useDailyBrief";

export default function HybridScreen({ navigation, analysisHook, authHook }) {
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [showBrief, setShowBrief] = useState(false);

  const { analyze, loading, result, error, ready, step } = analysisHook;
  const { user, displayName, profile, isPremium, isProfessional } = authHook;

  const briefHook = useDailyBrief(user, isPremium, isProfessional);
  const hasUnread = briefHook.brief && !briefHook.hasRead;

  useEffect(() => {
    if (profile) {
      if (profile.website_url) setUrl(profile.website_url);
      if (profile.instagram_handle) setInstagram(profile.instagram_handle);
      if (profile.twitter_handle) setTwitter(profile.twitter_handle);
      if (profile.tiktok_handle) setTiktok(profile.tiktok_handle);
      if (profile.youtube_handle) setYoutube(profile.youtube_handle);
    }
  }, [profile]);

  useEffect(() => {
    if (ready === true && result !== null) navigation.navigate("Results");
  }, [ready, result]);

  const handleAnalyze = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    analyze({ url: trimmedUrl, twitter, instagram, tiktok, youtube });
  };

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

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AnimatedBackground />

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
          <Text style={globalStyles.greeting}>Hey {displayName} 👋</Text>
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
          <Text style={globalStyles.btnText}>Analyze →</Text>
        </TouchableOpacity>

        <Text style={globalStyles.ticker}>
          Social media earnings calculator · Influencer earnings per post
        </Text>
      </ScrollView>

      {/* Floating Daily Brief Button */}
      {user && briefHook.brief && (
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => setShowBrief(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.floatingIcon}>📡</Text>
          {hasUnread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      )}

      {/* Daily Brief Modal */}
      <BottomModal
        visible={showBrief}
        onClose={() => setShowBrief(false)}
        title="Daily Intel"
      >
        <DailyBriefCard briefHook={briefHook} />
      </BottomModal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  floatingBtn: {
    position: "absolute",
    bottom: 32,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(253,54,110,0.15)",
    borderWidth: 1,
    borderColor: "rgba(253,54,110,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingIcon: { fontSize: 22 },
  unreadDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fd366e",
    borderWidth: 2,
    borderColor: "#0d0d14",
  },
});
