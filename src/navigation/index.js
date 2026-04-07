import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants";
import {
  HybridIcon,
  WebsiteIcon,
  SocialIcon,
  SettingsIcon,
} from "../components/icons/TabIcons";

import AuthScreen from "../screens/AuthScreen";
import HybridScreen from "../screens/HybridScreen";
import WebsiteScreen from "../screens/WebsiteScreen";
import SocialScreen from "../screens/SocialScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ResultsScreen from "../screens/ResultsScreen";
import AIAdvisorScreen from "../screens/AIAdvisorScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HybridStack = createNativeStackNavigator();
const WebsiteStack = createNativeStackNavigator();
const SocialStack = createNativeStackNavigator();

function TabBar({ state, descriptors, navigation }) {
  const tabs = [
    { name: "Hybrid", Icon: HybridIcon, label: "Hybrid" },
    { name: "Website", Icon: WebsiteIcon, label: "Website" },
    { name: "Social", Icon: SocialIcon, label: "Social" },
    { name: "Settings", Icon: SettingsIcon, label: "Settings" },
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
        const color = focused ? "#fd366e" : "rgba(255,255,255,0.3)";
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
            activeOpacity={0.8}
          >
            <tab.Icon color={color} size={24} />
            <Text
              style={{
                fontSize: 10,
                fontWeight: focused ? "700" : "600",
                color,
                marginTop: 4,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function HybridStackScreen({ authHook, hybridAnalysis }) {
  return (
    <HybridStack.Navigator screenOptions={{ headerShown: false }}>
      <HybridStack.Screen name="HybridHome">
        {(props) => (
          <HybridScreen
            {...props}
            authHook={authHook}
            analysisHook={hybridAnalysis}
          />
        )}
      </HybridStack.Screen>
      <HybridStack.Screen name="Results">
        {(props) => <ResultsScreen {...props} analysisHook={hybridAnalysis} />}
      </HybridStack.Screen>
      <HybridStack.Screen name="AIAdvisor">
        {(props) => (
          <AIAdvisorScreen {...props} analysisHook={hybridAnalysis} />
        )}
      </HybridStack.Screen>
    </HybridStack.Navigator>
  );
}

function WebsiteStackScreen({ authHook, websiteAnalysis }) {
  return (
    <WebsiteStack.Navigator screenOptions={{ headerShown: false }}>
      <WebsiteStack.Screen name="WebsiteHome">
        {(props) => (
          <WebsiteScreen
            {...props}
            authHook={authHook}
            analysisHook={websiteAnalysis}
          />
        )}
      </WebsiteStack.Screen>
      <WebsiteStack.Screen name="Results">
        {(props) => <ResultsScreen {...props} analysisHook={websiteAnalysis} />}
      </WebsiteStack.Screen>
      <WebsiteStack.Screen name="AIAdvisor">
        {(props) => (
          <AIAdvisorScreen {...props} analysisHook={websiteAnalysis} />
        )}
      </WebsiteStack.Screen>
    </WebsiteStack.Navigator>
  );
}

function SocialStackScreen({ authHook, socialAnalysis }) {
  return (
    <SocialStack.Navigator screenOptions={{ headerShown: false }}>
      <SocialStack.Screen name="SocialHome">
        {(props) => (
          <SocialScreen
            {...props}
            authHook={authHook}
            analysisHook={socialAnalysis}
          />
        )}
      </SocialStack.Screen>
      <SocialStack.Screen name="AIAdvisor">
        {(props) => (
          <AIAdvisorScreen {...props} analysisHook={socialAnalysis} />
        )}
      </SocialStack.Screen>
    </SocialStack.Navigator>
  );
}

function MainTabs({
  authHook,
  hybridAnalysis,
  websiteAnalysis,
  socialAnalysis,
}) {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
    >
      <Tab.Screen name="Hybrid">
        {(props) => (
          <HybridStackScreen
            {...props}
            authHook={authHook}
            hybridAnalysis={hybridAnalysis}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Website">
        {(props) => (
          <WebsiteStackScreen
            {...props}
            authHook={authHook}
            websiteAnalysis={websiteAnalysis}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Social">
        {(props) => (
          <SocialStackScreen
            {...props}
            authHook={authHook}
            socialAnalysis={socialAnalysis}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} authHook={authHook} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function Navigation({
  authHook,
  hybridAnalysis,
  websiteAnalysis,
  socialAnalysis,
}) {
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
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs
                {...props}
                authHook={authHook}
                hybridAnalysis={hybridAnalysis}
                websiteAnalysis={websiteAnalysis}
                socialAnalysis={socialAnalysis}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
