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

export function TrafficIcon({ color = "#fd366e", size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        d="M5 24 Q10 18 15 20 Q20 22 27 10"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 10 L27 10 L27 15"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 28 L27 28"
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

export function ResultsIcon({ color = "#fd366e", size = 26 }) {
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

export function AIIcon({ color = "#a78bfa", size = 26 }) {
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

export function SocialReportIcon({ color = "#e1306c", size = 26 }) {
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
