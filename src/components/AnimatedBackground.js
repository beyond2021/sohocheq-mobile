import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Gyroscope } from "expo-sensors";

const { width: W, height: H } = Dimensions.get("window");

export default function AnimatedBackground() {
  const orb1X = useRef(new Animated.Value(0)).current;
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb2X = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;
  const orb3X = useRef(new Animated.Value(0)).current;
  const orb3Y = useRef(new Animated.Value(0)).current;

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = (anim, duration, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    float(floatAnim1, 4000, 0);
    float(floatAnim2, 5000, 800);
    float(floatAnim3, 4500, 1600);

    // Auto-animate orbs in a slow circular pattern as fallback
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1X, {
          toValue: 30,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1X, {
          toValue: -30,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(orb1X, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2X, {
          toValue: -25,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(orb2X, {
          toValue: 25,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(orb2X, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb3X, {
          toValue: 20,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(orb3X, {
          toValue: -20,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(orb3X, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Try gyroscope on top
    Gyroscope.isAvailableAsync().then((available) => {
      if (!available) return;
      Gyroscope.setUpdateInterval(16);
      const sub = Gyroscope.addListener(({ x, y }) => {
        Animated.spring(orb1X, {
          toValue: y * 20,
          useNativeDriver: true,
          damping: 20,
        }).start();
        Animated.spring(orb1Y, {
          toValue: x * 20,
          useNativeDriver: true,
          damping: 20,
        }).start();
        Animated.spring(orb2X, {
          toValue: y * -15,
          useNativeDriver: true,
          damping: 25,
        }).start();
        Animated.spring(orb2Y, {
          toValue: x * -15,
          useNativeDriver: true,
          damping: 25,
        }).start();
        Animated.spring(orb3X, {
          toValue: y * 10,
          useNativeDriver: true,
          damping: 30,
        }).start();
        Animated.spring(orb3Y, {
          toValue: x * 10,
          useNativeDriver: true,
          damping: 30,
        }).start();
      });
      return () => sub.remove();
    });
  }, []);

  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Orb 1 — Pink */}
      <Animated.View
        style={[
          styles.orbWrap,
          {
            width: W * 0.85,
            height: W * 0.85,
            top: H * 0.0,
            left: -W * 0.25,
            transform: [
              { translateX: orb1X },
              { translateY: Animated.add(orb1Y, float1Y) },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.orb,
            { backgroundColor: "#fd366e", borderRadius: W * 0.425 },
          ]}
        />
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      </Animated.View>

      {/* Orb 2 — Purple */}
      <Animated.View
        style={[
          styles.orbWrap,
          {
            width: W * 0.75,
            height: W * 0.75,
            top: H * 0.25,
            right: -W * 0.25,
            transform: [
              { translateX: orb2X },
              { translateY: Animated.add(orb2Y, float2Y) },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.orb,
            { backgroundColor: "#c026d3", borderRadius: W * 0.375 },
          ]}
        />
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      </Animated.View>

      {/* Orb 3 — Violet */}
      <Animated.View
        style={[
          styles.orbWrap,
          {
            width: W * 0.65,
            height: W * 0.65,
            top: H * 0.5,
            left: W * 0.1,
            transform: [
              { translateX: orb3X },
              { translateY: Animated.add(orb3Y, float3Y) },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.orb,
            { backgroundColor: "#7c3aed", borderRadius: W * 0.325 },
          ]}
        />
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  orbWrap: {
    position: "absolute",
    overflow: "hidden",
    opacity: 0.35,
  },
  orb: {
    ...StyleSheet.absoluteFillObject,
  },
});
