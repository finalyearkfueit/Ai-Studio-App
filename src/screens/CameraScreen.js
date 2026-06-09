import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES, GRADIENTS } from '../utils/theme';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState('front'); // Set default to front for try-on self portraits
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { colors, gradients, isDarkMode } = useTheme();

  if (!permission) {
    return <View style={[styles.fallbackContainer, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.fallbackContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={[styles.permissionText, { color: colors.textSecondary }]}>We need your permission to access the camera</Text>
        <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
          <LinearGradient
            colors={gradients.button}
            style={styles.grantBtnGrad}
          >
            <Text style={styles.grantBtnText}>Grant Permission</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }


  const captureImage = () => {
    navigation.navigate('Result');
  };

  const renderCameraPreview = () => (
    <>
      <CameraView style={styles.cameraView} facing={facing} />
      {/* Dynamic Glass Outline Guides for body alignment */}
      <View pointerEvents="none" style={styles.bodyOutlineContainer}>
        <View style={styles.headOutline} />
        <View style={styles.shoulderOutline} />
        <View style={styles.torsoOutline} />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {isFocused && renderCameraPreview()}

      {/* Floating Header Actions */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Align Posture</Text>
        <TouchableOpacity style={styles.circleBtn} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
          <Ionicons name="camera-reverse-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Right Side Tools */}
      <View style={styles.rightMenuContainer}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="flash-off-outline" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="timer-outline" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="grid-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.clothingScroll}
        >
          <View style={styles.clothingItem}>
             <View style={styles.clothingBox}>
               <Ionicons name="shirt-outline" size={22} color="#FFF" />
             </View>
             <Text style={styles.clothingText}>T-Shirt</Text>
          </View>
          
          {/* Main Shutter Capture Action Button */}
          <View style={styles.captureWrapper}>
            <TouchableOpacity onPress={captureImage} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENTS.accent}
                style={styles.captureButtonOuter}
              >
                <View style={styles.captureButtonInner} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.clothingItem}>
             <View style={styles.clothingBox}>
                <MaterialCommunityIcons name="hanger" size={22} color="#FFF" />
             </View>
             <Text style={styles.clothingText}>Jacket</Text>
          </View>
          <View style={styles.clothingItem}>
             <View style={styles.clothingBox}>
               <Ionicons name="help-circle-outline" size={22} color="#FFF" />
             </View>
             <Text style={styles.clothingText}>Others</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fallbackContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },
  permissionText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  grantBtn: {
    width: '100%',
    maxWidth: 240,
    borderRadius: 24,
    overflow: 'hidden',
  },
  grantBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  grantBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Body Align Overlay Guide
  bodyOutlineContainer: {
    position: 'absolute',
    top: (height - height * 0.55) / 2 - 40,
    left: (width - width * 0.75) / 2,
    width: width * 0.75,
    height: height * 0.55,
    alignItems: 'center',
    justifyContent: 'flex-start',
    opacity: 0.5,
    zIndex: 5,
  },
  headOutline: {
    width: 100,
    height: 130,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  shoulderOutline: {
    width: 220,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: COLORS.cyan,
    borderStyle: 'dashed',
  },
  torsoOutline: {
    width: 160,
    height: 200,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.cyan,
    borderStyle: 'dashed',
  },
  // Floating top navigation
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // Right floating controls
  rightMenuContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // Bottom Controls
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingTop: 24,
    backgroundColor: 'rgba(5, 4, 8, 0.75)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  clothingScroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  clothingItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  clothingBox: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  clothingText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  captureWrapper: {
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#FFF',
  }
});
