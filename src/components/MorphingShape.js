import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SHAPES = [
  // Circle
  "M 60 20 A 40 40 0 1 1 59.9 20 Z",
  // Square
  "M 20 20 L 100 20 L 100 100 L 20 100 Z",
  // Triangle
  "M 60 10 L 110 100 L 10 100 Z",
  // Infinity
  "M 60 60 C 60 40 80 30 90 40 C 110 55 110 75 90 80 C 80 85 60 75 60 60 C 60 45 40 35 30 40 C 10 55 10 75 30 80 C 40 85 60 75 60 60 Z",
  // Diamond
  "M 60 10 L 110 60 L 60 110 L 10 60 Z",
  // Star
  "M 60 10 L 72 45 L 110 45 L 80 67 L 91 102 L 60 80 L 29 102 L 40 67 L 10 45 L 48 45 Z",
];

export default function MorphingShape({ size = 120, color = "#fd366e" }) {
  const progress = useRef(new Animated.Value(0)).current;
  const shapeIndex = useRef(0);
  const currentPath = useRef(SHAPES[0]);
  const nextPath = useRef(SHAPES[1]);
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animate = () => {
      shapeIndex.current = (shapeIndex.current + 1) % SHAPES.length;
      nextPath.current = SHAPES[(shapeIndex.current + 1) % SHAPES.length];

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        currentPath.current = SHAPES[shapeIndex.current];
        animate();
      });
    };

    animate();
  }, []);

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
          opacity,
          transform: [
            {
              scale: opacity.interpolate({
                inputRange: [0.4, 0.8],
                outputRange: [0.85, 1],
              }),
            },
          ],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d={SHAPES[shapeIndex.current % SHAPES.length]}
            fill="none"
            stroke={color}
            strokeWidth="3"
            opacity="0.6"
          />
          <Path
            d={SHAPES[(shapeIndex.current + 1) % SHAPES.length]}
            fill={color}
            opacity="0.15"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
