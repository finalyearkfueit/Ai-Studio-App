import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/Button';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ResultScreen() {
  const navigation = useNavigation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { colors, gradients, isDarkMode } = useTheme();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleSave = () => {
    triggerToast('Saved successfully to gallery! 📸');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my AI Studio generation! 📸',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Immersive Image */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop' }} 
        style={styles.fullImage} 
        resizeMode="cover"
      />

      {/* Gradient Bottom Fade out */}
      <LinearGradient
        colors={['transparent', isDarkMode ? 'rgba(11, 10, 16, 0.75)' : 'rgba(249, 250, 251, 0.75)', colors.background]}
        style={styles.fadeOverlay}
      />

      {/* Floating back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainTabs')}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFF" : colors.text} />
      </TouchableOpacity>

      <SafeAreaView style={styles.content}>
        
        {/* Dynamic Toast popup */}
        {showToast && (
          <View style={[styles.toastContainer, { borderColor: colors.border }]}>
            <LinearGradient
              colors={isDarkMode ? ['#1E1B3A', 'rgba(30, 27, 58, 0.85)'] : ['#FFFFFF', 'rgba(255, 255, 255, 0.95)']}
              style={styles.toastGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              <Text style={[styles.toastText, { color: colors.text }]}>{toastMessage}</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.footer}>
          
          <Text style={[styles.successTitle, { color: colors.text }]}>AI Generation Ready!</Text>
          <Text style={[styles.successDesc, { color: colors.textSecondary }]}>Your image has been processed using AI Studio Core. Denoise & enhance active.</Text>

          <CustomButton 
            title="Save to Gallery" 
            onPress={handleSave} 
            style={styles.btnSpacing}
          />
          
          <View style={styles.row}>
            <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color={colors.text} />
              <Text style={[styles.shareText, { color: colors.text }]}>Share Project</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.editBtn, 
                { 
                  backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.15)',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.4)'
                }
              ]} 
              onPress={() => navigation.navigate('Editor')}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={[styles.editText, { color: colors.primary }]}>Edit Again</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.homeLink} onPress={() => navigation.replace('MainTabs')}>
            <Text style={[styles.homeLinkText, { color: colors.textSecondary }]}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: height * 0.4,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  successDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  btnSpacing: {
    width: '100%',
    marginBottom: 16,
    height: 52,
    borderRadius: SIZES.radius,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  shareBtn: {
    flex: 0.48,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  shareText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  editBtn: {
    flex: 0.48,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  editText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  homeLink: {
    paddingVertical: 8,
  },
  homeLinkText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    width: width - 48,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 100,
  },
  toastGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  toastText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 10,
  }
});
