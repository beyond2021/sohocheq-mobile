import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { COLORS } from "../constants";

export default function SkeletonCard({ height = 80, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          height,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
          opacity,
        },
        style,
      ]}
    />
  );
}
