import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, Alert, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/Button';
import Card from '../components/Card';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { passwordResetService } from '../utils/apiService';

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetToken = route.params?.resetToken || '';

  const handleReset = async () => {
    Keyboard.dismiss();
    
    if (password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await passwordResetService.resetPassword(resetToken, password, confirmPassword);
    setLoading(false);

    if (result.success) {
      setShowSuccess(true);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.background, '#16132A']}
        style={styles.backgroundGrad}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create a strong, new password for your account</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              caretHidden={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-open-outline" size={20} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              caretHidden={false}
            />
          </View>

          <CustomButton 
            title={loading ? "Setting..." : "Reset Password"} 
            onPress={handleReset} 
            style={styles.actionBtn}
            disabled={loading}
          />
        </Card>

      </KeyboardAvoidingView>

      {/* Success Dialog Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.successIconWrapper}>
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.successIconCircle}
              >
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </LinearGradient>
            </View>

            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalSubtitle}>
              Your password has been reset successfully. You can now log in with your new password.
            </Text>

            <CustomButton
              title="Back to Log In"
              onPress={handleSuccessClose}
              style={styles.modalBtn}
            />
          </View>
        </View>
      </Modal>
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
  actionBtn: {
    marginTop: 10,
    height: 52,
    borderRadius: SIZES.radius,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 4, 8, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  glassModal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(21, 19, 36, 0.9)',
    borderRadius: SIZES.radiusLarge,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconWrapper: {
    marginBottom: 24,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalBtn: {
    width: '100%',
    height: 48,
    borderRadius: SIZES.radius,
  }
});
