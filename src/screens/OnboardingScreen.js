import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    title: 'Instantly Remove\nBackgrounds',
    subtitle: 'Extract subjects with pixel-perfect precision. Replace backgrounds with rich AI studio filters in seconds.',
    imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    type: 'remover',
  },
  {
    title: 'Enhance Low-Res\nImages to Ultra-HD',
    subtitle: 'AI magic denoises, sharpens details, and increases resolution of blurry images instantly.',
    imageUri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    type: 'enhancer',
  },
  {
    title: 'Virtual Try-On &\nOutfit Cloth Swap',
    subtitle: 'Upload your photo, select any outfit, and preview how it fits you instantly using deep generative model try-on.',
    imageUri: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop',
    type: 'tryon',
  }
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [slideIndex, setSlideIndex] = useState(0);

  const handleNext = () => {
    if (slideIndex < ONBOARDING_SLIDES.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  const currentSlide = ONBOARDING_SLIDES[slideIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Dynamic Background Glow */}
      <View style={[styles.glowOrb, { 
        backgroundColor: slideIndex === 0 ? '#BD93F9' : slideIndex === 1 ? '#8BE9FD' : '#FF79C6' 
      }]} />

      <View style={styles.container}>
        
        {/* Top Header branding */}
        <View style={styles.topHeader}>
          <Text style={styles.stepIndicator}>0{slideIndex + 1} / 03</Text>
        </View>

        {/* Feature Visual Graphics */}
        <View style={styles.imageWrapper}>
          {currentSlide.type === 'remover' && (
            <View style={styles.checkerboardContainer}>
              <View style={styles.checkerPattern}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.checkSquare, 
                      { backgroundColor: (Math.floor(i / 5) + (i % 5)) % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'transparent' }
                    ]} 
                  />
                ))}
              </View>
              <Image source={{ uri: currentSlide.imageUri }} style={styles.image} />
              <View style={styles.removerOverlay} />
            </View>
          )}

          {currentSlide.type === 'enhancer' && (
            <View style={styles.enhancerContainer}>
              <View style={styles.halfImage}>
                <Image source={{ uri: currentSlide.imageUri }} style={styles.blurryOnbImage} blurRadius={3} />
              </View>
              <View style={[styles.halfImage, styles.rightHalf]}>
                <Image source={{ uri: currentSlide.imageUri }} style={styles.clearOnbImage} />
              </View>
              <View style={styles.comparisonBar} />
            </View>
          )}

          {currentSlide.type === 'tryon' && (
            <View style={styles.tryonContainer}>
              <Image source={{ uri: currentSlide.imageUri }} style={styles.image} />
              <View style={styles.outfitGridMock}>
                <View style={styles.outfitChip}><Ionicons name="shirt" size={14} color="#FFF" /></View>
                <View style={[styles.outfitChip, styles.activeOutfitChip]}><Ionicons name="shirt-outline" size={14} color="#0B0A10" /></View>
              </View>
            </View>
          )}
        </View>

        {/* Info detail text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
        </View>

        {/* Action Button Navigation Controls */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.replace('Auth')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.dotsContainer}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.dot, 
                  idx === slideIndex ? styles.activeDot : null
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleNext}>
            <LinearGradient
              colors={GRADIENTS.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextText}>
                {slideIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowOrb: {
    position: 'absolute',
    top: height * 0.12,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 40,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  imageWrapper: {
    alignSelf: 'center',
    width: width * 0.76,
    height: width * 0.76,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Remover graphics
  checkerboardContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  checkerPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFillObject,
  },
  checkSquare: {
    width: (width * 0.76) / 5,
    height: (width * 0.76) / 6,
  },
  removerOverlay: {
    position: 'absolute',
    left: '50%',
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(11, 10, 16, 0.3)',
    borderLeftWidth: 1,
    borderLeftColor: '#BD93F9',
  },
  // Enhancer graphics
  enhancerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  halfImage: {
    flex: 1,
    overflow: 'hidden',
  },
  blurryOnbImage: {
    width: width * 0.76,
    height: width * 0.76,
  },
  clearOnbImage: {
    width: width * 0.76,
    height: width * 0.76,
    marginLeft: -(width * 0.76) / 2,
  },
  rightHalf: {
    borderLeftWidth: 0,
  },
  comparisonBar: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#8BE9FD',
  },
  // Tryon graphics
  tryonContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  outfitGridMock: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(21, 19, 36, 0.8)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  outfitChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeOutfitChip: {
    backgroundColor: '#FF79C6',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    height: 60,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    paddingVertical: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 22,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  nextText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
