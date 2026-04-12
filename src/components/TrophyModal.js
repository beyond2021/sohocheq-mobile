import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants";
import { TROPHY_DEFINITIONS } from "../hooks/useTrophies";

const { height } = Dimensions.get("window");

const CATEGORY_LABELS = {
  website: "🌐 Website",
  social: "📱 Social",
  progress: "📈 Progress",
  streak: "🔥 Streak",
};

export default function TrophyModal({ visible, onClose, trophies = [] }) {
  const earnedMap = {};
  trophies.forEach((t) => {
    earnedMap[t.trophy_key] = t;
  });
  const earnedCount = trophies.length;
  const total = TROPHY_DEFINITIONS.length;

  const categories = ["website", "social", "progress", "streak"];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.75)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#0d0d14",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: height * 0.88,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: "center", paddingTop: 12 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <View>
              <Text style={{ fontSize: 24, fontWeight: "900", color: "#fff" }}>
                🏆 Trophies
              </Text>
              <Text
                style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}
              >
                {earnedCount} of {total} earned
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                height: 6,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 3,
              }}
            >
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: COLORS.primary,
                  width: `${Math.round((earnedCount / total) * 100)}%`,
                }}
              />
            </View>
            <Text
              style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 6 }}
            >
              {Math.round((earnedCount / total) * 100)}% complete
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((cat) => {
              const defs = TROPHY_DEFINITIONS.filter((d) => d.category === cat);
              return (
                <View key={cat} style={{ marginBottom: 28 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: COLORS.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 14,
                    }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                  >
                    {defs.map((def) => {
                      const earned = earnedMap[def.key];
                      return (
                        <View
                          key={def.key}
                          style={{
                            width: "47%",
                            backgroundColor: earned
                              ? COLORS.primary + "15"
                              : "rgba(255,255,255,0.03)",
                            borderRadius: 16,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: earned
                              ? COLORS.primary + "55"
                              : "rgba(255,255,255,0.07)",
                            opacity: earned ? 1 : 0.45,
                          }}
                        >
                          <Text style={{ fontSize: 30, marginBottom: 8 }}>
                            {earned ? def.emoji : "🔒"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "800",
                              color: earned ? "#fff" : COLORS.textMuted,
                              marginBottom: 4,
                            }}
                          >
                            {def.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: COLORS.textFaint,
                              lineHeight: 16,
                            }}
                          >
                            {def.description}
                          </Text>
                          {earned?.earned_at && (
                            <Text
                              style={{
                                fontSize: 10,
                                color: COLORS.primary,
                                marginTop: 8,
                                fontWeight: "700",
                              }}
                            >
                              ✓{" "}
                              {new Date(earned.earned_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
