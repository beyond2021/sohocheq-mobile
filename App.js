import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./src/hooks/useAuth";
import { useAnalysis } from "./src/hooks/useAnalysis";
import Navigation from "./src/navigation";

export default function App() {
  const authHook = useAuth();
  const hybridAnalysis = useAnalysis();
  const websiteAnalysis = useAnalysis();
  const socialAnalysis = useAnalysis();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation
        authHook={authHook}
        hybridAnalysis={hybridAnalysis}
        websiteAnalysis={websiteAnalysis}
        socialAnalysis={socialAnalysis}
      />
    </SafeAreaProvider>
  );
}
