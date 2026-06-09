import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditorScreen from '../screens/EditorScreen';
import TryOnScreen from '../screens/TryOnScreen';
import BackgroundScreen from '../screens/BackgroundScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import ResultScreen from '../screens/ResultScreen';

// New screens
import ForgotScreen from '../screens/ForgotScreen';
import OTPScreen from '../screens/OTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import EnhanceScreen from '../screens/EnhanceScreen';
import SketchScreen from '../screens/SketchScreen';
import AccountScreen from '../screens/AccountScreen';
import PremiumScreen from '../screens/PremiumScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot" component={ForgotScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        
        {/* Modals or additional nested screens */}
        <Stack.Screen name="Editor" component={EditorScreen} />
        <Stack.Screen name="TryOn" component={TryOnScreen} />
        <Stack.Screen name="BackgroundScreen" component={BackgroundScreen} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Enhance" component={EnhanceScreen} />
        <Stack.Screen name="Sketch" component={SketchScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

