import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const PREMIUM_FEATURES = [
  { id: '1', icon: 'high-definition', label: 'Unlimited HD Exports', desc: 'Download creations in maximum resolution.' },
  { id: '2', icon: 'lightning-bolt', label: '3x Faster Processing', desc: 'Skip the line with dedicated AI GPU servers.' },
  { id: '3', icon: 'block-helper', label: 'Zero Interruptions', desc: 'Enjoy a completely clean, ad-free experience.' },
  { id: '4', icon: 'tshirt-crew', label: 'Unlock 500+ Outfits', desc: 'Access exclusive clothes, jackets & dresses.' },
  { id: '5', icon: 'magic-staff', label: 'Pro Filters & Editing', desc: 'Premium artistic sketch styles and enhancers.' }
];

const PACKAGES = [
  { id: 'weekly', title: 'Weekly Plan', price: '$4.99', period: '/ week', subtitle: '3-Day Free Trial Included', badge: null },
  { id: 'monthly', title: 'Monthly Pass', price: '$9.99', period: '/ month', subtitle: 'Cancel anytime', badge: 'Best Value' },
  { id: 'yearly', title: 'Annual Access', price: '$49.99', period: '/ year', subtitle: 'Equivalent to $4.16/mo', badge: 'Save 60%' }
];

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [processing, setProcessing] = useState(false);
  const { colors, gradients, isDarkMode } = useTheme();

  const handleSubscribe = () => {
    setProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setProcessing(false);
      Alert.alert(
        "Welcome to Pro! 👑",
        "Your transaction was successful. You now have full access to all Premium AI features.",
        [{ text: "Awesome", onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      {/* Glow Rings */}
      <View style={[styles.glowTopLeft, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.05)' }]} />
      <View style={[styles.glowBottomRight, { backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.12)' : 'rgba(236, 72, 153, 0.04)' }]} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Close Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[
              styles.closeBtn, 
              { 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                borderColor: colors.border 
              }
            ]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Header */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.crownGlow}
          >
            <MaterialCommunityIcons name="crown" size={36} color="#FFF" />
          </LinearGradient>
          
          <Text style={[styles.heroTitle, { color: colors.text }]}>AI STUDIO ELITE</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>Unleash the full power of generative artificial intelligence</Text>
        </View>

        {/* Features List */}
        <View style={[styles.featuresList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {PREMIUM_FEATURES.map((feat) => (
            <View key={feat.id} style={styles.featureItem}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.featIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name={feat.icon} size={20} color="#FFF" />
              </LinearGradient>
              <View style={styles.featTextCol}>
                <Text style={[styles.featTitle, { color: colors.text }]}>{feat.label}</Text>
                <Text style={[styles.featDesc, { color: colors.textSecondary }]}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Cards */}
        <Text style={[styles.chooseTitle, { color: colors.text }]}>Choose Your Plan</Text>
        <View style={styles.packagesContainer}>
          {PACKAGES.map((pkg) => {
            const isSelected = selectedPlan === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.15)'
                  }
                ]}
                activeOpacity={0.9}
                onPress={() => setSelectedPlan(pkg.id)}
              >
                {pkg.badge && (
                  <LinearGradient
                    colors={gradients.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.badgeContainer}
                  >
                    <Text style={styles.badgeText}>{pkg.badge}</Text>
                  </LinearGradient>
                )}
                
                <View style={styles.packageHeader}>
                  <View style={[styles.radioButton, { borderColor: colors.textSecondary }]}>
                    {isSelected && (
                      <LinearGradient
                        colors={gradients.primary}
                        style={styles.radioDot}
                      />
                    )}
                  </View>
                  <View style={styles.packageInfo}>
                    <Text style={[styles.packageTitle, { color: colors.text }]}>{pkg.title}</Text>
                    <Text style={[styles.packageSubtitle, { color: colors.textSecondary }]}>{pkg.subtitle}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.packagePrice, { color: colors.text }]}>{pkg.price}</Text>
                    <Text style={[styles.packagePeriod, { color: colors.textSecondary }]}>{pkg.period}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.subscribeBtnWrapper} 
          activeOpacity={0.8}
          onPress={handleSubscribe}
          disabled={processing}
        >
          <LinearGradient
            colors={gradients.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subscribeBtn}
          >
            <Text style={styles.subscribeBtnText}>
              {processing ? 'Processing Securely...' : 'Start Free Trial & Subscribe'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Security Notes */}
        <View style={styles.securityContainer}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>Secured with App Store. Cancel anytime in settings.</Text>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity><Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Terms of Service</Text></TouchableOpacity>
          <Text style={[styles.footerDivider, { color: colors.textSecondary }]}>•</Text>
          <TouchableOpacity><Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Privacy Policy</Text></TouchableOpacity>
          <Text style={[styles.footerDivider, { color: colors.textSecondary }]}>•</Text>
          <TouchableOpacity><Text style={[styles.footerLinkText, { color: colors.textSecondary }]}>Restore Purchase</Text></TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  glowTopLeft: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    blurRadius: 100,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    blurRadius: 120,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 40,
    alignItems: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  crownGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  featuresList: {
    backgroundColor: 'rgba(21, 19, 36, 0.6)',
    borderRadius: SIZES.radius,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  featIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featTextCol: {
    marginLeft: 14,
    flex: 1,
  },
  featTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  featDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  chooseTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  packagesContainer: {
    marginBottom: 20,
  },
  packageCard: {
    backgroundColor: 'rgba(21, 19, 36, 0.6)',
    borderRadius: SIZES.radiusSmall + 4,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    position: 'relative',
    overflow: 'hidden',
  },
  packageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  packageSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  packagePeriod: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  subscribeBtnWrapper: {
    marginVertical: 15,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeBtn: {
    borderRadius: SIZES.radiusSmall + 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  securityText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginLeft: 6,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  footerLinkText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  footerDivider: {
    color: COLORS.textMuted,
    marginHorizontal: 8,
    fontSize: 10,
  },
});
