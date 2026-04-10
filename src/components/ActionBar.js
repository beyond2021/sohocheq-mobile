import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { COLORS } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { AIIcon, SocialReportIcon } from "./icons/TabIcons";

function GrowthIcon({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M4 24 L10 16 L16 20 L22 10 L28 6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6 L28 6 L28 12"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="10" cy="16" r="2" fill={color} />
      <Circle cx="16" cy="20" r="2" fill={color} />
      <Circle cx="22" cy="10" r="2" fill={color} />
    </Svg>
  );
}

export default function ActionBar({ onAI, onSocial, onGrowth, hasSocial }) {
  const buttons = [
    {
      label: "Growth",
      Icon: GrowthIcon,
      onPress: onGrowth,
      colors: ["#7c3aed", "#c026d3"],
    },
    {
      label: "AI",
      Icon: AIIcon,
      onPress: onAI,
      colors: ["#a78bfa", "#7c3aed"],
    },
    {
      label: "Social",
      Icon: SocialReportIcon,
      onPress: onSocial,
      colors: hasSocial ? ["#e1306c", "#fd366e"] : ["#333", "#444"],
      disabled: !hasSocial,
    },
  ];

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
