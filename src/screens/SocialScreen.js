import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import SkeletonCard from "../components/SkeletonCard";
import AnimatedBackground from "../components/AnimatedBackground";

const { width } = Dimensions.get("window");

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function estimateWorthPerPost(followers, platform) {
  const base = followers * 0.01;
  const multipliers = {
    instagram: 1.2,
    youtube: 2.0,
    tiktok: 0.8,
    twitter: 0.5,
  };
  const worth = base * (multipliers[platform] || 1);
  if (worth >= 1000) return "$" + (worth / 1000).toFixed(1) + "K";
  return "$" + Math.round(worth);
}

function PlatformCard({
  platform,
  icon,
  color,
  handle,
  followers,
  posts,
  postsLabel,
  verified,
}) {
  const worth = estimateWorthPerPost(followers, platform);
  return (
    <View style={{ marginBottom: 16 }}>
      <LinearGradient
        colors={[color + "22", color + "08"]}
        style={{
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: color + "44",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: color + "33",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 22 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}
            >
              @{handle}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textMuted,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {platform}
            </Text>
          </View>
          {verified && (
            <View
              style={{
                backgroundColor: color + "33",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 100,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color }}>
                ✓ Verified
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{ fontSize: 22, fontWeight: "900", color: COLORS.text }}
            >
              {formatNumber(followers)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              Followers
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{ fontSize: 22, fontWeight: "900", color: COLORS.text }}
            >
              {formatNumber(posts)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              {postsLabel}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: "900", color }}>
              {worth}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              Per Post
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>💰</Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 13,
              color: COLORS.textMuted,
              lineHeight: 18,
            }}
          >
            Estimated <Text style={{ color, fontWeight: "800" }}>{worth}</Text>{" "}
            per sponsored post
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function SocialScreen({ navigation, analysisHook, authHook }) {
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const { analyze, loading, result, error, ready, reset, step } = analysisHook;
  const { user } = authHook;
  const social = result?.social;

  useEffect(() => {
    if (ready && result?.social) {
      // Stay on this screen and show results
    }
  }, [ready]);

  const handleAnalyze = () => {
    const hasHandles = [twitter, instagram, tiktok, youtube].some((h) =>
      h?.trim(),
    );
    if (!hasHandles) return;
    analyze({
      url: "https://sohocheq.com",
      twitter,
      instagram,
      tiktok,
      youtube,
    });
  };

  const handleReset = () => {
    reset();
    setTwitter("");
    setInstagram("");
    setTiktok("");
    setYoutube("");
  };

  if (loading) {
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <View>
            <Text style={globalStyles.logoSub}>SOH·O</Text>
            <Text style={globalStyles.logo}>CHEQ</Text>
          </View>
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
          {step || "Calculating social reach..."}
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
        <TouchableOpacity
          onPress={reset}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={{ color: COLORS.red, fontSize: 14, fontWeight: "700" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Show results if we have social data
  if (social && Object.keys(social).length > 0) {
    const { instagram: ig, twitter: tw, tiktok: tt, youtube: yt } = social;

    const platforms = [
      ig && {
        key: "instagram",
        icon: "📸",
        color: "#e1306c",
        handle: ig.handle,
        followers: ig.profileData?.followers || ig.followers || 0,
        posts: ig.posts || 0,
        postsLabel: "Posts",
        verified: ig.profileData?.isVerified || ig.verified || false,
      },
      tw && {
        key: "twitter",
        icon: "𝕏",
        color: "#1da1f2",
        handle: tw.handle,
        followers: tw.followers || 0,
        posts: tw.tweets || 0,
        postsLabel: "Tweets",
        verified: tw.verified || false,
      },
      tt && {
        key: "tiktok",
        icon: "🎵",
        color: "#ff0050",
        handle: tt.handle,
        followers: tt.followers || 0,
        posts: tt.videos || 0,
        postsLabel: "Videos",
        verified: false,
      },
      yt && {
        key: "youtube",
        icon: "▶️",
        color: "#ff0000",
        handle: yt.handle,
        followers: yt.subscribers || 0,
        posts: yt.videos || yt.videoCount || 0,
        postsLabel: "Videos",
        verified: yt.verified || false,
      },
    ].filter(Boolean);

    const totalFollowers = platforms.reduce((acc, p) => acc + p.followers, 0);

    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <View>
            <Text style={globalStyles.logoSub}>SOH·O</Text>
            <Text style={globalStyles.logo}>CHEQ</Text>
          </View>
          <TouchableOpacity
            onPress={handleReset}
            style={{
              backgroundColor: COLORS.surface,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              ← New
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={["#7c3aed22", "#db277722"]}
          style={{
            borderRadius: 24,
            padding: 24,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: "#7c3aed44",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#a78bfa",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            Social Health Report
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: COLORS.text,
              marginBottom: 4,
            }}
          >
            {formatNumber(totalFollowers)}
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
            Total followers across all platforms
          </Text>
        </LinearGradient>

        <Text style={globalStyles.sectionTitle}>Platform Breakdown</Text>

        {platforms.map((p) => (
          <PlatformCard
            key={p.key}
            platform={p.key}
            icon={p.icon}
            color={p.color}
            handle={p.handle}
            followers={p.followers}
            posts={p.posts}
            postsLabel={p.postsLabel}
            verified={p.verified}
          />
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate("AIAdvisor")}
          style={globalStyles.btnWrap}
        >
          <LinearGradient
            colors={["#7c3aed", "#db2777"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={globalStyles.btn}
          >
            <Text style={globalStyles.btnText}>🤖 Get AI Strategy →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Input mode
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
        <View style={globalStyles.header}>
          <View>
            <Text style={globalStyles.logoSub}>SOH·O</Text>
            <Text style={globalStyles.logo}>CHEQ</Text>
          </View>
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
          <Text style={globalStyles.eyebrow}>Social Analysis</Text>
          <Text style={globalStyles.heroTitle}>
            Social media{"\n"}earnings report
          </Text>
          <Text style={globalStyles.heroSub}>
            How much is your social media worth per post?
          </Text>
        </View>

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
            style={[globalStyles.btn, loading && globalStyles.btnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.btnText}>Check My Worth →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={globalStyles.ticker}>
          How much is my Instagram worth · Influencer earnings per post
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
