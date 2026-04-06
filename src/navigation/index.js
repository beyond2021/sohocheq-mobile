import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";

import AuthScreen from "../screens/AuthScreen";
import HybridScreen from "../screens/HybridScreen";
import WebsiteScreen from "../screens/WebsiteScreen";
import SocialScreen from "../screens/SocialScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ResultsScreen from "../screens/ResultsScreen";
import AIAdvisorScreen from "../screens/AIAdvisorScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar({ state, descriptors, navigation }) {
  const tabs = [
    { name: "Hybrid", icon: "⚡", label: "Hybrid" },
    { name: "Website", icon: "🌐", label: "Website" },
    { name: "Social", icon: "📱", label: "Social" },
    { name: "Settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#0d0d14",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.08)",
        paddingBottom: 24,
        paddingTop: 10,
        paddingHorizontal: 12,
      }}
    >
      {tabs.map((tab, index) => {
        const focused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{ flex: 1, alignItems: "center" }}
            activeOpacity={0.8}
          >
            {focused ? (
              <LinearGradient
                colors={["#fd366e", "#c026d3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  alignItems: "center",
                  minWidth: 72,
                }}
              >
                <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: "#fff",
                    marginTop: 2,
                  }}
                >
                  {tab.label}
                </Text>
              </LinearGradient>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 8 }}>
                <Text style={{ fontSize: 18, opacity: 0.35 }}>{tab.icon}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 2,
                  }}
                >
                  {tab.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs({ authHook, analysisHook }) {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Hybrid">
        {(props) => (
          <HybridScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Website">
        {(props) => (
          <WebsiteScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Social">
        {(props) => (
          <SocialScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} authHook={authHook} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function Navigation({ authHook, analysisHook }) {
  const { user, loading } = authHook;
  if (loading === true) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} authHook={authHook} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main">
              {(props) => (
                <MainTabs
                  {...props}
                  authHook={authHook}
                  analysisHook={analysisHook}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Results">
              {(props) => (
                <ResultsScreen {...props} analysisHook={analysisHook} />
              )}
            </Stack.Screen>
            <Stack.Screen name="AIAdvisor">
              {(props) => (
                <AIAdvisorScreen {...props} analysisHook={analysisHook} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
