import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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

export default function WebsiteScreen({ navigation, analysisHook, authHook }) {
  const [url, setUrl] = useState("");
  const { analyze, loading, result, error, ready } = analysisHook;
  const { user } = authHook;

  useEffect(() => {
    if (ready && result) navigation.navigate("Results");
  }, [ready]);

  const handleAnalyze = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    analyze({ url: trimmedUrl });
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
        <View style={globalStyles.header}>
          <View>
            <Text style={globalStyles.logoSub}>SOH·O</Text>
            <Text style={globalStyles.logo}>CHEQ</Text>
          </View>
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
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[globalStyles.btn, loading && globalStyles.btnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.btnText}>Analyze Website →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={globalStyles.ticker}>
          Check my website SEO score · Website health check free
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
