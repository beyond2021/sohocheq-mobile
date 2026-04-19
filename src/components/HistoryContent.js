import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

function getScoreColor(score) {
  if (!score) return COLORS.textMuted;
  if (score >= 80) return COLORS.green;
  if (score >= 60) return COLORS.yellow;
  return COLORS.red;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ value, label, color }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text
        style={{ fontSize: 24, fontWeight: "900", color: color || COLORS.text }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: COLORS.textMuted,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function HistoryRow({ icon, label, score, date, onReanalyze }) {
  const color = getScoreColor(score);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text
        style={{ flex: 1, fontSize: 13, color: COLORS.text, fontWeight: "600" }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "800",
          color,
          minWidth: 32,
          textAlign: "center",
        }}
      >
        {score ?? "—"}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: COLORS.textMuted,
          minWidth: 70,
          textAlign: "right",
        }}
      >
        {formatDate(date)}
      </Text>
      {onReanalyze && (
        <TouchableOpacity
          onPress={onReanalyze}
          style={{
            backgroundColor: "rgba(253,54,110,0.08)",
            borderWidth: 1,
            borderColor: "rgba(253,54,110,0.2)",
            borderRadius: 8,
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: COLORS.primary, fontSize: 14 }}>↻</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HistoryContent({ historyHook, onReanalyze }) {
  const {
    seoHistory,
    socialHistory,
    personalBest,
    allSeoCount,
    allSocialCount,
    loading,
    isUnlocked,
  } = historyHook;

  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: "center" }}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 13 }}>
          Loading history...
        </Text>
      </View>
    );
  }

  if (!seoHistory.length && !socialHistory.length) {
    return (
      <View style={{ padding: 40, alignItems: "center" }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: 14,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          No analyses yet. Run your first analysis to start tracking your
          progress.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <StatCard
          value={personalBest}
          label="Personal Best"
          color={COLORS.primary}
        />
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <StatCard value={allSeoCount} label="SEO Scans" />
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <StatCard value={allSocialCount} label="Social Scans" />
      </View>

      {/* SEO History */}
      {seoHistory.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              🌐 SEO History
            </Text>
          </View>
          {seoHistory.map((item) => (
            <HistoryRow
              key={item.id}
              icon="🌐"
              label={item.url?.replace(/^https?:\/\//, "") || "—"}
              score={item.score}
              date={item.created_at}
              onReanalyze={
                onReanalyze ? () => onReanalyze({ url: item.url }) : null
              }
            />
          ))}
        </View>
      )}

      {/* Social History */}
      {socialHistory.length > 0 && (
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              📱 Social History
            </Text>
          </View>
          {socialHistory.map((item) => (
            <HistoryRow
              key={item.id}
              icon="📱"
              label={item.handles || "—"}
              score={item.social_score}
              date={item.created_at}
              onReanalyze={
                onReanalyze
                  ? () =>
                      onReanalyze({
                        instagram: item.handles?.instagram,
                        twitter: item.handles?.twitter,
                        tiktok: item.handles?.tiktok,
                        youtube: item.handles?.youtube,
                      })
                  : null
              }
            />
          ))}
        </View>
      )}

      {/* Premium gate */}
      {!isUnlocked && (allSeoCount > 2 || allSocialCount > 2) && (
        <LinearGradient
          colors={["rgba(253,54,110,0.08)", "rgba(192,38,211,0.08)"]}
          style={{
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(253,54,110,0.2)",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 8 }}>🔒</Text>
          <Text
            style={{
              color: COLORS.text,
              fontWeight: "800",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            Unlock Full History
          </Text>
          <Text
            style={{
              color: COLORS.textMuted,
              fontSize: 13,
              textAlign: "center",
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            Upgrade to Premium to see all your analyses and track progress over
            time.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </ScrollView>
  );
}
