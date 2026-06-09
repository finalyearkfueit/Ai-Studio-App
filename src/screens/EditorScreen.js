import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/Button';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const tools = [
  { id: '1', name: 'Remove BG', icon: 'content-cut', route: 'Processing' },
  { id: '2', name: 'Adjust', icon: 'tune' },
  { id: '3', name: 'Filters', icon: 'filter-variant' },
  { id: '4', name: 'Text', icon: 'format-text' },
  { id: '5', name: 'Try-On', icon: 'tshirt-crew-outline', route: 'TryOn' },
];

const backgrounds = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1511452885600-a3d809a48dc3?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1506744626753-1fa28f6e5200?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=150&h=150&fit=crop',
];

export default function EditorScreen() {
  const [activeTab, setActiveTab] = useState('Nature');
  const [intensity, setIntensity] = useState(60);
  const [bgImage, setBgImage] = useState(null);
  const [isBgRemoved, setIsBgRemoved] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, gradients, isDarkMode } = useTheme();
  const [trackWidth, setTrackWidth] = useState(width - 40);

  useEffect(() => {
    // Check if background uri was passed back from BackgroundScreen
    if (route.params?.bgUri) {
      setBgImage(route.params.bgUri);
    }
  }, [route.params?.bgUri]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my cool AI Studio edit!',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleToolPress = (tool) => {
    if (tool.route) {
      navigation.navigate(tool.route);
    } else if (tool.name === 'Remove BG') {
      setIsBgRemoved(true);
    }
  };

  const handleSliderTouch = (event) => {
    const { locationX } = event.nativeEvent;
    let pct = Math.round((locationX / trackWidth) * 100);
    pct = Math.max(0, Math.min(100, pct));
    setIntensity(pct);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <Header 
        title="Upload / Editor" 
        rightIcon="share-social-outline"
        onRightPress={handleShare} 
      />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Main Canvas Area */}
        <View style={[styles.canvasContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Faux Checkerboard background if BG is removed */}
          {isBgRemoved && (
            <View style={styles.checkerPattern}>
              {Array.from({ length: 48 }).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.checkSquare, 
                    { backgroundColor: (Math.floor(i / 6) + (i % 6)) % 2 === 0 ? (isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent' }
                  ]} 
                />
              ))}
            </View>
          )}

          {/* Underlay Selected Background */}
          {bgImage && (
            <Image source={{ uri: bgImage }} style={styles.underlayBg} />
          )}

          {/* Main Subject */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop' }} 
            style={[styles.subjectImage, isBgRemoved && styles.subjectCutout]} 
          />

          {isBgRemoved && (
            <View style={[styles.cutoutLabel, { backgroundColor: colors.primary }]}>
              <Ionicons name="sparkles" size={12} color="#FFF" />
              <Text style={styles.cutoutLabelText}>AI Cutout Active</Text>
            </View>
          )}
        </View>

        {/* Toolbar */}
        <View style={[styles.toolbarWrapper, { borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
            {tools.map((tool) => (
              <TouchableOpacity key={tool.id} style={styles.toolItem} onPress={() => handleToolPress(tool)}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderColor: colors.border }]}>
                  <MaterialCommunityIcons name={tool.icon} size={22} color={colors.text} />
                </View>
                <Text style={[styles.toolText, { color: colors.textSecondary }]}>{tool.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Background Change Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Background</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BackgroundScreen')}>
            <Text style={[styles.moreText, { color: colors.primary }]}>Browse Gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          {['Nature', 'Studio', 'Grid'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[
                styles.tab, 
                { backgroundColor: colors.card, borderColor: colors.border },
                activeTab === tab && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: colors.textSecondary },
                activeTab === tab && { color: '#FFF', fontWeight: '700' }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bgScroll}>
          {backgrounds.map((bg, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.bgItem, { borderColor: bgImage === bg ? colors.primary : 'transparent' }]} 
              onPress={() => setBgImage(bg)}
            >
              <Image source={{ uri: bg }} style={styles.bgImage} />
              {bgImage === bg && (
                <View style={[styles.selectedBgIndicator, { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)' }]}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Intensity Slider Control */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabelRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Glow Intensity</Text>
            <Text style={[styles.sliderVal, { color: colors.primary }]}>{intensity}%</Text>
          </View>
          <View 
            style={[styles.sliderTrack, { backgroundColor: colors.card }]}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleSliderTouch}
            onResponderMove={handleSliderTouch}
          >
            <LinearGradient
              colors={gradients.primary}
              style={[styles.sliderFill, { width: `${intensity}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
            />
            <View 
              style={[styles.sliderThumb, { left: `${intensity}%`, marginLeft: -10, borderColor: colors.primary, shadowColor: colors.primary }]} 
              pointerEvents="none"
            />
          </View>
        </View>

        {/* Apply & Save Buttons */}
        <View style={styles.actionBtnRow}>
          <CustomButton 
            title="Export HD Result" 
            onPress={() => navigation.navigate('Processing')} 
            style={styles.exportBtn}
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
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  checkerPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFillObject,
  },
  checkSquare: {
    width: (width - 40) / 6,
    height: (width - 40) / 8,
  },
  underlayBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  subjectImage: {
    width: '100%',
    height: '100%',
  },
  subjectCutout: {
    // Styling representation of cutout
  },
  cutoutLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  cutoutLabelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  toolbarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 10,
  },
  toolbarScroll: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  toolItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  toolText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  moreText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  bgScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  bgItem: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  selectedBgIndicator: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderVal: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
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
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnRow: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  exportBtn: {
    height: 52,
    borderRadius: SIZES.radius,
  }
});

