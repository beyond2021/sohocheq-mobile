import React from "react";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

export function HybridIcon({ color = "#fd366e", size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M18 4L8 18h8l-2 10 12-16h-8z"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WebsiteIcon({ color = "#fd366e", size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M16 5 C12 10 12 22 16 27 M16 5 C20 10 20 22 16 27"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M5 16 Q10 13 16 16 Q22 19 27 16"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
    </Svg>
  );
}

export function SocialIcon({ color = "#fd366e", size = 26 }) {
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

export function SettingsIcon({ color = "#fd366e", size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle
        cx="16"
        cy="16"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M7.5 24.5l2.1-2.1M22.4 9.6l2.1-2.1"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}
