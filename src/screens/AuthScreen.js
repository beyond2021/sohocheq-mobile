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
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import AnimatedBackground from "../components/AnimatedBackground";

export default function AuthScreen({ authHook }) {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = authHook;

  const handleSubmit = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Please enter email and password.");
    if (mode === "signup" && !fullName.trim())
      return Alert.alert("Error", "Please enter your name.");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) Alert.alert("Error", error.message);
      } else {
        const { error } = await signUp(email, password, fullName.trim(), {
          website_url: websiteUrl.trim(),
          instagram_handle: instagram.replace("@", "").trim(),
          twitter_handle: twitter.replace("@", "").trim(),
          tiktok_handle: tiktok.replace("@", "").trim(),
          youtube_handle: youtube.replace("@", "").trim(),
        });
        if (error) Alert.alert("Error", error.message);
        else
          Alert.alert(
            "Check your email",
            "Please verify your email to continue.",
          );
      }
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
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[globalStyles.heroTitle, { marginBottom: 4 }]}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </Text>
        <Text style={[globalStyles.heroSub, { marginBottom: 28 }]}>
          {mode === "signin"
            ? "Sign in to your account"
            : "Start your free trial today"}
        </Text>

        {mode === "signup" && (
          <AnimatedInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
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

        {mode === "signup" && (
          <>
            <View style={{ marginVertical: 16 }}>
              <Text style={[globalStyles.eyebrow, { marginBottom: 12 }]}>
                Your Presence
              </Text>
              <Text
                style={[
                  globalStyles.heroSub,
                  { marginBottom: 16, fontSize: 13 },
                ]}
              >
                Add your website and social handles so we can track your real
                growth.
              </Text>
              <AnimatedInput
                label="Your Website"
                value={websiteUrl}
                onChangeText={setWebsiteUrl}
                placeholder="yourdomain.com"
                keyboardType="url"
                icon="🌐"
              />
              <AnimatedInput
                label="Instagram"
                value={instagram}
                onChangeText={setInstagram}
                placeholder="handle"
                icon="📸"
              />
              <AnimatedInput
                label="TikTok"
                value={tiktok}
                onChangeText={setTiktok}
                placeholder="handle"
                icon="🎵"
              />
              <AnimatedInput
                label="Twitter / X"
                value={twitter}
                onChangeText={setTwitter}
                placeholder="handle"
                icon="𝕏"
              />
              <AnimatedInput
                label="YouTube"
                value={youtube}
                onChangeText={setYoutube}
                placeholder="handle"
                icon="▶️"
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textFaint,
                textAlign: "center",
                marginBottom: 16,
                lineHeight: 16,
              }}
            >
              Only analyses of your registered website and handles count toward
              your score and trophies.
            </Text>
          </>
        )}

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
