import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import SkeletonCard from "../components/SkeletonCard";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomModal from "../components/BottomModal";
import DailyBriefCard from "../components/DailyBriefCard";
import { useDailyBrief } from "../hooks/useDailyBrief";
import TrophyModal from "../components/TrophyModal";
import HistoryContent from "../components/HistoryContent";
import { useHistory } from "../hooks/useHistory";
import ActionBar from "../components/ActionBar";

export default function HybridScreen({
  navigation,
  analysisHook,
  authHook,
  trophyHook,
}) {
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [showBrief, setShowBrief] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { analyze, loading, result, error, ready, step } = analysisHook;
  const { user, displayName, profile, isPremium, isProfessional, session } =
    authHook;

  const briefHook = useDailyBrief(user, isPremium, isProfessional);
  const hasUnread = briefHook.brief && !briefHook.hasRead;
  const trophies = trophyHook?.trophies || [];
  const historyHook = useHistory(user, isPremium, isProfessional);

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
    analyze(
      { url: trimmedUrl, twitter, instagram, tiktok, youtube },
      session?.access_token,
      trophyHook,
    );
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

        {trophies.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowTrophies(true)}
            style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}
          >
            {trophies.slice(0, 6).map((t) => (
              <Text key={t.key} style={{ fontSize: 22 }}>
                {t.emoji}
              </Text>
            ))}
          </TouchableOpacity>
        )}

        <TrophyModal
          visible={showTrophies}
          onClose={() => setShowTrophies(false)}
          trophies={trophies}
        />

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

      {/* ActionBar — History + Daily Brief */}
      {user && (
        <ActionBar
          onHistory={() => {
            historyHook.fetchHistory();
            setShowHistory(true);
          }}
          onBrief={briefHook.brief ? () => setShowBrief(true) : null}
          hasUnread={hasUnread}
        />
      )}

      {/* Daily Brief Modal */}
      <BottomModal
        visible={showBrief}
        onClose={() => setShowBrief(false)}
        title="Daily Intel"
      >
        <DailyBriefCard briefHook={briefHook} />
      </BottomModal>

      {/* History Modal */}
      <BottomModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        title="Analysis History"
      >
        <HistoryContent
          historyHook={historyHook}
          onReanalyze={(item) => {
            if (item.url) setUrl(item.url);
            if (item.instagram) setInstagram(item.instagram);
            if (item.twitter) setTwitter(item.twitter);
            if (item.tiktok) setTiktok(item.tiktok);
            if (item.youtube) setYoutube(item.youtube);
            setShowHistory(false);
          }}
        />
      </BottomModal>
    </KeyboardAvoidingView>
  );
}
