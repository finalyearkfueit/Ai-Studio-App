import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function EnhanceScreen() {
  const navigation = useNavigation();
  const [compareVal, setCompareVal] = useState(50); // Slider percent 0-100
  const [denoise, setDenoise] = useState(70);
  const [sharpness, setSharpness] = useState(80);
  const [quality, setQuality] = useState(90);
  const [photoUri, setPhotoUri] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop');

  const { colors, gradients, isDarkMode } = useTheme();
  
  const [canvasWidth, setCanvasWidth] = useState(width - 40);
  const [compareSliderWidth, setCompareSliderWidth] = useState(width - 40);
  const [denoiseWidth, setDenoiseWidth] = useState(width - 120);
  const [sharpnessWidth, setSharpnessWidth] = useState(width - 120);
  const [qualityWidth, setQualityWidth] = useState(width - 120);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleCanvasTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / canvasWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setCompareVal(pct);
  };

  const handleCompareSliderTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / compareSliderWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setCompareVal(pct);
  };

  const handleDenoiseTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / denoiseWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setDenoise(pct);
  };

  const handleSharpnessTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / sharpnessWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setSharpness(pct);
  };

  const handleQualityTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / qualityWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setQuality(pct);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="AI Enhance Image" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Interactive Before/After Screen Canvas */}
        <View 
          style={[styles.canvasContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
          onLayout={(e) => setCanvasWidth(e.nativeEvent.layout.width)}
        >
          {/* Before Image (underneath, blurry) */}
          <View style={styles.beforeContainer} pointerEvents="none">
            <Image source={{ uri: photoUri }} style={styles.canvasImage} blurRadius={4} />
            <View style={styles.badgeBefore}><Text style={styles.badgeText}>BEFORE</Text></View>
          </View>

          {/* After Image (overlaying, width controlled by state) */}
          <View style={[styles.afterContainer, { width: `${compareVal}%` }]} pointerEvents="none">
            <Image 
              source={{ uri: photoUri }} 
              style={[styles.canvasImage, { width: canvasWidth }]} 
            />
            <View style={styles.badgeAfter}><Text style={styles.badgeText}>AFTER</Text></View>
          </View>

          {/* Vertical divider line */}
          <View style={[styles.dividerLine, { left: `${compareVal}%`, backgroundColor: colors.primary }]} pointerEvents="none" />
          
          {/* Center handle knob overlay */}
          <View style={[styles.handleKnob, { left: `${compareVal}%`, marginLeft: -18, shadowColor: colors.primary }]} pointerEvents="none">
            <Ionicons name="swap-horizontal" size={16} color="#0B0A10" />
          </View>

          {/* Direct touch overlay responder */}
          <View 
            style={StyleSheet.absoluteFillObject}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleCanvasTouch}
            onResponderMove={handleCanvasTouch}
          />
        </View>

        {/* Drag handle slider for Before/After */}
        <View style={styles.compareSliderContainer}>
          <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Slide image or bar to compare</Text>
          <View 
            style={[styles.sliderTrack, { backgroundColor: colors.card }]}
            onLayout={(e) => setCompareSliderWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleCompareSliderTouch}
            onResponderMove={handleCompareSliderTouch}
          >
            <View style={[styles.sliderFill, { width: `${compareVal}%`, backgroundColor: colors.primary }]} pointerEvents="none" />
            <View 
              style={[styles.sliderThumb, { left: `${compareVal}%`, marginLeft: -10, borderColor: colors.primary }]}
              pointerEvents="none"
            />
          </View>

          {/* Direct buttons to set compare value */}
          <View style={styles.compareShortcuts}>
            <TouchableOpacity 
              onPress={() => setCompareVal(0)} 
              style={[styles.shortcutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.shortcutText, { color: colors.textSecondary }]}>Before</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setCompareVal(50)} 
              style={[styles.shortcutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.shortcutText, { color: colors.textSecondary }]}>Split</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setCompareVal(100)} 
              style={[styles.shortcutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.shortcutText, { color: colors.textSecondary }]}>After</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action picker button */}
        <View style={styles.uploadRow}>
          <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={[styles.uploadBtnText, { color: colors.text }]}>Upload Different Image</Text>
          </TouchableOpacity>
        </View>

        {/* Adjustment controls list */}
        <View style={[styles.adjustmentsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardHeader, { color: colors.text }]}>AI Enhancement Parameters</Text>
          
          {/* Denoise Slider */}
          <View style={styles.controlItem}>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlName, { color: colors.textSecondary }]}>AI Denoise</Text>
              <Text style={[styles.controlVal, { color: colors.text }]}>{denoise}%</Text>
            </View>
            <View style={styles.sliderRowWithButtons}>
              <TouchableOpacity onPress={() => setDenoise(Math.max(0, denoise - 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="remove" size={14} color={colors.text} />
              </TouchableOpacity>
              <View 
                style={[styles.track, { backgroundColor: colors.background }]}
                onLayout={(e) => setDenoiseWidth(e.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleDenoiseTouch}
                onResponderMove={handleDenoiseTouch}
              >
                <View style={[styles.trackFill, { width: `${denoise}%`, backgroundColor: '#BD93F9' }]} pointerEvents="none" />
                <View style={[styles.trackThumb, { left: `${denoise}%`, marginLeft: -8, borderColor: '#BD93F9' }]} pointerEvents="none" />
              </View>
              <TouchableOpacity onPress={() => setDenoise(Math.min(100, denoise + 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="add" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sharpness Slider */}
          <View style={styles.controlItem}>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlName, { color: colors.textSecondary }]}>Details Sharpness</Text>
              <Text style={[styles.controlVal, { color: colors.text }]}>{sharpness}%</Text>
            </View>
            <View style={styles.sliderRowWithButtons}>
              <TouchableOpacity onPress={() => setSharpness(Math.max(0, sharpness - 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="remove" size={14} color={colors.text} />
              </TouchableOpacity>
              <View 
                style={[styles.track, { backgroundColor: colors.background }]}
                onLayout={(e) => setSharpnessWidth(e.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleSharpnessTouch}
                onResponderMove={handleSharpnessTouch}
              >
                <View style={[styles.trackFill, { width: `${sharpness}%`, backgroundColor: '#8BE9FD' }]} pointerEvents="none" />
                <View style={[styles.trackThumb, { left: `${sharpness}%`, marginLeft: -8, borderColor: '#8BE9FD' }]} pointerEvents="none" />
              </View>
              <TouchableOpacity onPress={() => setSharpness(Math.min(100, sharpness + 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="add" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* HD Quality */}
          <View style={styles.controlItem}>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlName, { color: colors.textSecondary }]}>Face Restore (HD)</Text>
              <Text style={[styles.controlVal, { color: colors.text }]}>{quality}%</Text>
            </View>
            <View style={styles.sliderRowWithButtons}>
              <TouchableOpacity onPress={() => setQuality(Math.max(0, quality - 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="remove" size={14} color={colors.text} />
              </TouchableOpacity>
              <View 
                style={[styles.track, { backgroundColor: colors.background }]}
                onLayout={(e) => setQualityWidth(e.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleQualityTouch}
                onResponderMove={handleQualityTouch}
              >
                <View style={[styles.trackFill, { width: `${quality}%`, backgroundColor: '#FF79C6' }]} pointerEvents="none" />
                <View style={[styles.trackThumb, { left: `${quality}%`, marginLeft: -8, borderColor: '#FF79C6' }]} pointerEvents="none" />
              </View>
              <TouchableOpacity onPress={() => setQuality(Math.min(100, quality + 5))} style={[styles.adjustBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="add" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save button */}
        <View style={styles.footerBtn}>
          <CustomButton 
            title="Save HD Result" 
            onPress={() => navigation.navigate('Processing')} 
          />
        </View>

        <View style={{ height: 100 }} />

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
  container: {
    paddingBottom: 40,
  },
  canvasContainer: {
    width: width - 40,
    height: width - 40,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  beforeContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  afterContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 2,
  },
  canvasImage: {
    height: width - 40,
    resizeMode: 'cover',
  },
  dividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.primary,
    zIndex: 5,
  },
  handleKnob: {
    position: 'absolute',
    top: (width - 40) / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 6,
  },
  badgeBefore: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 1,
  },
  badgeAfter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  compareSliderContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sliderLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.card,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  compareShortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  shortcutBtn: {
    backgroundColor: COLORS.card,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  shortcutText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  uploadRow: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadBtnText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  adjustmentsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(21, 19, 36, 0.75)',
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 20,
  },
  controlItem: {
    marginBottom: 18,
  },
  controlInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlName: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  controlVal: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  sliderRowWithButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  track: {
    height: 6,
    backgroundColor: '#0B0A10',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  trackThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: '#FFF',
  },
  adjustBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerBtn: {
    paddingHorizontal: 20,
    marginTop: 24,
  }
});
