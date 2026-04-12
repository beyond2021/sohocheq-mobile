import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

const LEVEL_COLORS = {
  1: ["#555", "#333"],
  2: ["#6ee7b7", "#059669"],
  3: ["#60a5fa", "#2563eb"],
  4: ["#f472b6", "#db2777"],
  5: ["#fd366e", "#c026d3"],
  6: ["#f59e0b", "#d97706"],
  7: ["#FFD700", "#FFA500"],
};

export default function AvatarBadge({
  profile,
  trophies,
  user,
  size = 44,
  onPress,
}) {
  const initial =
    profile?.display_name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?";
  const colors = LEVEL_COLORS[profile?.level || 1];
  const latestTrophy = trophies?.[0];

  const avatar = (
    <View style={{ position: "relative" }}>
      <LinearGradient
        colors={colors}
        style={{
          width: size + 4,
          height: size + 4,
          borderRadius: (size + 4) / 2,
          padding: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#0d0d14",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ) : (
            <Text
              style={{ fontSize: size * 0.4, fontWeight: "900", color: "#fff" }}
            >
              {initial}
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* Latest trophy — automatic, no selection */}
      {latestTrophy && (
        <View
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#0d0d14",
            borderWidth: 1.5,
            borderColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 10 }}>{latestTrophy.trophy_emoji}</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {avatar}
      </TouchableOpacity>
    );
  }

  return avatar;
}
