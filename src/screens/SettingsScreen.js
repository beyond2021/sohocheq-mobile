import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { COLORS, STRIPE_UPGRADE_URL } from '../constants';

export default function SettingsScreen({ authHook }) {
  const { user, isPremium, isProfessional, signOut } = authHook;

  const tier = isProfessional ? 'Professional' : isPremium ? 'Premium' : 'Free';
  const tierColor = isProfessional ? COLORS.purple : isPremium ? COLORS.primary : COLORS.textMuted;

  const handleUpgrade = async () => {
    await WebBrowser.openBrowserAsync(STRIPE_UPGRADE_URL);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>Account</Text>

      {/* User Card */}
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '22' }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{tier}</Text>
          </View>
        </View>
      </View>

      {/* Upgrade */}
      {!isProfessional && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upgrade</Text>
          <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
            <Text style={styles.upgradeTitle}>
              {isPremium ? '⬆️ Upgrade to Professional' : '✦ Upgrade to Premium'}
            </Text>
            <Text style={styles.upgradePrice}>
              {isPremium ? '$49/mo' : '$9.99/mo'}
            </Text>
            <Text style={styles.upgradeDesc}>
              {isPremium
                ? 'White-label reports, API access, priority support'
                : 'Unlimited analyses, AI advisor, PDF export'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => WebBrowser.openBrowserAsync('https://sohocheq.com')}
        >
          <Text style={styles.linkText}>Open Web App</Text>
          <Text style={styles.linkChevron}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => WebBrowser.openBrowserAsync('mailto:support@sohocheq.com')}
        >
          <Text style={styles.linkText}>Contact Support</Text>
          <Text style={styles.linkChevron}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, marginBottom: 28, borderWidth: 1, borderColor: COLORS.border,
  },
  avatarWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  userInfo: { flex: 1 },
  email: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100 },
  tierText: { fontSize: 12, fontWeight: '700' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  upgradeCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: COLORS.primary + '44',
  },
  upgradeTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  upgradePrice: { color: COLORS.primary, fontSize: 24, fontWeight: '900', marginBottom: 8 },
  upgradeDesc: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18 },
  linkRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  linkText: { color: COLORS.text, fontSize: 15 },
  linkChevron: { color: COLORS.textMuted, fontSize: 16 },
  signOutBtn: {
    marginTop: 12, padding: 16, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.red + '44', alignItems: 'center',
  },
  signOutText: { color: COLORS.red, fontSize: 15, fontWeight: '700' },
});
