import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

export const Card = ({ children, style }) => {
  const { isTablet, isSmallScreen } = useResponsive();

  return (
    <View style={[styles.card, isTablet && styles.cardTablet, isSmallScreen && styles.cardSmall, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTablet: {
    padding: 24,
    borderRadius: 16,
  },
  cardSmall: {
    padding: 12,
    borderRadius: 8,
  },
});


