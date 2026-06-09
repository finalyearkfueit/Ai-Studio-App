import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SIZES } from '../utils/theme';

export default function Card({ 
  children, 
  onPress, 
  style, 
  activeOpacity = 0.8 
}) {
  const { colors } = useTheme();

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={activeOpacity} 
        style={[styles.container, { backgroundColor: colors.card }, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    // Add subtle shadow for elevation if needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  }
});

