import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, useRef, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/Button';
import Card from '../components/Card';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { passwordResetService } from '../utils/apiService';

export default function OTPScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [timer, setTimer] = useState(59);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const email = route.params?.email || '';
  const inputRefs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ];

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace back navigation focus
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    const result = await passwordResetService.verifyOTP(email, otpCode);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success!', result.message);
      navigation.replace('ResetPassword', { resetToken: result.resetToken });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setLoading(true);
      const result = await passwordResetService.requestOTP(email);
      setLoading(false);

      if (result.success) {
        setTimer(59);
        Alert.alert('Success!', 'OTP has been resent.');
      } else {
        Alert.alert('Error', result.message);
      }
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
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>We have sent a 6-digit code to your email</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.otpGrid}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                textAlign="center"
                placeholderTextColor={COLORS.textMuted}
                placeholder="•"
                editable={!loading}
              />
            ))}
          </View>

          <View style={styles.timerRow}>
            <Text style={styles.timerText}>
              {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}` : "Didn't receive the code?"}
            </Text>
            {timer === 0 && (
              <TouchableOpacity onPress={handleResend} disabled={loading}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomButton 
            title={loading ? "Verifying..." : "Verify & Proceed"} 
            onPress={handleVerify} 
            style={styles.actionBtn}
            disabled={loading}
          />
        </Card>

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
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 60,
    height: 64,
    borderRadius: SIZES.radius,
    backgroundColor: '#0B0A10',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  actionBtn: {
    height: 52,
    borderRadius: SIZES.radius,
  }
});
