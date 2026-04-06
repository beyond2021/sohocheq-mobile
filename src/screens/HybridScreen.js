import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedInput from "../components/AnimatedInput";
import SkeletonCard from "../components/SkeletonCard";

export default function HybridScreen({
  navigation,
  analysisHook,
  authHook,
  step,
}) {
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const { analyze, loading, result, error, ready } = analysisHook;
  const { user } = authHook;

  useEffect(() => {
    if (ready && result) navigation.navigate("Results");
  }, [ready]);

  const handleAnalyze = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    analyze({ url: trimmedUrl, twitter, instagram, tiktok, youtube });
   
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={globalStyles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        {/* Logo */}
        <View style={globalStyles.logoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />

          {user && (
            <View style={globalStyles.avatar}>
              <Text style={globalStyles.avatarText}>
                {user.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {user && (
          <Text style={globalStyles.greeting}>
            Hey {user.email?.split("@")[0]} 👋
          </Text>
        )}

        {/* Hero */}
        <View style={globalStyles.hero}>
          <Text style={globalStyles.eyebrow}>Complete Analysis</Text>
          <Text style={globalStyles.heroTitle}>
            Website + Social{"\n"}in one shot
          </Text>
          <Text style={globalStyles.heroSub}>
            AI-powered analysis for brands that move fast
          </Text>
        </View>

        {/* Inputs */}
        <AnimatedInput
          label="Website URL"
          value={url}
          onChangeText={setUrl}
          placeholder="yourdomain.com"
          keyboardType="url"
          icon="🌐"
        />
        <AnimatedInput
          label="Twitter / X"
          value={twitter}
          onChangeText={setTwitter}
          placeholder="handle"
          icon="𝕏"
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
          label="YouTube"
          value={youtube}
          onChangeText={setYoutube}
          placeholder="handle"
          icon="▶️"
        />

        {error && <Text style={globalStyles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={globalStyles.btnWrap}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[globalStyles.btn, loading && globalStyles.btnDisabled]}
          >
            {loading ? (
              <View style={{ alignItems: "center" }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {step || "Analyzing..."}
                </Text>
              </View>
            ) : (
              <Text style={globalStyles.btnText}>Analyze →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={globalStyles.ticker}>
          Social media earnings calculator · Influencer earnings per post
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
