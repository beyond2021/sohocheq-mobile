import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, API_BASE } from "../constants";
import { globalStyles } from "../styles";

const { width } = Dimensions.get("window");

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function Section({ title, accent, children }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
      >
        <View
          style={{
            width: 3,
            height: 18,
            borderRadius: 2,
            backgroundColor: accent,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: COLORS.text,
            fontFamily: "Syne_700Bold",
          }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function MetricRow({ label, value, subValue, color }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
      }}
    >
      <Text style={{ fontSize: 14, color: COLORS.textMuted }}>{label}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color }}>{value}</Text>
        {subValue && (
          <Text style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 2 }}>
            {subValue}
          </Text>
        )}
      </View>
    </View>
  );
}

function PlatformGrowthCard({
  platform,
  icon,
  color,
  handle,
  followers,
  posts,
  postsLabel,
}) {
  const getGrowthTimeline = (f) => {
    if (f < 1000)
      return {
        next: "1K",
        weeks: "4-8 weeks",
        advice: "Post daily, engage with every comment",
      };
    if (f < 10000)
      return {
        next: "10K",
        weeks: "3-6 months",
        advice: "Consistency is key — 3-5 posts per week minimum",
      };
    if (f < 100000)
      return {
        next: "100K",
        weeks: "6-18 months",
        advice: "Collaborate with creators in your niche",
      };
    if (f < 1000000)
      return {
        next: "1M",
        weeks: "1-3 years",
        advice: "Diversify content formats and go viral",
      };
    return {
      next: "Keep growing",
      weeks: "Ongoing",
      advice: "Monetize and maintain authentic engagement",
    };
  };

  const timeline = getGrowthTimeline(followers);

  return (
    <View
      style={{
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backgroundColor: color + "11",
        borderWidth: 1,
        borderColor: color + "33",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <Text style={{ fontSize: 20, marginRight: 10 }}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "800", color: COLORS.text }}>
            @{handle}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {platform}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: color + "22",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 100,
          }}
        >
          <Text style={{ color, fontWeight: "700", fontSize: 13 }}>
            {formatNumber(followers)}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <Text
          style={{ fontSize: 12, color: COLORS.textFaint, marginBottom: 4 }}
        >
          NEXT MILESTONE
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color }}>
            → {timeline.next}
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
            {timeline.weeks}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 20 }}>
        💡 {timeline.advice}
      </Text>
    </View>
  );
}

