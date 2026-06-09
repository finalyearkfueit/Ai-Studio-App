import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/Button';
import Card from '../components/Card';
import AnimatedAlert from '../components/AnimatedAlert';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../utils/apiService';
import { useGoogleAuth } from '../utils/googleAuth';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'error',
    title: '',
    message: '',
  });

  // Google Auth Hook
  const { handleGoogleAuth: googlePrompt } = useGoogleAuth();

  const showAlert = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!email.trim() || !password.trim()) {
      showAlert('error', 'Required Fields', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success) {
      showAlert('success', 'Success!', result.message);
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 500);
    } else {
      showAlert('error', 'Login Failed', result.message);
    }
  };

  const handleGoogleAuth = async () => {
    Keyboard.dismiss();
    setLoading(true);
    
    const result = await googlePrompt();
    setLoading(false);

    if (result?.success) {
      showAlert('success', 'Success!', result.message);
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 500);
    } else {
      showAlert('error', 'Google Sign-In Failed', result?.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.background, '#16132A']}
        style={styles.backgroundGrad}
      />
      
      {/* Glow effect at top left */}
      <View style={styles.glowTop} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to experience AI Magic</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              caretHidden={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              caretHidden={false}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} disabled={loading}>
              <Ionicons 
                name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Forgot')} disabled={loading}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton 
            title={loading ? "Logging in..." : "Log In"} 
            onPress={handleLogin} 
            style={styles.loginBtn}
            disabled={loading}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <CustomButton 
            title="Continue with Google" 
            variant="outline"
            onPress={handleGoogleAuth} 
            icon="logo-google"
            disabled={loading}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      <AnimatedAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  glowTop: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#8B5CF6',
    opacity: 0.15,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 35,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  card: {
    padding: 24,
    borderRadius: SIZES.radiusLarge,
    backgroundColor: 'rgba(21, 19, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0A10',
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  forgotPassword: {
    color: COLORS.accent,
    textAlign: 'right',
    marginBottom: 24,
    fontWeight: '600',
    fontSize: 14,
  },
  loginBtn: {
    marginBottom: 20,
    height: 52,
    borderRadius: SIZES.radius,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  orText: {
    color: COLORS.textMuted,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  signupText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
