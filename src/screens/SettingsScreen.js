import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { COLORS, STRIPE_UPGRADE_URL } from "../constants";
import { globalStyles } from "../styles";
import AnimatedBackground from "../components/AnimatedBackground";
import AnimatedInput from "../components/AnimatedInput";

export default function SettingsScreen({ authHook }) {
  const { user, isPremium, isProfessional, signOut, updateName, displayName } =
    authHook;
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);

  const tier = isProfessional ? "Professional" : isPremium ? "Premium" : "Free";
  const tierColor = isProfessional
    ? COLORS.purple
    : isPremium
      ? COLORS.primary
      : COLORS.textMuted;

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await updateName(name.trim());
    if (error) Alert.alert("Error", error.message);
    else Alert.alert("Saved", "Your name has been updated.");
    setSaving(false);
  };

  const handleUpgrade = async () => {
    await WebBrowser.openBrowserAsync(STRIPE_UPGRADE_URL);
  };

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AnimatedBackground />
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[globalStyles.title, { fontFamily: "Syne_800ExtraBold" }]}>
          Account
        </Text>

        {/* User Card */}
        <View style={globalStyles.card}>
          <View style={globalStyles.avatarWrap}>
            <Text style={globalStyles.avatarLarge}>
              {user?.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={globalStyles.userInfo}>
            <Text style={globalStyles.email}>{displayName}</Text>
            <Text
              style={{ color: COLORS.textFaint, fontSize: 12, marginBottom: 6 }}
            >
              {user?.email}
            </Text>
            <View
              style={[
                globalStyles.tierBadge,
                { backgroundColor: tierColor + "22" },
              ]}
            >
              <Text style={[globalStyles.tierText, { color: tierColor }]}>
                {tier}
              </Text>
            </View>
          </View>
        </View>

        {/* Update Name */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionLabel}>Display Name</Text>
          <AnimatedInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            icon="👤"
          />
          <TouchableOpacity
            onPress={handleUpdateName}
            disabled={saving}
            style={[globalStyles.btn, { marginTop: 4 }]}
          >
            {saving ? (
              <ActivityIndicator color="#fd366e" />
            ) : (
              <Text style={globalStyles.btnText}>Update Name</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Upgrade */}
        {!isProfessional && (
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionLabel}>Upgrade</Text>
            <TouchableOpacity
              style={globalStyles.upgradeCard}
              onPress={handleUpgrade}
            >
              <Text style={globalStyles.upgradeTitle}>
                {isPremium
                  ? "⬆️ Upgrade to Professional"
                  : "✦ Upgrade to Premium"}
              </Text>
              <Text style={globalStyles.upgradePrice}>
                {isPremium ? "$49/mo" : "$9.99/mo"}
              </Text>
              <Text style={globalStyles.upgradeDesc}>
                {isPremium
                  ? "White-label reports, API access, priority support"
                  : "Unlimited analyses, AI advisor, PDF export"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Links */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionLabel}>More</Text>
          <TouchableOpacity
            style={globalStyles.linkRow}
            onPress={() => WebBrowser.openBrowserAsync("https://sohocheq.com")}
          >
            <Text style={globalStyles.linkText}>Open Web App</Text>
            <Text style={globalStyles.linkChevron}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.linkRow}
            onPress={() =>
              WebBrowser.openBrowserAsync("mailto:support@sohocheq.com")
            }
          >
            <Text style={globalStyles.linkText}>Contact Support</Text>
            <Text style={globalStyles.linkChevron}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={globalStyles.signOutBtn}
          onPress={handleSignOut}
        >
          <Text style={globalStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
