import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { COLORS } from "../constants";

function AIIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M20 8 C14 8 10 12 10 17 C10 20 11 22 13 24 C13 27 15 29 18 29 L22 29 C25 29 27 27 27 24 C29 22 30 20 30 17 C30 12 26 8 20 8Z"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 29 L16 33 M24 29 L24 33"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M16 33 L24 33"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M14 16 Q16 13 20 15 Q24 13 26 16"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Path
        d="M10 17 L8 17 M30 17 L32 17"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Circle cx="15" cy="19" r="1.5" fill={color} />
      <Circle cx="25" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

function SocialIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Rect
        x="5"
        y="20"
        width="5"
        height="7"
        rx="1.5"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Rect
        x="13"
        y="14"
        width="5"
        height="13"
        rx="1.5"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Rect
        x="21"
        y="7"
        width="5"
        height="20"
        rx="1.5"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle
        cx="8"
        cy="11"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M12 8 Q16 5 20 8"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ResultsIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle
        cx="20"
        cy="20"
        r="14"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
      />
      <Path
        d="M20 6 A14 14 0 1 1 6.5 26"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Path
        d="M16 20 L19 23 L24 17"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ActionBar({
  onResults,
  onAI,
  onSocial,
  hasResults,
  hasSocial,
}) {
  const actions = [
    {
      label: "Results",
      Icon: ResultsIcon,
      onPress: onResults,
      active: hasResults,
      color: hasResults ? COLORS.primary : "rgba(255,255,255,0.25)",
    },
    {
      label: "AI Advisor",
      Icon: AIIcon,
      onPress: onAI,
      active: hasResults,
      color: hasResults ? "#a78bfa" : "rgba(255,255,255,0.25)",
    },
    {
      label: "Social",
      Icon: SocialIcon,
      onPress: onSocial,
      active: hasSocial,
      color: hasSocial ? "#e1306c" : "rgba(255,255,255,0.25)",
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#0d0d14",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.08)",
        paddingBottom: 16,
        paddingTop: 10,
        paddingHorizontal: 20,
      }}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          onPress={action.onPress}
          disabled={!action.active}
          style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
          activeOpacity={0.7}
        >
          <action.Icon color={action.color} size={24} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: action.color,
              marginTop: 4,
            }}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
