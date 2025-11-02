import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const { isTablet, isSmallScreen } = useResponsive();

  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'danger' && styles.dangerButton,
    isTablet && styles.buttonTablet,
    isSmallScreen && styles.buttonSmall,
    (disabled || loading) && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.primaryButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
    variant === 'danger' && styles.dangerButtonText,
    isTablet && styles.buttonTextTablet,
    isSmallScreen && styles.buttonTextSmall,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonTablet: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40,
  },
  primaryButton: {
    backgroundColor: colors.buttonPrimary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.buttonDanger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextTablet: {
    fontSize: 18,
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
});


