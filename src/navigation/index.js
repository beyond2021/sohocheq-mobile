import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AIAdvisorScreen from "../screens/AIAdvisorScreen";

const Stack = createNativeStackNavigator();

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
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
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
            <Stack.Screen name="Settings">
              {(props) => <SettingsScreen {...props} authHook={authHook} />}
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
