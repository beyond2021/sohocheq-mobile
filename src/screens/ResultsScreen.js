import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import { globalStyles } from "../styles";
import SkeletonCard from "../components/SkeletonCard";
import { useState } from "react";
import ActionBar from "../components/ActionBar";
import BottomModal from "../components/BottomModal";
import AIAdvisorContent from "../components/AIAdvisorContent";
import SocialContent from "../components/SocialContent";

function ScoreRing({ score }) {
  const color =
    score >= 80 ? COLORS.green : score >= 60 ? COLORS.yellow : COLORS.red;
  return (
    <View style={[globalStyles.scoreRing, { borderColor: color }]}>
      <Text style={[globalStyles.scoreNumber, { color }]}>{score}</Text>
      <Text style={globalStyles.scoreLabel}>Overall Score</Text>
    </View>
  );
}

function ScoreCard({ icon, label, value, color }) {
  return (
    <View style={globalStyles.scoreCard}>
      <Text style={globalStyles.scoreCardIcon}>{icon}</Text>
      <Text
        style={[globalStyles.scoreCardValue, { color: color || COLORS.green }]}
      >
        {value}
      </Text>
      <Text style={globalStyles.scoreCardLabel}>{label}</Text>
    </View>
  );
}

function VitalRow({ label, value, status, color }) {
  return (
    <View style={globalStyles.vitalRow}>
      <View>
        <Text style={globalStyles.vitalLabel}>{label}</Text>
        <Text style={[globalStyles.vitalValue, { color }]}>{value}</Text>
      </View>
      <View
        style={[globalStyles.vitalBadge, { backgroundColor: color + "22" }]}
      >
        <Text style={[globalStyles.vitalBadgeText, { color }]}>{status}</Text>
      </View>
    </View>
  );
}

export default function ResultsScreen({ navigation, analysisHook }) {
  const { result, loading } = analysisHook;
  const [showAI, setShowAI] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  if (loading) {
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
      >
        {/* Step message */}
        <View style={{ marginBottom: 28 }}>
          <SkeletonCard height={30} style={{ width: "60%", marginBottom: 8 }} />
        </View>

        {/* Score ring skeleton */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <SkeletonCard height={140} style={{ width: 140, borderRadius: 70 }} />
        </View>

        {/* Score cards skeleton */}
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

        {/* Vitals skeleton */}
        <SkeletonCard height={180} />

        {/* Button skeleton */}
        <SkeletonCard height={58} style={{ marginTop: 8 }} />
      </ScrollView>
    );
  }

  if (!result?.seo) {
    return (
      <View style={globalStyles.empty}>
        <Text style={globalStyles.emptyText}>No results yet</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={globalStyles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { seo } = result;
  const score = seo.score || 0;
  const tech = seo.technical || {};
  const vitals = seo.coreWebVitals || {};
  console.log("📊 Tech:", JSON.stringify(tech));
  console.log("📊 Vitals:", JSON.stringify(vitals));
  const issues = seo.issues || [];

  const lcpVal = vitals.lcp?.displayValue || "--";
  const lcpScore = vitals.lcp?.score || 0;
  const clsVal = vitals.cls?.displayValue || "--";
  const clsScore = vitals.cls?.score || 0;
  const inpVal = vitals.inp?.displayValue || vitals.fid?.displayValue || "--";

  const getColor = (s) =>
    s >= 75 ? COLORS.green : s >= 50 ? COLORS.yellow : COLORS.red;
  const getStatus = (s) => (s >= 75 ? "Good" : s >= 50 ? "Fair" : "Poor");

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.inner}
      >
        <TouchableOpacity
          onPress={() => {
            analysisHook.reset();
            navigation.goBack();
          }}
          style={globalStyles.back}
        >
          <Text style={globalStyles.backText}>← New Analysis</Text>
        </TouchableOpacity>

        <Text style={globalStyles.urlText}>{result.url}</Text>

        <View style={globalStyles.ringWrap}>
          <ScoreRing score={score} />
        </View>

        <View style={globalStyles.cardGrid}>
          <ScoreCard
            icon="🚀"
            label="Performance"
            value={tech.performance ? `${tech.performance}%` : "N/A"}
            color={
              tech.performance >= 75
                ? COLORS.green
                : tech.performance >= 50
                  ? COLORS.yellow
                  : COLORS.red
            }
          />
          <ScoreCard
            icon="📱"
            label="Mobile"
            value={tech.mobile ? `${tech.mobile}%` : "N/A"}
            color={
              tech.mobile >= 75
                ? COLORS.green
                : tech.mobile >= 50
                  ? COLORS.yellow
                  : COLORS.red
            }
          />
          <ScoreCard
            icon="⚡"
            label="Desktop"
            value={tech.desktop ? `${tech.desktop}%` : "N/A"}
            color={
              tech.desktop >= 75
                ? COLORS.green
                : tech.desktop >= 50
                  ? COLORS.yellow
                  : COLORS.red
            }
          />
          <ScoreCard
            icon="🔒"
            label="Security"
            value={tech.security ? `${tech.security}%` : "N/A"}
            color={COLORS.purple}
          />
        </View>

        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Core Web Vitals</Text>
          <View style={globalStyles.vitalsCard}>
            <VitalRow
              label="Largest Contentful Paint"
              value={lcpVal}
              status={getStatus(lcpScore)}
              color={getColor(lcpScore)}
            />
            <View style={globalStyles.divider} />
            <VitalRow
              label="Cumulative Layout Shift"
              value={clsVal}
              status={getStatus(clsScore)}
              color={getColor(clsScore)}
            />
            <View style={globalStyles.divider} />
            <VitalRow
              label="Interaction to Next Paint"
              value={inpVal}
              status="Good"
              color={COLORS.green}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}

      {/* AI Modal */}
      <BottomModal
        visible={showAI}
        onClose={() => setShowAI(false)}
        title="AI Advisor"
      >
        <AIAdvisorContent analysisHook={analysisHook} />
      </BottomModal>

      {/* Social Modal */}
      <BottomModal
        visible={showSocial}
        onClose={() => setShowSocial(false)}
        title="Social Report"
        fullScreen
      >
        <SocialContent analysisHook={analysisHook} />
      </BottomModal>

      <ActionBar
        onAI={() => setShowAI(true)}
        onSocial={() => setShowSocial(true)}
        onGrowth={() => navigation.navigate("GrowthPlan")}
        hasSocial={!!result?.social && Object.keys(result.social).length > 0}
      />
    </View>
  );
}
