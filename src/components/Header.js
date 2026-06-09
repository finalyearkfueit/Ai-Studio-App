import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ 
  title, 
  onBack, 
  rightIcon, 
  onRightPress 
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Ionicons name={rightIcon} size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} /> // Placeholder for balance
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  }
});