export default function GrowthPlanScreen({ navigation, analysisHook }) {
  const { result } = analysisHook;
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const seo = result?.seo;
  const social = result?.social;

  useEffect(() => {
    if (seo && !hasFetched.current) {
      hasFetched.current = true;
      fetchGrowthPlan();
    }
  }, []);

  const fetchGrowthPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const issues = seo.issues?.slice(0, 3).join(", ") || "No major issues";

      // Build social summary for the prompt
      const socialSummary = social
        ? Object.entries(social)
            .map(([platform, data]) => {
              const followers =
                data.profileData?.followers ||
                data.followers ||
                data.subscribers ||
                0;
              return `${platform}: ${formatNumber(followers)} followers`;
            })
            .join(", ")
        : "No social data";

      const url = `${API_BASE}/analyze-seo?action=ai-summary&url=${encodeURIComponent(seo.analyzedUrl)}&score=${seo.score}&performance=${seo.technical?.performance}&mobile=${seo.technical?.mobile}&issues=${encodeURIComponent(issues)}&social=${encodeURIComponent(socialSummary)}`;

      console.log("🌱 Growth plan URL:", url);
      const res = await fetch(url);
      console.log("🌱 Growth plan status:", res.status);

      if (!res.ok) throw new Error("Failed to fetch growth plan");
      const data = await res.json();
      console.log("🌱 Growth plan data:", JSON.stringify(data));
      setAiPlan(data.summary || data.text || null);
    } catch (e) {
      console.error("🌱 Growth plan error:", e);
      setError("Could not load your growth plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!seo) {
    return (
      <View style={globalStyles.empty}>
        <Text style={globalStyles.emptyText}>No data available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={globalStyles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Build social platforms array from real data
  const platforms = social
    ? [
        social.instagram && {
          key: "instagram",
          icon: "📸",
          color: "#e1306c",
          handle: social.instagram.handle,
          followers:
            social.instagram.profileData?.followers ||
            social.instagram.followers ||
            0,
          posts: social.instagram.posts || 0,
          postsLabel: "Posts",
        },
        social.twitter && {
          key: "twitter",
          icon: "𝕏",
          color: "#1da1f2",
          handle: social.twitter.handle,
          followers: social.twitter.followers || 0,
          posts: social.twitter.tweets || 0,
          postsLabel: "Tweets",
        },
        social.tiktok && {
          key: "tiktok",
          icon: "🎵",
          color: "#ff0050",
          handle: social.tiktok.handle,
          followers: social.tiktok.followers || 0,
          posts: social.tiktok.videos || 0,
          postsLabel: "Videos",
        },
        social.youtube && {
          key: "youtube",
          icon: "▶️",
          color: "#ff0000",
          handle: social.youtube.handle,
          followers: social.youtube.subscribers || 0,
          posts: social.youtube.videos || social.youtube.videoCount || 0,
          postsLabel: "Videos",
        },
      ].filter(Boolean)
    : [];

  const totalFollowers = platforms.reduce((acc, p) => acc + p.followers, 0);
  const getColor = (s) =>
    s >= 75 ? COLORS.green : s >= 50 ? COLORS.yellow : COLORS.red;
  const tech = seo.technical || {};

  return (
    <View style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.inner}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.back}
        >
          <Text style={globalStyles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={{ marginBottom: 28 }}>
          <Text style={globalStyles.eyebrow}>Your 90-Day Roadmap</Text>
          <Text style={globalStyles.heroTitle}>Growth Plan</Text>
          <Text style={globalStyles.heroSub}>
            Based on your real data — here's exactly what to do next
          </Text>
        </View>

        {/* Website Score Summary */}
        <Section title="Website Health" accent={getColor(seo.score)}>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <MetricRow
              label="Overall Score"
              value={`${seo.score}/100`}
              color={getColor(seo.score)}
            />
            <MetricRow
              label="Performance"
              value={`${tech.performance || 0}%`}
              color={getColor(tech.performance || 0)}
            />
            <MetricRow
              label="Mobile"
              value={`${tech.mobile || 0}%`}
              color={getColor(tech.mobile || 0)}
            />
            <MetricRow
              label="Security"
              value={`${tech.security || 0}%`}
              color={COLORS.purple}
            />

            {seo.issues?.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textFaint,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Fix These First
                </Text>
                {seo.issues.slice(0, 3).map((issue, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.red,
                        marginRight: 8,
                        fontSize: 14,
                      }}
                    >
                      →
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 13,
                        color: COLORS.textMuted,
                        lineHeight: 18,
                      }}
                    >
                      {issue}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Section>

        {/* Timeline Expectations */}
        <Section title="Realistic Timeline" accent="#a78bfa">
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <Text style={{ fontSize: 24 }}>⏱️</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: COLORS.text,
                    marginBottom: 4,
                  }}
                >
                  SEO takes time — don't quit early
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.textMuted,
                    lineHeight: 20,
                  }}
                >
                  Most sites see real results in 3-6 months. The sites beating
                  you started 6 months ago.
                </Text>
              </View>
            </View>

            {[
              {
                week: "Week 1-2",
                task: "Fix technical issues & meta descriptions",
                done: false,
              },
              {
                week: "Week 3-4",
                task: "Improve page speed & Core Web Vitals",
                done: false,
              },
              {
                week: "Month 2",
                task: "Start consistent content publishing",
                done: false,
              },
              {
                week: "Month 3",
                task: "Build backlinks & social signals",
                done: false,
              },
              {
                week: "Month 4-6",
                task: "Rankings improve, organic traffic grows",
                done: false,
              },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  paddingVertical: 10,
                  borderBottomWidth: i < 4 ? 1 : 0,
                  borderBottomColor: "rgba(255,255,255,0.05)",
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#a78bfa22",
                    borderWidth: 1.5,
                    borderColor: "#a78bfa44",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "800",
                      color: "#a78bfa",
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#a78bfa",
                      fontWeight: "700",
                      marginBottom: 2,
                    }}
                  >
                    {item.week}
                  </Text>
                  <Text style={{ fontSize: 14, color: COLORS.text }}>
                    {item.task}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* Social Growth */}
        {platforms.length > 0 && (
          <Section title="Social Growth Milestones" accent="#e1306c">
            <View
              style={{
                backgroundColor: "#e1306c11",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#e1306c33",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  lineHeight: 20,
                }}
              >
                🎯 Total reach:{" "}
                <Text style={{ color: COLORS.text, fontWeight: "800" }}>
                  {formatNumber(totalFollowers)}
                </Text>{" "}
                followers. Social growth compounds — the first 1K is the
                hardest.
              </Text>
            </View>
            {platforms.map((p) => (
              <PlatformGrowthCard
                key={p.key}
                platform={p.key}
                icon={p.icon}
                color={p.color}
                handle={p.handle}
                followers={p.followers}
                posts={p.posts}
                postsLabel={p.postsLabel}
              />
            ))}
          </Section>
        )}

        {/* AI Growth Advice */}
        <Section title="AI Coach" accent={COLORS.primary}>
          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text
                style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 14 }}
              >
                AI analyzing your growth potential...
              </Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text
                style={{
                  color: COLORS.red,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  hasFetched.current = false;
                  fetchGrowthPlan();
                }}
                style={globalStyles.btn}
              >
                <Text style={globalStyles.btnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : aiPlan ? (
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderLeftWidth: 3,
                borderLeftColor: COLORS.primary,
              }}
            >
              <Text
                style={{ fontSize: 14, color: COLORS.text, lineHeight: 24 }}
              >
                {aiPlan}
              </Text>
            </View>
          ) : null}
        </Section>

        {/* Come back reminder */}
        <View
          style={{
            backgroundColor: "#7c3aed22",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#7c3aed44",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: COLORS.text,
              marginBottom: 8,
              fontFamily: "Syne_700Bold",
            }}
          >
            📅 Check back weekly
          </Text>
          <Text
            style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}
          >
            Run a new analysis every week to track your progress. Growth is slow
            but the data doesn't lie — keep checking in.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            hasFetched.current = false;
            fetchGrowthPlan();
          }}
          style={globalStyles.btn}
        >
          <Text style={globalStyles.btnText}>🔄 Refresh Growth Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
