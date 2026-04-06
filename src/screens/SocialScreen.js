import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";

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
  data,
  followers,
  posts,
  extra,
}) {
  if (!data?.exists) return null;

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
        {/* Platform Header */}
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
              @{data.username}
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
          {data.verified && (
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

        {/* Stats Row */}
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
              {extra?.label || "Posts"}
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

        {/* Worth Bar */}
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
            per sponsored post based on {formatNumber(followers)} followers
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function SocialScreen({ navigation, analysisHook }) {
  const { result } = analysisHook;
  const social = result?.social;

  if (!social || social.length === 0) {
    return (
      <View style={globalStyles.empty}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>📱</Text>
        <Text style={globalStyles.emptyText}>No social data yet</Text>
        <Text
          style={{
            color: COLORS.textFaint,
            fontSize: 13,
            textAlign: "center",
            marginBottom: 24,
            paddingHorizontal: 40,
          }}
        >
          Add your social handles and run an analysis
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={globalStyles.backLink}>← Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const instagram = social.find((s) => s?.username)?.instagram || social[0];
  const twitter = social.find((s) => s?.twitter) || social[1];
  const tiktok = social.find((s) => s?.tiktok) || social[2];
  const youtube = social.find((s) => s?.youtube) || social[3];

  const totalFollowers = social.reduce((acc, s) => {
    return acc + (s?.followers || s?.subscribers || 0);
  }, 0);

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={globalStyles.inner}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.back}
      >
        <Text style={globalStyles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Hero */}
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

      {/* Platform Cards */}
      <Text style={globalStyles.sectionTitle}>Platform Breakdown</Text>

      {social.map((platform, i) => {
        if (!platform) return null;

        const isInstagram = platform.username && platform.posts !== undefined;
        const isTwitter = platform.tweets !== undefined;
        const isTiktok = platform.videos !== undefined;
        const isYoutube = platform.subscribers !== undefined;

        if (isInstagram)
          return (
            <PlatformCard
              key={i}
              platform="instagram"
              icon="📸"
              color="#e1306c"
              data={{ exists: true, username: platform.username }}
              followers={platform.followers || 0}
              posts={platform.posts || 0}
              extra={{ label: "Posts" }}
            />
          );

        if (isTwitter)
          return (
            <PlatformCard
              key={i}
              platform="twitter"
              icon="𝕏"
              color="#1da1f2"
              data={{
                exists: true,
                username: platform.username,
                verified: platform.verified,
              }}
              followers={platform.followers || 0}
              posts={platform.tweets || 0}
              extra={{ label: "Tweets" }}
            />
          );

        if (isTiktok)
          return (
            <PlatformCard
              key={i}
              platform="tiktok"
              icon="🎵"
              color="#ff0050"
              data={{ exists: true, username: platform.username }}
              followers={platform.followers || 0}
              posts={platform.videos || 0}
              extra={{ label: "Videos" }}
            />
          );

        if (isYoutube)
          return (
            <PlatformCard
              key={i}
              platform="youtube"
              icon="▶️"
              color="#ff0000"
              data={{ exists: true, username: platform.username }}
              followers={platform.subscribers || 0}
              posts={platform.videoCount || 0}
              extra={{ label: "Videos" }}
            />
          );

        return null;
      })}

      {/* AI Advisor CTA */}
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
