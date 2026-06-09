import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, GRADIENTS } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SPLASH_DATA = [
  {
    id: 0,
    title: 'AI Background Remover',
    subtitle: 'Extract subjects with pixel-perfect transparency instantly.',
    imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    icon: 'content-cut',
    color: '#BD93F9',
  },
  {
    id: 1,
    title: 'AI Image Enhancement',
    subtitle: 'Turn low-res, blurry photos into crisp HD masterpieces.',
    imageUri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    icon: 'magic-staff',
    color: '#8BE9FD',
  },
  {
    id: 2,
    title: 'AI Cloth Swap Try-On',
    subtitle: 'Visualize outfits on yourself instantly using virtual try-on.',
    imageUri: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop',
    icon: 'tshirt-crew-outline',
    color: '#FF79C6',
  }
];

export default function SplashScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Cycle through steps
    const timer = setInterval(() => {
      if (currentStep < 2) {
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentStep(prev => prev + 1);
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
      } else {
        clearInterval(timer);
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [currentStep, fadeAnim, navigation]);

  const activeData = SPLASH_DATA[currentStep];

  return (
    <View style={styles.container}>
      {/* Background radial gradient mock */}
      <LinearGradient
        colors={[COLORS.background, '#16132A']}
        style={styles.background}
      />
      
      {/* Top glowing orb */}
      <View style={[styles.glowOrb, { backgroundColor: activeData.color }]} />

      {/* Main Branding Logo always at top */}
      <View style={styles.brandingHeader}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Ai</Text>
          <View style={[styles.dot, { backgroundColor: activeData.color }]} />
        </View>
        <Text style={styles.appName}>STUDIO</Text>
      </View>

      {/* Dynamic Animated Content */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
        {/* Visual Graphic Representation */}
        <View style={styles.graphicsWrapper}>
          {currentStep === 0 && (
            // Background Removal Checkboard & cut-out effect
            <View style={styles.checkerboardContainer}>
              <View style={styles.checkerPattern}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.checkSquare, 
                      { backgroundColor: (Math.floor(i / 6) + (i % 6)) % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'transparent' }
                    ]} 
                  />
                ))}
              </View>
              <Image source={{ uri: activeData.imageUri }} style={styles.splashImage} />
              <View style={styles.scannerLine} />
            </View>
          )}

          {currentStep === 1 && (
            // Before/After comparison visual
            <View style={styles.enhanceContainer}>
              <View style={styles.halfImageWrapper}>
                <Image source={{ uri: activeData.imageUri }} style={styles.blurryImage} blurRadius={4} />
                <View style={styles.badgeLeft}><Text style={styles.badgeText}>BEFORE</Text></View>
              </View>
              <View style={[styles.halfImageWrapper, styles.rightHalf]}>
                <Image source={{ uri: activeData.imageUri }} style={styles.clearImage} />
                <View style={styles.badgeRight}><Text style={styles.badgeText}>AFTER</Text></View>
              </View>
              <View style={styles.sliderSeparator} />
            </View>
          )}

          {currentStep === 2 && (
            // Cloth Swap visual mockup
            <View style={styles.swapContainer}>
              <Image source={{ uri: activeData.imageUri }} style={styles.modelImage} />
              <LinearGradient
                colors={['transparent', 'rgba(11, 10, 16, 0.9)']}
                style={styles.imageOverlay}
              />
              <View style={styles.outfitBadge}>
                <MaterialCommunityIcons name="cached" size={16} color="#0B0A10" />
                <Text style={styles.outfitText}>Outfit Swapped</Text>
              </View>
            </View>
          )}
        </View>

        {/* Feature Titles */}
        <View style={styles.textDetails}>
          <View style={styles.iconChip}>
            <MaterialCommunityIcons name={activeData.icon} size={22} color={activeData.color} />
          </View>
          <Text style={styles.featureTitle}>{activeData.title}</Text>
          <Text style={styles.featureSubtitle}>{activeData.subtitle}</Text>
        </View>

      </Animated.View>

      {/* Progress Dots & Loading Indicator at bottom */}
      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          {SPLASH_DATA.map((item, idx) => (
            <View 
              key={idx} 
              style={[
                styles.progressDot, 
                idx === currentStep ? { backgroundColor: activeData.color, width: 24 } : styles.inactiveDot
              ]} 
            />
          ))}
        </View>
        <ActivityIndicator size="small" color={activeData.color} style={{ marginTop: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  glowOrb: {
    position: 'absolute',
    top: height * 0.15,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.12,
    blurRadius: 100, // Concept shadow
    alignSelf: 'center',
  },
  brandingHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -2,
    fontStyle: 'italic',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    marginLeft: 2,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 6,
    marginTop: -4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  graphicsWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 8,
  },
  // Feature 1: Background Removal Graphics
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
    width: (width * 0.72) / 6,
    height: (width * 0.72) / 8,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  scannerLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#BD93F9',
    width: '100%',
    top: '50%',
    shadowColor: '#BD93F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  // Feature 2: Image Enhancement Graphics
  enhanceContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  halfImageWrapper: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  blurryImage: {
    width: width * 0.72,
    height: width * 0.72,
  },
  clearImage: {
    width: width * 0.72,
    height: width * 0.72,
    marginLeft: -(width * 0.72) / 2,
  },
  rightHalf: {
    borderLeftWidth: 0,
  },
  sliderSeparator: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#8BE9FD',
    zIndex: 10,
  },
  badgeLeft: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(139, 233, 253, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Feature 3: Cloth Swap Graphics
  swapContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  modelImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  outfitBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF79C6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  outfitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B0A10',
    marginLeft: 4,
  },
  // Typography and Texts
  textDetails: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 6,
  }
});
