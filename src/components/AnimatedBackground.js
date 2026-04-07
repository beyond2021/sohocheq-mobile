import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { Gyroscope } from "expo-sensors";

const { width: W, height: H } = Dimensions.get("window");

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export default function AnimatedBackground() {
  const orb1X = useRef(new Animated.Value(W * 0.3)).current;
  const orb1Y = useRef(new Animated.Value(H * 0.25)).current;
  const orb1RX = useRef(new Animated.Value(W * 0.5)).current;
  const orb1RY = useRef(new Animated.Value(W * 0.55)).current;

  const orb2X = useRef(new Animated.Value(W * 0.75)).current;
  const orb2Y = useRef(new Animated.Value(H * 0.15)).current;
  const orb2RX = useRef(new Animated.Value(W * 0.4)).current;
  const orb2RY = useRef(new Animated.Value(W * 0.35)).current;

  const orb3X = useRef(new Animated.Value(W * 0.2)).current;
  const orb3Y = useRef(new Animated.Value(H * 0.65)).current;
  const orb3RX = useRef(new Animated.Value(W * 0.45)).current;
  const orb3RY = useRef(new Animated.Value(W * 0.35)).current;

  useEffect(() => {
    const loop = (anim, values, duration) => {
      const animations = values.map(v =>
        Animated.timing(anim, { toValue: v, duration: duration / values.length, useNativeDriver: false })
      );
      Animated.loop(Animated.sequence(animations)).start();
    };

    // Orb 1 — pink, large, slow
    loop(orb1X, [W * 0.3, W * 0.2, W * 0.35, W * 0.25, W * 0.3], 12000);
    loop(orb1Y, [H * 0.25, H * 0.15, H * 0.3, H * 0.2, H * 0.25], 14000);
    loop(orb1RX, [W * 0.5, W * 0.55, W * 0.45, W * 0.52, W * 0.5], 10000);
    loop(orb1RY, [W * 0.55, W * 0.48, W * 0.58, W * 0.52, W * 0.55], 10000);

    // Orb 2 — purple, medium
    loop(orb2X, [W * 0.75, W * 0.85, W * 0.7, W * 0.8, W * 0.75], 15000);
    loop(orb2Y, [H * 0.15, H * 0.1, H * 0.2, H * 0.12, H * 0.15], 11000);
    loop(orb2RX, [W * 0.4, W * 0.45, W * 0.38, W * 0.42, W * 0.4], 13000);
    loop(orb2RY, [W * 0.35, W * 0.3, W * 0.38, W * 0.33, W * 0.35], 13000);

    // Orb 3 — violet, large bottom
    loop(orb3X, [W * 0.2, W * 0.15, W * 0.28, W * 0.18, W * 0.2], 18000);
    loop(orb3Y, [H * 0.65, H * 0.7, H * 0.6, H * 0.68, H * 0.65], 16000);
    loop(orb3RX, [W * 0.45, W * 0.5, W * 0.42, W * 0.48, W * 0.45], 14000);
    loop(orb3RY, [W * 0.35, W * 0.32, W * 0.38, W * 0.34, W * 0.35], 14000);

    // Gyroscope
    Gyroscope.isAvailableAsync().then(available => {
      if (!available) return;
      Gyroscope.setUpdateInterval(16);
      const sub = Gyroscope.addListener(({ x, y }) => {
        Animated.spring(orb1X, { toValue: W * 0.3 + y * 30, useNativeDriver: false, damping: 20 }).start();
        Animated.spring(orb2X, { toValue: W * 0.75 + y * -20, useNativeDriver: false, damping: 25 }).start();
        Animated.spring(orb3X, { toValue: W * 0.2 + y * 15, useNativeDriver: false, damping: 30 }).start();
      });
      return () => sub.remove();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="g1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#fd366e" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#fd366e" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#c026d3" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <AnimatedEllipse
          cx={orb1X}
          cy={orb1Y}
          rx={orb1RX}
          ry={orb1RY}
          fill="url(#g1)"
        />
        <AnimatedEllipse
          cx={orb2X}
          cy={orb2Y}
          rx={orb2RX}
          ry={orb2RY}
          fill="url(#g2)"
        />
        <AnimatedEllipse
          cx={orb3X}
          cy={orb3Y}
          rx={orb3RX}
          ry={orb3RY}
          fill="url(#g3)"
        />
      </Svg>
    </View>
  );
}