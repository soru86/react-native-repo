import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  const { isTablet, isSmallScreen } = useResponsive();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isTablet && styles.labelTablet, isSmallScreen && styles.labelSmall]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isTablet && styles.inputTablet,
          isSmallScreen && styles.inputSmall,
          error && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.inputPlaceholder}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  labelTablet: {
    fontSize: 16,
  },
  labelSmall: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
    minHeight: 44,
    color: colors.inputText,
  },
  inputTablet: {
    paddingVertical: 16,
    fontSize: 18,
    minHeight: 52,
  },
  inputSmall: {
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 40,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});


