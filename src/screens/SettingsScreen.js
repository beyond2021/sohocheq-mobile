import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { COLORS, STRIPE_UPGRADE_URL } from "../constants";
import { globalStyles } from "../styles";
import AnimatedBackground from "../components/AnimatedBackground";
import AnimatedInput from "../components/AnimatedInput";

export default function SettingsScreen({ authHook }) {
  const { user, isPremium, isProfessional, signOut, profile, updateProfile } = authHook;

  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || "");
  const [instagram, setInstagram] = useState(profile?.instagram_handle || "");
  const [twitter, setTwitter] = useState(profile?.twitter_handle || "");
  const [tiktok, setTiktok] = useState(profile?.tiktok_handle || "");
  const [youtube, setYoutube] = useState(profile?.youtube_handle || "");
  const [saving, setSaving] = useState(false);

  const tier = isProfessional ? "Professional" : isPremium ? "Premium" : "Free";
  const tierColor = isProfessional ? COLORS.purple : isPremium ? COLORS.primary : COLORS.textMuted;

  const handleUpdateHandles = async () => {
    setSaving(true);
    await updateProfile({
      website_url: websiteUrl.trim(),
      instagram_handle: instagram.replace("@", "").trim(),
      twitter_handle: twitter.replace("@", "").trim(),
      tiktok_handle: tiktok.replace("@", "").trim(),
      youtube_handle: youtube.replace("@", "").trim(),
    });
    Alert.alert("Saved", "Your handles have been updated.");
    setSaving(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AnimatedBackground />
      <ScrollView contentContainerStyle={globalStyles.inner} showsVerticalScrollIndicator={false}>

        <Text style={globalStyles.heroTitle}>Account</Text>

        {/* User Card */}
        <View style={globalStyles.card}>
          <View style={globalStyles.avatarWrap}>
            <Text style={globalStyles.avatarLarge}>
              {user?.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={globalStyles.userInfo}>
            <Text style={globalStyles.email}>{user?.email}</Text>
            <View style={[globalStyles.tierBadge, { backgroundColor: tierColor + "22" }]}>
              <Text style={[globalStyles.tierText, { color: tierColor }]}>{tier}</Text>
            </View>
          </View>
        </View>

        {/* My Website & Handles */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionLabel}>My Website & Handles</Text>
          <Text style={{ fontSize: 12, color: COLORS.textFaint, marginBottom: 12, lineHeight: 18 }}>
            Only analyses of these count toward your score and trophies
          </Text>
          <AnimatedInput label="Website" value={websiteUrl} onChangeText={setWebsiteUrl} placeholder="yourdomain.com" keyboardType="url" icon="🌐" />
          <AnimatedInput label="Instagram" value={instagram} onChangeText={setInstagram} placeholder="handle" icon="📸" />
          <AnimatedInput label="TikTok" value={tiktok} onChangeText={setTiktok} placeholder="handle" icon="🎵" />
          <AnimatedInput label="Twitter / X" value={twitter} onChangeText={setTwitter} placeholder="handle" icon="𝕏" />
          <AnimatedInput label="YouTube" value={youtube} onChangeText={setYoutube} placeholder="handle" icon="▶️" />
          <TouchableOpacity onPress={handleUpdateHandles} disabled={saving} style={[globalStyles.btn, { marginTop: 4 }]}>
            {saving ? <ActivityIndicator color="#fd366e" /> : <Text style={globalStyles.btnText}>Save Handles</Text>}
          </TouchableOpacity>
        </View>

        {/* Upgrade */}
        {!isProfessional && (
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionLabel}>Upgrade</Text>
            <TouchableOpacity style={globalStyles.upgradeCard} onPress={() => WebBrowser.openBrowserAsync(STRIPE_UPGRADE_URL)}>
              <Text style={globalStyles.upgradeTitle}>
                {isPremium ? "⬆️ Upgrade to Professional" : "✦ Upgrade to Premium"}
              </Text>
              <Text style={globalStyles.upgradePrice}>{isPremium ? "$49/mo" : "$9.99/mo"}</Text>
              <Text style={globalStyles.upgradeDesc}>
                {isPremium ? "White-label reports, API access, priority support" : "Unlimited analyses, AI advisor, PDF export"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Links */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionLabel}>More</Text>
          <TouchableOpacity style={globalStyles.linkRow} onPress={() => WebBrowser.openBrowserAsync("https://sohocheq.com")}>
            <Text style={globalStyles.linkText}>Open Web App</Text>
            <Text style={globalStyles.linkChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.linkRow} onPress={() => WebBrowser.openBrowserAsync("mailto:support@sohocheq.com")}>
            <Text style={globalStyles.linkText}>Contact Support</Text>
            <Text style={globalStyles.linkChevron}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={globalStyles.signOutBtn} onPress={handleSignOut}>
          <Text style={globalStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}