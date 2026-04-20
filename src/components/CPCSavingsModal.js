import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

const NICHES = [
  { key: "health", label: "Health & Wellness", emoji: "🏥", cpc: 3.2 },
  { key: "ecommerce", label: "E-commerce", emoji: "🛍️", cpc: 1.9 },
  { key: "tech", label: "Tech / SaaS", emoji: "💻", cpc: 6.8 },
  { key: "realestate", label: "Real Estate", emoji: "🏠", cpc: 4.5 },
  { key: "finance", label: "Finance", emoji: "💰", cpc: 8.2 },
  { key: "fitness", label: "Fitness", emoji: "💪", cpc: 2.8 },
  { key: "food", label: "Food & Beverage", emoji: "🍕", cpc: 1.6 },
  { key: "education", label: "Education", emoji: "📚", cpc: 2.4 },
  { key: "legal", label: "Legal", emoji: "⚖️", cpc: 9.5 },
  { key: "other", label: "Other", emoji: "🌐", cpc: 2.5 },
];

function estimateMonthlyVisits(score) {
  if (score >= 96) return 15000;
  if (score >= 86) return 8000;
  if (score >= 76) return 4500;
  if (score >= 61) return 2000;
  if (score >= 41) return 800;
  return 200;
}

function formatMoney(amount) {
  if (amount >= 1000000) return "$" + (amount / 1000000).toFixed(1) + "M";
  if (amount >= 1000) return "$" + (amount / 1000).toFixed(1) + "K";
  return "$" + Math.round(amount);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function estimateWorthPerPost(followers, platform) {
  const base = followers * 0.01;
  const multipliers = {
    instagram: 1.2,
    youtube: 2.0,
    tiktok: 0.8,
    twitter: 0.5,
  };
  return base * (multipliers[platform] || 1);
}

function Row({ label, value, highlight }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 13, color: COLORS.textMuted }}>{label}</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: highlight ? "800" : "600",
          color: highlight ? COLORS.green : COLORS.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function NicheSelector({ selected, onSelect }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 24,
      }}
    >
      {NICHES.map((n) => {
        const isSelected = selected === n.key;
        return (
          <TouchableOpacity
            key={n.key}
            onPress={() => onSelect(n.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isSelected ? COLORS.primary : COLORS.border,
              backgroundColor: isSelected
                ? "rgba(253,54,110,0.1)"
                : "rgba(255,255,255,0.03)",
            }}
          >
            <Text style={{ fontSize: 16 }}>{n.emoji}</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: isSelected ? COLORS.primary : COLORS.textMuted,
              }}
            >
              {n.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── SEO Savings Section ────────────────────────────────────────────
function SEOSavings({ score, niche }) {
  const visits = estimateMonthlyVisits(score);
  const monthlySavings = Math.round(visits * niche.cpc);
  const yearlySavings = monthlySavings * 12;
  const potentialVisits = estimateMonthlyVisits(95);
  const potentialMonthly = Math.round(potentialVisits * niche.cpc);
  const additionalSavings = potentialMonthly - monthlySavings;

  return (
    <>
      <LinearGradient
        colors={["rgba(16,185,129,0.15)", "rgba(16,185,129,0.05)"]}
        style={{
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "rgba(16,185,129,0.3)",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: COLORS.green,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          SEO AD SAVINGS
        </Text>
        <Text
          style={{
            fontSize: 42,
            fontWeight: "900",
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          {formatMoney(monthlySavings)}
          <Text
            style={{ fontSize: 16, color: COLORS.textMuted, fontWeight: "400" }}
          >
            /month
          </Text>
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
          {formatMoney(yearlySavings)}/year in {niche.label} ads
        </Text>
      </LinearGradient>

      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Breakdown
        </Text>
        <Row label="SEO score" value={`${score}/100`} />
        <Row label="Est. monthly organic visits" value={formatNumber(visits)} />
        <Row
          label={`Avg CPC (${niche.label})`}
          value={`$${niche.cpc.toFixed(2)}`}
        />
        <View style={{ height: 1, backgroundColor: COLORS.border }} />
        <Row
          label="Monthly ad equivalent"
          value={formatMoney(monthlySavings)}
          highlight
        />
      </View>

      {additionalSavings > 0 && score < 95 && (
        <LinearGradient
          colors={["rgba(253,54,110,0.1)", "rgba(192,38,211,0.1)"]}
          style={{
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "rgba(253,54,110,0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: COLORS.primary,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            💡 UNLOCK MORE SAVINGS
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.text,
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            Reach score 95 — save an extra{" "}
            <Text style={{ color: COLORS.primary }}>
              {formatMoney(additionalSavings)}/month
            </Text>
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
            That's {formatMoney(additionalSavings * 12)} more per year.
          </Text>
        </LinearGradient>
      )}
    </>
  );
}

// ── Social Savings Section ─────────────────────────────────────────
function SocialSavings({ social }) {
  const platforms = Object.entries(social);
  const totalFollowers = platforms.reduce(
    (acc, [, p]) =>
      acc + (p.profileData?.followers || p.followers || p.subscribers || 0),
    0,
  );

  const totalWorthPerPost = platforms.reduce((acc, [key, p]) => {
    const followers =
      p.profileData?.followers || p.followers || p.subscribers || 0;
    return acc + estimateWorthPerPost(followers, key);
  }, 0);

  const monthlyWorth = totalWorthPerPost * 4; // 4 posts per month estimate
  const yearlyWorth = monthlyWorth * 12;

  return (
    <>
      <LinearGradient
        colors={["rgba(124,58,237,0.15)", "rgba(219,39,119,0.05)"]}
        style={{
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "rgba(124,58,237,0.3)",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#a78bfa",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          SOCIAL AD EQUIVALENCY
        </Text>
        <Text
          style={{
            fontSize: 42,
            fontWeight: "900",
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          {formatMoney(totalWorthPerPost)}
          <Text
            style={{ fontSize: 16, color: COLORS.textMuted, fontWeight: "400" }}
          >
            /post
          </Text>
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
          Brands pay this to reach {formatNumber(totalFollowers)} followers
        </Text>
      </LinearGradient>

      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Breakdown
        </Text>
        {platforms.map(([key, p]) => {
          const followers =
            p.profileData?.followers || p.followers || p.subscribers || 0;
          const worth = estimateWorthPerPost(followers, key);
          return (
            <Row
              key={key}
              label={`${key.charAt(0).toUpperCase() + key.slice(1)} (@${p.handle})`}
              value={formatMoney(worth) + "/post"}
            />
          );
        })}
        <View style={{ height: 1, backgroundColor: COLORS.border }} />
        <Row
          label="Est. monthly (4 posts)"
          value={formatMoney(monthlyWorth)}
          highlight
        />
        <Row label="Est. yearly" value={formatMoney(yearlyWorth)} />
      </View>

      <View
        style={{
          backgroundColor: "rgba(124,58,237,0.08)",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(124,58,237,0.2)",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#a78bfa",
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          You own this audience organically.
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 20 }}>
          Brands pay {formatMoney(totalWorthPerPost)} per post to reach an
          audience this size. You built it for free.
        </Text>
      </View>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function CPCSavingsModal({ score, social }) {
  const [selectedNiche, setSelectedNiche] = useState(null);

  const hasSEO = !!score && score > 0;
  const hasSocial = !!social && Object.keys(social).length > 0;
  const niche = NICHES.find((n) => n.key === selectedNiche);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text
        style={{
          color: COLORS.textMuted,
          fontSize: 13,
          lineHeight: 20,
          marginBottom: 20,
        }}
      >
        See exactly what your online presence is worth in real ad dollars.
      </Text>

      {/* Niche selector — only needed for SEO */}
      {hasSEO && (
        <>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 13,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            Select your industry:
          </Text>
          <NicheSelector selected={selectedNiche} onSelect={setSelectedNiche} />
        </>
      )}

      {/* SEO savings */}
      {hasSEO && niche && <SEOSavings score={score} niche={niche} />}

      {/* Divider between SEO and social if both exist */}
      {hasSEO && hasSocial && niche && (
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.border,
            marginVertical: 20,
          }}
        />
      )}

      {/* Social savings — no niche needed */}
      {hasSocial && <SocialSavings social={social} />}

      {/* Prompt to select niche if SEO but no niche selected yet */}
      {hasSEO && !niche && (
        <Text
          style={{
            color: COLORS.textMuted,
            fontSize: 13,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          ↑ Pick your industry to see your SEO savings
        </Text>
      )}
    </ScrollView>
  );
}
