import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const sketchStyles = [
  { id: '1', name: 'Sketch', uri: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&h=150&fit=crop' },
  { id: '2', name: 'B&W Sketch', uri: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=150&h=150&fit=crop' },
  { id: '3', name: 'Acrylic', uri: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=150&h=150&fit=crop' },
  { id: '4', name: 'Charcoal', uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150&h=150&fit=crop' },
];

export default function SketchScreen() {
  const navigation = useNavigation();
  const [selectedStyle, setSelectedStyle] = useState('1');
  const [intensity, setIntensity] = useState(75);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(65);
  const [sketchImage, setSketchImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop');

  const { colors, gradients, isDarkMode } = useTheme();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setSketchImage(result.assets[0].uri);
    }
  };

  const [intensityWidth, setIntensityWidth] = useState(width - 80);
  const [brightnessWidth, setBrightnessWidth] = useState(width - 80);
  const [contrastWidth, setContrastWidth] = useState(width - 80);

  const handleIntensityTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / intensityWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setIntensity(pct);
  };

  const handleBrightnessTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / brightnessWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setBrightness(pct);
  };

  const handleContrastTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / contrastWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setContrast(pct);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header title="Artistic Sketch Editor" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Sketch Canvas Preview */}
        <View style={[styles.canvasContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image 
            source={{ uri: sketchImage }} 
            style={[
              styles.canvasImage, 
              selectedStyle === '2' && styles.bwSketchEffect,
              selectedStyle === '3' && styles.acrylicEffect,
              selectedStyle === '4' && styles.charcoalEffect,
            ]} 
          />
          {/* Faux sketch overlay filter effect using opacity */}
          <View style={[styles.sketchLineOverlay, { opacity: intensity / 100 }]} />
        </View>

        {/* Upload Button */}
        <View style={styles.uploadRow}>
          <TouchableOpacity 
            style={[styles.uploadBtn, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={[styles.uploadBtnText, { color: colors.text }]}>Upload Custom Image</Text>
          </TouchableOpacity>
        </View>

        {/* Styles Categories Slider */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sketch Style Presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.styleScroll}>
          {sketchStyles.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.styleCard, 
                { backgroundColor: colors.card },
                selectedStyle === item.id && { borderColor: colors.primary }
              ]}
              onPress={() => setSelectedStyle(item.id)}
            >
              <Image source={{ uri: item.uri }} style={styles.styleImage} />
              <View style={[styles.styleLabelBg, { backgroundColor: isDarkMode ? '#0B0A10' : '#E5E7EB' }]}>
                <Text style={[styles.styleLabel, { color: colors.textSecondary }]}>{item.name}</Text>
              </View>
              {selectedStyle === item.id && (
                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Adjustments Sliders */}
        <View style={[styles.slidersCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Sketch Intensity */}
          <View style={styles.sliderItem}>
            <View style={styles.sliderLabelRow}>
              <Text style={[styles.sliderName, { color: colors.textSecondary }]}>Sketch Intensity</Text>
              <Text style={[styles.sliderVal, { color: colors.primary }]}>{intensity}%</Text>
            </View>
            <View 
              style={[styles.sliderTrack, { backgroundColor: colors.background }]}
              onLayout={(e) => setIntensityWidth(e.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleIntensityTouch}
              onResponderMove={handleIntensityTouch}
            >
              <LinearGradient
                colors={gradients.primary}
                style={[styles.sliderFill, { width: `${intensity}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
              />
              <View 
                style={[styles.sliderThumb, { left: `${intensity}%`, marginLeft: -9, borderColor: colors.primary }]} 
                pointerEvents="none"
              />
            </View>
          </View>

          {/* Brightness */}
          <View style={styles.sliderItem}>
            <View style={styles.sliderLabelRow}>
              <Text style={[styles.sliderName, { color: colors.textSecondary }]}>Brightness</Text>
              <Text style={[styles.sliderVal, { color: colors.primary }]}>{brightness}%</Text>
            </View>
            <View 
              style={[styles.sliderTrack, { backgroundColor: colors.background }]}
              onLayout={(e) => setBrightnessWidth(e.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleBrightnessTouch}
              onResponderMove={handleBrightnessTouch}
            >
              <LinearGradient
                colors={['#8BE9FD', '#3B82F6']}
                style={[styles.sliderFill, { width: `${brightness}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
              />
              <View 
                style={[styles.sliderThumb, { left: `${brightness}%`, marginLeft: -9, borderColor: '#3B82F6' }]} 
                pointerEvents="none"
              />
            </View>
          </View>

          {/* Contrast */}
          <View style={styles.sliderItem}>
            <View style={styles.sliderLabelRow}>
              <Text style={[styles.sliderName, { color: colors.textSecondary }]}>Contrast</Text>
              <Text style={[styles.sliderVal, { color: colors.primary }]}>{contrast}%</Text>
            </View>
            <View 
              style={[styles.sliderTrack, { backgroundColor: colors.background }]}
              onLayout={(e) => setContrastWidth(e.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleContrastTouch}
              onResponderMove={handleContrastTouch}
            >
              <LinearGradient
                colors={['#FF79C6', '#EC4899']}
                style={[styles.sliderFill, { width: `${contrast}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
              />
              <View 
                style={[styles.sliderThumb, { left: `${contrast}%`, marginLeft: -9, borderColor: '#EC4899' }]} 
                pointerEvents="none"
              />
            </View>
          </View>
        </View>

        {/* Save/Apply buttons */}
        <View style={styles.footerBtn}>
          <CustomButton 
            title="Export Sketch Artwork" 
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
    marginBottom: 24,
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  // Mock image filter effects using tint/saturation approximation
  bwSketchEffect: {
    tintColor: '#EAEAEA',
  },
  acrylicEffect: {
    opacity: 0.85,
  },
  charcoalEffect: {
    tintColor: '#888888',
  },
  sketchLineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  styleScroll: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  styleCard: {
    width: 80,
    height: 100,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.card,
  },
  styleCardActive: {
    borderColor: COLORS.primary,
  },
  styleImage: {
    width: '100%',
    height: 70,
  },
  styleLabelBg: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0A10',
  },
  styleLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidersCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(21, 19, 36, 0.75)',
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  sliderItem: {
    marginBottom: 20,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderName: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  sliderVal: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#0B0A10',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#FFF',
    borderRadius: 9,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  footerBtn: {
    paddingHorizontal: 20,
  },
  uploadRow: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  uploadBtnText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  }
});
