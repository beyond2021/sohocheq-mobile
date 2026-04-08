import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function estimateWorth(followers, platform) {
  const base = followers * 0.01;
  const m = { instagram: 1.2, youtube: 2.0, tiktok: 0.8, twitter: 0.5 };
  const worth = base * (m[platform] || 1);
  if (worth >= 1000) return "$" + (worth / 1000).toFixed(1) + "K";
  return "$" + Math.round(worth);
}

export default function SocialContent({ analysisHook }) {
  const { result } = analysisHook;
  const social = result?.social;

  if (!social || Object.keys(social).length === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>
          No social data available
        </Text>
      </View>
    );
  }

  const { instagram: ig, twitter: tw, tiktok: tt, youtube: yt } = social;

  const platforms = [
    ig && {
      key: "instagram",
      icon: "📸",
      color: "#e1306c",
      handle: ig.handle,
      followers: ig.profileData?.followers || ig.followers || 0,
      posts: ig.posts || 0,
      label: "Posts",
    },
    tw && {
      key: "twitter",
      icon: "𝕏",
      color: "#1da1f2",
      handle: tw.handle,
      followers: tw.followers || 0,
      posts: tw.tweets || 0,
      label: "Tweets",
    },
    tt && {
      key: "tiktok",
      icon: "🎵",
      color: "#ff0050",
      handle: tt.handle,
      followers: tt.followers || 0,
      posts: tt.videos || 0,
      label: "Videos",
    },
    yt && {
      key: "youtube",
      icon: "▶️",
      color: "#ff0000",
      handle: yt.handle,
      followers: yt.subscribers || 0,
      posts: yt.videos || yt.videoCount || 0,
      label: "Videos",
    },
  ].filter(Boolean);

  const totalFollowers = platforms.reduce((acc, p) => acc + p.followers, 0);

  return (
    <View style={{ gap: 16 }}>
      {/* Total */}
      <LinearGradient
        colors={["#7c3aed22", "#db277722"]}
        style={{
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#7c3aed44",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#a78bfa",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 6,
          }}
        >
          Total Reach
        </Text>
        <Text style={{ fontSize: 32, fontWeight: "900", color: COLORS.text }}>
          {formatNumber(totalFollowers)}
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
          followers across all platforms
        </Text>
      </LinearGradient>

      {/* Platform cards */}
      {platforms.map((p) => (
        <View
          key={p.key}
          style={{
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: p.color + "44",
            backgroundColor: p.color + "11",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 10 }}>{p.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "800", color: COLORS.text }}
              >
                @{p.handle}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {p.key}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: p.color + "22",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 100,
              }}
            >
              <Text style={{ color: p.color, fontWeight: "800", fontSize: 14 }}>
                {estimateWorth(p.followers, p.key)}
              </Text>
              <Text
                style={{
                  color: p.color,
                  fontSize: 9,
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                per post
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "900", color: COLORS.text }}
              >
                {formatNumber(p.followers)}
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textMuted }}>
                Followers
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "900", color: COLORS.text }}
              >
                {formatNumber(p.posts)}
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textMuted }}>
                {p.label}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
