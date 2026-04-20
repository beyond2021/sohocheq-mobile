import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import {
  AIIcon,
  SocialReportIcon,
  GrowthIcon,
  HistoryIcon,
  BriefIcon,
} from "./icons/TabIcons";

export default function ActionBar({
  onAI,
  onSocial,
  onGrowth,
  hasSocial,
  onHistory,
  onBrief,
  hasUnread,
}) {
  const buttons = [
    onGrowth && {
      label: "Growth",
      Icon: GrowthIcon,
      onPress: onGrowth,
      colors: ["#7c3aed", "#c026d3"],
    },
    onAI && {
      label: "AI",
      Icon: AIIcon,
      onPress: onAI,
      colors: ["#a78bfa", "#7c3aed"],
    },
    onSocial && {
      label: "Social",
      Icon: SocialReportIcon,
      onPress: onSocial,
      colors: hasSocial ? ["#e1306c", "#fd366e"] : ["#333", "#444"],
      disabled: !hasSocial,
    },
    onHistory && {
      label: "History",
      Icon: HistoryIcon,
      onPress: onHistory,
      colors: ["#0ea5e9", "#6366f1"],
    },
    onBrief && {
      label: "Intel",
      Icon: BriefIcon,
      onPress: onBrief,
      colors: ["#fd366e", "#c026d3"],
      badge: hasUnread,
    },
  ].filter(Boolean);

  return (
    <View
      style={{
        position: "absolute",
        right: 16,
        bottom: 100,
        alignItems: "center",
        gap: 12,
      }}
    >
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.label}
          onPress={btn.onPress}
          disabled={btn.disabled}
          activeOpacity={0.85}
          style={{ alignItems: "center" }}
        >
          <LinearGradient
            colors={btn.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: btn.colors[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8,
              opacity: btn.disabled ? 0.3 : 1,
            }}
          >
            <btn.Icon color="#fff" size={22} />
            {btn.badge && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  borderWidth: 2,
                  borderColor: btn.colors[0],
                }}
              />
            )}
          </LinearGradient>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "700",
              color: "rgba(255,255,255,0.5)",
              marginTop: 4,
              letterSpacing: 0.5,
            }}
          >
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
