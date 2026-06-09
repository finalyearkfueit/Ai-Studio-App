import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';

const AnimatedAlert = ({ visible, type = 'error', title, message, onClose }) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        closeAlert();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const closeAlert = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'close-circle',
          color: '#FF5555',
          bgColor: 'rgba(255, 85, 85, 0.1)',
          borderColor: '#FF5555',
        };
      case 'success':
        return {
          icon: 'checkmark-circle',
          color: '#4CAF50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: '#4CAF50',
        };
      case 'warning':
        return {
          icon: 'alert-circle',
          color: '#FFA500',
          bgColor: 'rgba(255, 165, 0, 0.1)',
          borderColor: '#FFA500',
        };
      default:
        return {
          icon: 'information-circle',
          color: '#2196F3',
          bgColor: 'rgba(33, 150, 243, 0.1)',
          borderColor: '#2196F3',
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View
            style={[
              styles.alert,
              {
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
              },
            ]}
          >
            {/* Icon */}
            <View style={styles.iconWrapper}>
              <Ionicons
                name={config.icon}
                size={40}
                color={config.color}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.title, { color: config.color }]}>
                {title}
              </Text>
              <Text style={styles.message}>
                {message}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: config.bgColor }]}
              onPress={closeAlert}
            >
              <Ionicons
                name="close"
                size={24}
                color={config.color}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 380,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1.5,
    padding: 16,
    backgroundColor: 'rgba(255, 85, 85, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedAlert;
