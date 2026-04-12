import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  BlurView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import AnimatedBackground from "../components/AnimatedBackground";
import { useSearchConsole } from "../hooks/useSearchConsole";

const ADDON_URL = "https://sohocheq.com/traffic-addon"; // your Stripe add-on link

function StatCard({ label, value, sub, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color: color || COLORS.primary }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function KeywordRow({ keyword, clicks, impressions, position }) {
  const posColor =
    position <= 3
      ? COLORS.green
      : position <= 10
        ? COLORS.yellow
        : COLORS.textMuted;
  return (
    <View style={styles.keywordRow}>
      <Text style={styles.keywordText} numberOfLines={1}>
        {keyword}
      </Text>
      <View style={styles.keywordStats}>
        <Text style={styles.keywordClicks}>{clicks} clicks</Text>
        <View
          style={[styles.positionBadge, { backgroundColor: posColor + "22" }]}
        >
          <Text style={[styles.positionText, { color: posColor }]}>
            #{position}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Blurred teaser row shown to non-subscribers
function LockedRow() {
  return (
    <View style={[styles.keywordRow, styles.lockedRow]}>
      <View style={styles.lockedBar} />
      <View style={styles.keywordStats}>
        <View style={[styles.lockedBar, { width: 60 }]} />
        <View
          style={[
            styles.positionBadge,
            { backgroundColor: COLORS.textMuted + "22" },
          ]}
        >
          <Text style={[styles.positionText, { color: COLORS.textMuted }]}>
            #--
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TrafficScreen({ authHook }) {
  const { user, isPremium, isProfessional, profile } = authHook;
  const hasAddon = isPremium || isProfessional; // adjust when you add the addon flag

  const gsc = useSearchConsole(hasAddon ? user : null, profile?.website_url);

  // ── Not subscribed — show teaser ──
  if (!hasAddon) {
    return (
      <View style={globalStyles.container}>
        <AnimatedBackground />
        <ScrollView
          contentContainerStyle={globalStyles.inner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={globalStyles.heroTitle}>Traffic Insights</Text>
          <Text style={[globalStyles.heroSub, { marginBottom: 24 }]}>
            See exactly where your organic traffic comes from and how much
            you're saving vs paid ads
          </Text>

          {/* Teaser stats — blurred */}
          <View style={styles.teaserCard}>
            <View style={styles.teaserStats}>
              <View style={styles.teaserStat}>
                <View
                  style={[
                    styles.lockedBar,
                    { width: 60, height: 28, borderRadius: 6, marginBottom: 6 },
                  ]}
                />
                <Text style={styles.statLabel}>Monthly Clicks</Text>
              </View>
              <View style={styles.teaserStat}>
                <View
                  style={[
                    styles.lockedBar,
                    { width: 80, height: 28, borderRadius: 6, marginBottom: 6 },
                  ]}
                />
                <Text style={styles.statLabel}>Impressions</Text>
              </View>
              <View style={styles.teaserStat}>
                <View
                  style={[
                    styles.lockedBar,
                    { width: 50, height: 28, borderRadius: 6, marginBottom: 6 },
                  ]}
                />
                <Text style={styles.statLabel}>Avg Position</Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.teaserSectionLabel}>TOP KEYWORDS</Text>
              <LockedRow />
              <LockedRow />
              <LockedRow />
              <LockedRow />
              <LockedRow />
            </View>

            {/* Lock overlay */}
            <View style={styles.lockOverlay}>
              <Text style={styles.lockEmoji}>🔍</Text>
              <Text style={styles.lockTitle}>Your traffic data is waiting</Text>
              <Text style={styles.lockSub}>
                Connect Google Search Console to see your real keyword rankings,
                organic clicks, and how much you're saving vs Google Ads
              </Text>
              <TouchableOpacity
                style={styles.unlockBtn}
                onPress={() => WebBrowser.openBrowserAsync(ADDON_URL)}
              >
                <LinearGradient
                  colors={["#fd366e", "#c026d3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.unlockGradient}
                >
                  <Text style={styles.unlockText}>Unlock Traffic Insights</Text>
                  <Text style={styles.unlockPrice}>$4.99/mo add-on</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.lockNote}>
                Works with any plan · Cancel anytime
              </Text>
            </View>
          </View>

          {/* Value props */}
          <View style={styles.valueProps}>
            {[
              {
                emoji: "📈",
                title: "Real organic clicks",
                sub: "Not estimates — your actual Google Search data",
              },
              {
                emoji: "💰",
                title: "CPC savings tracker",
                sub: "See how much free traffic saves you vs paid ads",
              },
              {
                emoji: "🎯",
                title: "Keyword rankings",
                sub: "Exactly which terms you rank for and where",
              },
              {
                emoji: "🏆",
                title: "Trophy integration",
                sub: "Traffic gains unlock gold trophies automatically",
              },
            ].map((v, i) => (
              <View key={i} style={styles.valueProp}>
                <Text style={styles.valuePropEmoji}>{v.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.valuePropTitle}>{v.title}</Text>
                  <Text style={styles.valuePropSub}>{v.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Subscribed but not connected ──
  if (!gsc.connected) {
    return (
      <View style={globalStyles.container}>
        <AnimatedBackground />
        <ScrollView
          contentContainerStyle={globalStyles.inner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={globalStyles.heroTitle}>Traffic Insights</Text>

          <View style={styles.connectCard}>
            <Text style={styles.connectEmoji}>🔍</Text>
            <Text style={styles.connectTitle}>
              Connect Google Search Console
            </Text>
            <Text style={styles.connectSub}>
              Read-only access · Google never sees your password · Disconnect
              anytime
            </Text>
            {gsc.error && <Text style={styles.errorText}>{gsc.error}</Text>}
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={gsc.connect}
              disabled={gsc.loading}
            >
              {gsc.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.connectBtnText}>Connect with Google</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.valueProps}>
            {[
              {
                emoji: "📈",
                title: "Real organic clicks",
                sub: "Your actual Google Search data, not estimates",
              },
              {
                emoji: "💰",
                title: "CPC savings tracker",
                sub: "See how much free traffic saves vs paid ads",
              },
              {
                emoji: "🎯",
                title: "Keyword rankings",
                sub: "Exactly which terms you rank for and where",
              },
              {
                emoji: "🏆",
                title: "Trophy integration",
                sub: "Traffic gains unlock gold trophies automatically",
              },
            ].map((v, i) => (
              <View key={i} style={styles.valueProp}>
                <Text style={styles.valuePropEmoji}>{v.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.valuePropTitle}>{v.title}</Text>
                  <Text style={styles.valuePropSub}>{v.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Connected — show data ──
  const d = gsc.data;

  return (
    <View style={globalStyles.container}>
      <AnimatedBackground />
      <ScrollView
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={globalStyles.heroTitle}>Traffic Insights</Text>
          <TouchableOpacity onPress={gsc.refresh} disabled={gsc.loading}>
            <Text style={styles.refreshText}>
              {gsc.loading ? "Refreshing..." : "↻ Refresh"}
            </Text>
          </TouchableOpacity>
        </View>

        {gsc.loading && !d ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : d ? (
          <>
            {/* Stats row */}
            <View style={styles.statsRow}>
              <StatCard
                label="Monthly Clicks"
                value={d.totalClicks?.toLocaleString() || "0"}
                color={COLORS.primary}
              />
              <StatCard
                label="Impressions"
                value={d.totalImpressions?.toLocaleString() || "0"}
                color={COLORS.purple}
              />
              <StatCard
                label="Avg Position"
                value={d.avgPosition ? `#${d.avgPosition}` : "--"}
                color={COLORS.green}
              />
            </View>

            {/* CPC Savings */}
            {d.estimatedCpcSavings && (
              <View style={styles.savingsCard}>
                <LinearGradient
                  colors={["rgba(253,54,110,0.15)", "rgba(192,38,211,0.15)"]}
                  style={styles.savingsGradient}
                >
                  <Text style={styles.savingsEmoji}>💰</Text>
                  <View>
                    <Text style={styles.savingsValue}>
                      ${d.estimatedCpcSavings}/mo
                    </Text>
                    <Text style={styles.savingsLabel}>
                      Estimated savings vs Google Ads
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Keywords */}
            {d.keywords?.length > 0 && (
              <View style={globalStyles.section}>
                <Text style={styles.sectionLabel}>TOP KEYWORDS</Text>
                {d.keywords.slice(0, 10).map((kw, i) => (
                  <KeywordRow
                    key={i}
                    keyword={kw.query}
                    clicks={kw.clicks}
                    impressions={kw.impressions}
                    position={Math.round(kw.position)}
                  />
                ))}
              </View>
            )}

            {/* Disconnect */}
            <TouchableOpacity
              style={styles.disconnectBtn}
              onPress={gsc.disconnect}
            >
              <Text style={styles.disconnectText}>
                Disconnect Search Console
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text
            style={{
              color: COLORS.textMuted,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No data yet. Make sure your site is verified in Google Search
            Console.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  refreshText: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
  },
  statSub: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 },
  savingsCard: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
  savingsGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  savingsEmoji: { fontSize: 28 },
  savingsValue: { fontSize: 22, fontWeight: "800", color: "#fff" },
  savingsLabel: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1,
    marginBottom: 10,
  },
  keywordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  keywordText: { flex: 1, fontSize: 13, color: "#fff", marginRight: 12 },
  keywordStats: { flexDirection: "row", alignItems: "center", gap: 10 },
  keywordClicks: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  positionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  positionText: { fontSize: 11, fontWeight: "700" },
  disconnectBtn: { marginTop: 24, alignItems: "center", paddingVertical: 12 },
  disconnectText: { fontSize: 13, color: "rgba(255,255,255,0.25)" },

  // Teaser
  teaserCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: "hidden",
  },
  teaserStats: { flexDirection: "row", justifyContent: "space-between" },
  teaserStat: { alignItems: "center", flex: 1 },
  teaserSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 16,
  },
  lockedRow: { opacity: 0.3 },
  lockedBar: {
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    flex: 1,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13,13,20,0.85)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lockEmoji: { fontSize: 36, marginBottom: 12 },
  lockTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  lockSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  unlockBtn: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },
  unlockGradient: { paddingVertical: 16, alignItems: "center" },
  unlockText: { fontSize: 15, fontWeight: "800", color: "#fff" },
  unlockPrice: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  lockNote: { fontSize: 11, color: "rgba(255,255,255,0.25)" },

  // Connect
  connectCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  connectEmoji: { fontSize: 40, marginBottom: 14 },
  connectTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  connectSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  connectBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  connectBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginBottom: 12,
    textAlign: "center",
  },

  // Value props
  valueProps: { gap: 14 },
  valueProp: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 16,
  },
  valuePropEmoji: { fontSize: 24 },
  valuePropTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  valuePropSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 17,
  },
});
