import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function MainApp() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootNavigator />
    </>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
