import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import { useAnalysis } from "./src/hooks/useAnalysis";
import Navigation from "./src/navigation";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useTrophies } from "./src/hooks/useTrophies";
import {
  useFonts,
  Syne_700Bold,
  Syne_800ExtraBold,
} from "@expo-google-fonts/syne";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const authHook = useAuth();
  const hybridAnalysis = useAnalysis();
  const websiteAnalysis = useAnalysis();
  const socialAnalysis = useAnalysis();
  const trophyHook = useTrophies(
    authHook.user,
    hybridAnalysis,
    websiteAnalysis,
    socialAnalysis,
  );

  const [fontsLoaded] = useFonts({ Syne_700Bold, Syne_800ExtraBold });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <Navigation
        authHook={authHook}
        hybridAnalysis={hybridAnalysis}
        websiteAnalysis={websiteAnalysis}
        socialAnalysis={socialAnalysis}
        trophyHook={trophyHook}
      />
    </View>
  );
}
