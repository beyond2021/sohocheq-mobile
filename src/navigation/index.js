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

function TabIcon({ icon, label, focused }) {
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", paddingTop: 8 }}
    >
      {focused ? (
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 6,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>{icon}</Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#fff",
              marginTop: 2,
            }}
          >
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 16, opacity: 0.4 }}>{icon}</Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.textFaint,
              marginTop: 2,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}

function MainTabs({ authHook, analysisHook }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Hybrid"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚡" label="Hybrid" focused={focused} />
          ),
        }}
      >
        {(props) => (
          <HybridScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Website"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🌐" label="Website" focused={focused} />
          ),
        }}
      >
        {(props) => (
          <WebsiteScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Social"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📱" label="Social" focused={focused} />
          ),
        }}
      >
        {(props) => (
          <SocialScreen
            {...props}
            authHook={authHook}
            analysisHook={analysisHook}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" label="Settings" focused={focused} />
          ),
        }}
      >
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
            <Stack.Screen name="SocialResults">
              {(props) => (
                <SocialScreen {...props} analysisHook={analysisHook} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
