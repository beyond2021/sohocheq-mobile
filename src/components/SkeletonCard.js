import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native"; // ✅ added StyleSheet
import MorphingShape from "./MorphingShape";

export default function SkeletonCard({
  height = 80,
  style,
  showMorph = false,
}) {
  const opacity = useRef(new Animated.Value(0.3)).current; // start lower for contrast

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
    <View
      style={[
        {
          height,
          borderRadius: 16,
          marginBottom: 12,
          backgroundColor: "#1e1e2f", // solid dark base (visible)
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#3a3a4a", // lighter color for shimmer
          opacity, // animates between 0.3 and 0.7
        }}
      />
      {showMorph && <MorphingShape size={80} color="#fd366e" />}
    </View>
  );
}
