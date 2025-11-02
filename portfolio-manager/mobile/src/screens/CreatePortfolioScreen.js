import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

const CREATE_PORTFOLIO = gql`
  mutation CreatePortfolio($name: String!, $description: String) {
    createPortfolio(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const CreatePortfolioScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isTablet, isSmallScreen } = useResponsive();

  const [createPortfolio] = useMutation(CREATE_PORTFOLIO, {
    onCompleted: () => {
      navigation.goBack();
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Portfolio name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createPortfolio({
        variables: {
          name: name.trim(),
          description: description.trim() || null,
        },
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not create portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTablet,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Portfolio Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter portfolio name"
          error={errors.name}
        />

        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <Button
          title="Create Portfolio"
          onPress={handleCreate}
          loading={loading}
          style={styles.createButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  contentTablet: {
    padding: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  createButton: {
    marginTop: 8,
  },
});


