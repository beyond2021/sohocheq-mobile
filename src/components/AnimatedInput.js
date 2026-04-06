import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants";

export default function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  secureTextEntry = false,
  autoComplete,
  icon,
}) {
  const [focused, setFocused] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.parallel([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.parallel([
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textFaint, COLORS.primary],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [13, 11],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginBottom: 14,
      }}
    >
      <Animated.View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 14,
          borderWidth: borderWidth,
          borderColor: borderColor,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Animated.Text
          style={{
            fontSize: labelSize,
            color: labelColor,
            fontWeight: "600",
            letterSpacing: 0.3,
            marginBottom: 4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Animated.Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon && (
            <Text style={{ fontSize: 14, marginRight: 8, opacity: 0.6 }}>
              {icon}
            </Text>
          )}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textFaint}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              flex: 1,
              fontSize: 15,
              color: COLORS.text,
              padding: 0,
              fontWeight: "500",
            }}
          />
          {value.length > 0 && !secureTextEntry && (
            <TouchableOpacity onPress={() => onChangeText("")}>
              <Text style={{ color: COLORS.textFaint, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
