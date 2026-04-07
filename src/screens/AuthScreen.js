import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import AnimatedBackground from "../components/AnimatedBackground";

export default function AuthScreen({ navigation, route, authHook }) {
  const [mode, setMode] = useState(route?.params?.mode || "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = authHook;

  const handleSubmit = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Please enter email and password.");
    if (mode === "signup" && !fullName.trim())
      return Alert.alert("Error", "Please enter your name.");
    setLoading(true);
    try {
      const { error } =
        mode === "signin"
          ? await signIn(email, password)
          : await signUp(email, password, fullName.trim());

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
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AnimatedBackground />
      <ScrollView
        contentContainerStyle={globalStyles.authInner}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={globalStyles.title}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </Text>
        <Text style={globalStyles.subtitle}>
          {mode === "signin"
            ? "Sign in to your account"
            : "Start your free trial today"}
        </Text>

        <View style={globalStyles.form}>
          {mode === "signup" && (
            <AnimatedInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Keevin Mitchell"
              icon="👤"
            />
          )}

          <AnimatedInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            icon="✉️"
          />

          <AnimatedInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            icon="🔒"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[globalStyles.btn, loading && globalStyles.btnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fd366e" />
            ) : (
              <Text style={globalStyles.btnText}>
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={globalStyles.switchBtn}
          >
            <Text style={globalStyles.switchText}>
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
