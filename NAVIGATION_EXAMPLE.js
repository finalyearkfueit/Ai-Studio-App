// Example RootNavigator.js with Authentication Handling

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Context
import { useAuth } from '../context/AuthContext';

// Auth Screens
import AuthScreen from '../screens/AuthScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotScreen from '../screens/ForgotScreen';
import OTPScreen from '../screens/OTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SplashScreen from '../screens/SplashScreen';

// App Screens
import BottomTabNavigator from './BottomTabNavigator';

// Navigation Stacks
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthScreens() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <AuthStack.Screen name="Auth" component={AuthScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="Forgot" component={ForgotScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function AppScreens() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Add other app screens here as needed */}
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Show splash/loading screen while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0812' }}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
}

/*
HOW IT WORKS:
==============

1. App starts → AuthContext checks AsyncStorage for tokens
2. While checking (loading = true) → Shows loading spinner
3. After checking:
   - If tokens exist (isAuthenticated = true) → Show MainTabs (app screens)
   - If no tokens (isAuthenticated = false) → Show Auth screens

4. User logs in:
   - authService.login() saves tokens
   - AuthContext detects tokens exist
   - isAuthenticated becomes true
   - Navigation switches to AppScreens
   - User sees MainTabs

5. User logs out:
   - authService.logout() clears tokens
   - AuthContext detects tokens are gone
   - isAuthenticated becomes false
   - Navigation switches to AuthScreens
   - User sees Auth screen

6. Token expires:
   - Next API call returns 401
   - apiService interceptor catches it
   - Automatically refreshes token
   - User doesn't see anything
   - API call retries and succeeds

7. Refresh token also expired:
   - Can't refresh access token
   - authService.logout() is called
   - AuthContext clears tokens
   - Navigation goes back to AuthScreens
   - User has to login again
*/

// ============================================
// USAGE IN App.js:
// ============================================

/*
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

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
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
*/

// ============================================
// KEY POINTS:
// ============================================

/*
✅ AuthContext checks tokens automatically
✅ Navigation responds to isAuthenticated
✅ Loading shown while checking
✅ User won't see auth screens if logged in
✅ Seamless redirect after login/logout
✅ Back button disabled between stacks
✅ Token refresh is automatic
✅ Everything is clean and organized
*/
