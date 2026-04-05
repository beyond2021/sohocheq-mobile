import React, { useState } from "react";
import { Image } from "react-native";
import { globalStyles } from '../styles';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

export default function AuthScreen({ navigation, route, authHook }) {
  const [mode, setMode] = useState(route?.params?.mode || "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = authHook;

  const handleSubmit = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Please enter email and password.");
    setLoading(true);
    try {
      const { error } =
        mode === "signin"
          ? await signIn(email, password)
          : await signUp(email, password);

      if (error) Alert.alert("Error", error.message);
      else if (mode === "signup")
        Alert.alert(
          "Check your email",
          "Please verify your email to continue.",
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "signin"
            ? "Sign in to your account"
            : "Start your free trial today"}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textFaint}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textFaint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logoWrap: { alignItems: "center", marginBottom: 40 },
  logoSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 4,
    fontWeight: "600",
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: COLORS.textMuted, marginBottom: 32 },
  form: { gap: 12 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  btnWrap: { marginTop: 8 },
  btn: { borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  switchBtn: { alignItems: "center", marginTop: 16 },
  switchText: { color: COLORS.primary, fontSize: 14 },
});
