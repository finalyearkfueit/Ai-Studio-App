import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function ProcessingScreen() {
  const navigation = useNavigation();
  const { colors, gradients, isDarkMode } = useTheme();
  
  // Wrap spinValue in useRef to prevent resetting on component updates/renders
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation for loader
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate to results after delay
    const timer = setTimeout(() => {
      navigation.replace('Result');
    }, 3000);

    return () => clearTimeout(timer);
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.backgroundGrad}
      />
      
      <View style={styles.content}>
        <View style={[styles.chipContainer, { shadowColor: colors.primary }]}>
          <Ionicons name="hardware-chip-outline" size={48} color={colors.primary} />
        </View>
        
        <Text style={[styles.text, { color: colors.text }]}>AI Magic is happening...</Text>
        
        {/* Custom mock loader ring */}
        <Animated.View style={[styles.loaderRing, { transform: [{ rotate: spin }], borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
          <View style={[styles.dot, { backgroundColor: '#FF79C6', top: -5, left: 35 }]} />
          <View style={[styles.dot, { backgroundColor: '#BD93F9', right: -5, top: 35 }]} />
          <View style={[styles.dot, { backgroundColor: '#8BE9FD', bottom: -5, left: 35 }]} />
          <View style={[styles.dot, { backgroundColor: '#9D4EDD', left: -5, top: 35 }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
  },
  chipContainer: {
    marginBottom: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 60,
  },
  loaderRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});
