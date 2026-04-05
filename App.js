import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './src/hooks/useAuth';
import { useAnalysis } from './src/hooks/useAnalysis';
import Navigation from './src/navigation';

export default function App() {
  const authHook = useAuth();
  const analysisHook = useAnalysis();

  return (
    <>
      <StatusBar style="light" />
      <Navigation authHook={authHook} analysisHook={analysisHook} />
    </>
  );
}
