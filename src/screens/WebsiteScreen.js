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
import AnimatedBackground from "../components/AnimatedBackground";

export default function WebsiteScreen({ navigation, analysisHook, authHook }) {
  const [url, setUrl] = useState("");
  const { analyze, loading, result, error, ready, step, reset } = analysisHook;
  const { user, displayName, profile } = authHook;
  useEffect(() => {
    if (profile) {
      if (profile.website_url) setUrl(profile.website_url);
      if (profile.instagram_handle) setInstagram(profile.instagram_handle);
      if (profile.twitter_handle) setTwitter(profile.twitter_handle);
      if (profile.tiktok_handle) setTiktok(profile.tiktok_handle);
      if (profile.youtube_handle) setYoutube(profile.youtube_handle);
    }
  }, [profile]);

  useEffect(() => {
    if (ready === true && result !== null) navigation.navigate("Results");
  }, [ready, result]);

  const handleAnalyze = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    analyze({ url: trimmedUrl });
  };

  if (loading) {
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <Image
            source={require("../../assets/logo.png")}
            style={globalStyles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 13,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {step || "Analyzing..."}
        </Text>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <SkeletonCard
            height={140}
            style={{
              width: 140,
              borderRadius: 70,
              backgroundColor: "rgba(253,54,110,0.15)",
              borderColor: "rgba(253,54,110,0.3)",
            }}
            showMorph
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
          <SkeletonCard height={110} style={{ width: "47%" }} />
        </View>
        <SkeletonCard height={180} />
        <SkeletonCard height={58} style={{ marginTop: 12 }} />
        <TouchableOpacity
          onPress={reset}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={{ color: COLORS.red, fontSize: 14, fontWeight: "700" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AnimatedBackground />
      <ScrollView
        contentContainerStyle={globalStyles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
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
          <Text style={globalStyles.greeting}>Hey {displayName} 👋</Text>
        )}
        <View style={globalStyles.hero}>
          <Text style={globalStyles.eyebrow}>Website Analysis</Text>
          <Text style={globalStyles.heroTitle}>
            Full website{"\n"}health check
          </Text>
          <Text style={globalStyles.heroSub}>
            SEO, performance, Core Web Vitals and more
          </Text>
        </View>
        <AnimatedInput
          label="Website URL"
          value={url}
          onChangeText={setUrl}
          placeholder="yourdomain.com"
          keyboardType="url"
          icon="🌐"
        />
        {error && <Text style={globalStyles.error}>{error}</Text>}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={loading}
          style={globalStyles.btnWrap}
        >
          <Text style={globalStyles.btnText}>Analyze Website →</Text>
        </TouchableOpacity>
        <Text style={globalStyles.ticker}>
          Check my website SEO score · Website health check free
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
