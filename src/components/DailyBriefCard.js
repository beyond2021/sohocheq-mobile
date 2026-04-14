import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { COLORS, STRIPE_UPGRADE_URL } from "../constants";

const THREAT_COLORS = {
  green: {
    bg: "rgba(34,197,94,0.15)",
    border: "#22c55e",
    label: "🟢 All Good",
  },
  yellow: {
    bg: "rgba(234,179,8,0.15)",
    border: "#eab308",
    label: "🟡 Stay Alert",
  },
  red: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", label: "🔴 Act Now" },
};

const IMPACT_COLORS = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

export default function DailyBriefCard({ briefHook }) {
  const { brief, loading, hasRead, hasAccess, briefStreak, markAsRead } =
    briefHook;
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator color={COLORS.primary} size="small" />
        <Text style={styles.loadingText}>Loading today's intel...</Text>
      </View>
    );
  }

  if (!brief) return null;

  const threat = THREAT_COLORS[brief.threat_level] || THREAT_COLORS.yellow;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Locked teaser for free users
  if (!hasAccess) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={["rgba(253,54,110,0.08)", "rgba(192,38,211,0.08)"]}
          style={styles.lockedGradient}
        >
          <View style={styles.lockedHeader}>
            <Text style={styles.dateLabel}>📡 {today}</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.lockedHeadline}>{brief.headline}</Text>
          <View style={styles.lockedContent}>
            <View style={styles.blurRow} />
            <View style={[styles.blurRow, { width: "80%" }]} />
            <View style={[styles.blurRow, { width: "60%" }]} />
          </View>
          <TouchableOpacity
            style={styles.unlockBtn}
            onPress={() => WebBrowser.openBrowserAsync(STRIPE_UPGRADE_URL)}
          >
            <Text style={styles.unlockText}>
              Unlock Daily Intel → Upgrade to Premium
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateLabel}>📡 Daily Intel · {today}</Text>
          {briefStreak > 1 && (
            <Text style={styles.streakLabel}>
              🔥 {briefStreak} day reading streak
            </Text>
          )}
        </View>
        <View
          style={[
            styles.threatBadge,
            { backgroundColor: threat.bg, borderColor: threat.border },
          ]}
        >
          <Text style={[styles.threatText, { color: threat.border }]}>
            {threat.label}
          </Text>
        </View>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>{brief.headline}</Text>

      {/* SEO Update */}
      <View style={styles.updateRow}>
        <View style={styles.updateIcon}>
          <Text style={styles.updateIconText}>🔍</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.updateTitleRow}>
            <Text style={styles.updateTitle}>{brief.seo_update?.title}</Text>
            <View
              style={[
                styles.impactDot,
                { backgroundColor: IMPACT_COLORS[brief.seo_update?.impact] },
              ]}
            />
          </View>
          <Text style={styles.updateInsight}>{brief.seo_update?.insight}</Text>
        </View>
      </View>

      {/* Social Update */}
      <View style={styles.updateRow}>
        <View style={styles.updateIcon}>
          <Text style={styles.updateIconText}>📱</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.updateTitleRow}>
            <Text style={styles.updateTitle}>{brief.social_update?.title}</Text>
            <View
              style={[
                styles.impactDot,
                { backgroundColor: IMPACT_COLORS[brief.social_update?.impact] },
              ]}
            />
          </View>
          <Text style={styles.updateInsight}>
            {brief.social_update?.insight}
          </Text>
        </View>
      </View>

      {/* Action Today */}
      <View style={styles.actionBox}>
        <Text style={styles.actionLabel}>⚡ YOUR MOVE TODAY</Text>
        <Text style={styles.actionText}>{brief.action_today}</Text>
      </View>

      {/* Pro Tip - expandable */}
      {expanded && (
        <View style={styles.proTipBox}>
          <Text style={styles.proTipLabel}>💡 PRO TIP</Text>
          <Text style={styles.proTipText}>{brief.pro_tip}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            setExpanded(!expanded);
            if (!hasRead) markAsRead();
          }}
        >
          <Text style={styles.expandText}>
            {expanded ? "Show less" : "Pro tip →"}
          </Text>
        </TouchableOpacity>

        {!hasRead && (
          <TouchableOpacity onPress={markAsRead} style={styles.readBtn}>
            <Text style={styles.readBtnText}>Mark as read ✓</Text>
          </TouchableOpacity>
        )}
        {hasRead && <Text style={styles.readConfirm}>✓ Read</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    marginBottom: 20,
  },
  loadingText: { fontSize: 13, color: "rgba(255,255,255,0.4)" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  streakLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  threatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  threatText: { fontSize: 10, fontWeight: "700" },

  // Headline
  headline: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
    lineHeight: 22,
  },

  // Updates
  updateRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  updateIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  updateIconText: { fontSize: 16 },
  updateTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  updateTitle: { fontSize: 12, fontWeight: "700", color: "#fff" },
  impactDot: { width: 6, height: 6, borderRadius: 3 },
  updateInsight: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 18,
  },

  // Action
  actionBox: {
    backgroundColor: "rgba(253,54,110,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(253,54,110,0.2)",
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    lineHeight: 18,
  },

  // Pro tip
  proTipBox: {
    backgroundColor: "rgba(168,85,247,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.2)",
  },
  proTipLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#a855f7",
    letterSpacing: 1,
    marginBottom: 4,
  },
  proTipText: { fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 18 },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  readBtn: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  readBtnText: { fontSize: 12, color: "#22c55e", fontWeight: "600" },
  readConfirm: { fontSize: 12, color: "#22c55e" },

  // Locked
  lockedGradient: { borderRadius: 16, padding: 18 },
  lockedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  proBadge: {
    backgroundColor: "rgba(253,54,110,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  lockedHeadline: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 14,
  },
  lockedContent: { gap: 8, marginBottom: 16 },
  blurRow: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    width: "100%",
  },
  unlockBtn: {
    backgroundColor: "rgba(253,54,110,0.15)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(253,54,110,0.3)",
  },
  unlockText: { fontSize: 13, color: COLORS.primary, fontWeight: "700" },
});
