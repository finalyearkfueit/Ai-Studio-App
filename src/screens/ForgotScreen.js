import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/Button';
import Card from '../components/Card';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { passwordResetService } from '../utils/apiService';

export default function ForgotScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    Keyboard.dismiss();
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    const result = await passwordResetService.requestOTP(email);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success!', result.message);
      navigation.navigate('OTP', { email });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.background, '#16132A']}
        style={styles.backgroundGrad}
      />
      
      {/* Top Left back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email to verify your identity</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.iconWrapper}>
            <View style={styles.keyCircle}>
              <Ionicons name="key" size={32} color="#BD93F9" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              caretHidden={false}
            />
          </View>

          <CustomButton 
            title={loading ? "Sending..." : "Send Reset Link"} 
            onPress={handleSendLink} 
            style={styles.actionBtn}
            disabled={loading}
          />
        </Card>

        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.footerLink}>
          <Text style={styles.footerText}>Back to Log In</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    padding: 24,
    borderRadius: SIZES.radiusLarge,
    backgroundColor: 'rgba(21, 19, 36, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  keyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(189, 147, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(189, 147, 249, 0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0A10',
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    marginBottom: 24,
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
  actionBtn: {
    height: 52,
    borderRadius: SIZES.radius,
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 35,
  },
  footerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  }
});
