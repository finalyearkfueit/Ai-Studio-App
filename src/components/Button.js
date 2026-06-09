import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SIZES } from '../utils/theme';

export default function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle 
}) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
        <LinearGradient
          colors={GRADIENTS.button || ['#7C3AED', '#DB2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      style={[
        styles.container, 
        styles.outline, 
        variant === 'ghost' && styles.ghost,
        style
      ]}
    >
      <Text style={[
        styles.text, 
        styles.outlineText,
        variant === 'ghost' && styles.ghostText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#333344',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: COLORS.text,
  },
  ghost: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#8E8E93',
  }
});
