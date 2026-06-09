import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/Button';
import { SIZES } from '../utils/theme';
import TokenManager from '../utils/tokenManager';

export default function AccountScreen() {
  const navigation = useNavigation();
  const { colors, gradients, isDarkMode } = useTheme();

  const [name, setName] = useState('User');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await TokenManager.getUserData();
      if (userData?.username) {
        setName(userData.username);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const handleSaveChanges = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        Alert.alert('Validation Error', 'Please enter your current password to make changes.');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Validation Error', 'New password and confirm password do not match.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Validation Error', 'New password must be at least 6 characters.');
        return;
      }
    }

    Alert.alert(
      'Success',
      'Account settings updated successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      {/* Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Account Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Info</Text>
            
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 12 }]}>Change Password</Text>
            
            <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Current Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="key-outline" size={20} color={colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="New Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
            </View>

            <CustomButton 
              title="Save Changes" 
              onPress={handleSaveChanges} 
              style={styles.actionBtn}
            />

          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  container: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 52,
    borderWidth: 1,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  actionBtn: {
    height: 52,
    borderRadius: SIZES.radius,
    marginTop: 10,
  },
});
