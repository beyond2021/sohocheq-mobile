import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Path, Circle, Rect, Polygon } from "react-native-svg";

const SHAPES = [
  { type: "circle" },
  { type: "rect" },
  { type: "hex" },
  { type: "star" },
  { type: "diamond" },
];

function Shape({ type, size, color, opacity }) {
  const c = size / 2;
  const r = size * 0.38;

  if (type === "circle") {
    return (
      <Svg width={size} height={size}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          fill={color + "20"}
          stroke={color}
          strokeWidth="2.5"
        />
      </Svg>
    );
  }

  if (type === "rect") {
    const pad = size * 0.15;
    return (
      <Svg width={size} height={size}>
        <Rect
          x={pad}
          y={pad}
          width={size - pad * 2}
          height={size - pad * 2}
          rx="12"
          fill={color + "20"}
          stroke={color}
          strokeWidth="2.5"
        />
      </Svg>
    );
  }

  if (type === "hex") {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
    }).join(" ");
    return (
      <Svg width={size} height={size}>
        <Polygon
          points={pts}
          fill={color + "20"}
          stroke={color}
          strokeWidth="2.5"
        />
      </Svg>
    );
  }

  if (type === "star") {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      return `${c + rad * Math.cos(a)},${c + rad * Math.sin(a)}`;
    }).join(" ");
    return (
      <Svg width={size} height={size}>
        <Polygon
          points={pts}
          fill={color + "20"}
          stroke={color}
          strokeWidth="2.5"
        />
      </Svg>
    );
  }

  if (type === "diamond") {
    const pts = `${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`;
    return (
      <Svg width={size} height={size}>
        <Polygon
          points={pts}
          fill={color + "20"}
          stroke={color}
          strokeWidth="2.5"
        />
      </Svg>
    );
  }

  return null;
}

export default function MorphingShape({ size = 120, color = "#fd366e" }) {
  const [shapeIndex, setShapeIndex] = useState(0);
  const fadeOut = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeOut, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeOut, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setTimeout(() => {
        setShapeIndex((prev) => (prev + 1) % SHAPES.length);
      }, 400);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale }],
          opacity: fadeOut,
        }}
      >
        <Shape type={SHAPES[shapeIndex].type} size={size} color={color} />
      </Animated.View>
    </View>
  );
}
