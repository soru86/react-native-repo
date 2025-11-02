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

const CREATE_ASSET = gql`
  mutation CreateAsset(
    $portfolioId: ID!
    $name: String!
    $symbol: String
    $type: AssetType!
    $quantity: Float!
    $price: Float!
    $currency: String
    $purchaseDate: String
    $notes: String
  ) {
    createAsset(
      portfolioId: $portfolioId
      name: $name
      symbol: $symbol
      type: $type
      quantity: $quantity
      price: $price
      currency: $currency
      purchaseDate: $purchaseDate
      notes: $notes
    ) {
      id
      name
      value
    }
  }
`;

const ASSET_TYPES = [
  { label: 'Stock', value: 'STOCK' },
  { label: 'Bond', value: 'BOND' },
  { label: 'Crypto', value: 'CRYPTO' },
  { label: 'Real Estate', value: 'REAL_ESTATE' },
  { label: 'Commodity', value: 'COMMODITY' },
  { label: 'Other', value: 'OTHER' },
];

export const CreateAssetScreen = ({ route, navigation }) => {
  const { portfolioId } = route.params;
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('STOCK');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isTablet, isSmallScreen } = useResponsive();

  const [createAsset] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      navigation.goBack();
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Asset name is required';
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    const finalDate = purchaseDate ? new Date(purchaseDate).toISOString() : null;

    setLoading(true);
    try {
      await createAsset({
        variables: {
          portfolioId,
          name: name.trim(),
          symbol: symbol.trim() || null,
          type,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          currency: currency || 'USD',
          purchaseDate: finalDate,
          notes: notes.trim() || null,
        },
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not create asset');
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
          label="Asset Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Apple Inc."
          error={errors.name}
        />

        <Input
          label="Symbol (Optional)"
          value={symbol}
          onChangeText={setSymbol}
          placeholder="e.g., AAPL"
          autoCapitalize="characters"
          error={errors.symbol}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Type"
              value={type}
              onChangeText={setType}
              placeholder="STOCK"
              editable={false}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Currency"
              value={currency}
              onChangeText={setCurrency}
              placeholder="USD"
              error={errors.currency}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="0"
              keyboardType="decimal-pad"
              error={errors.quantity}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.price}
            />
          </View>
        </View>

        <Input
          label="Purchase Date (Optional)"
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
          error={errors.purchaseDate}
        />

        <Input
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes"
          multiline
          numberOfLines={3}
          error={errors.notes}
        />

        <View style={styles.typeSelector}>
          <Text style={styles.typeLabel}>Asset Type:</Text>
          <View style={styles.typeButtons}>
            {ASSET_TYPES.map((assetType) => (
              <Button
                key={assetType.value}
                title={assetType.label}
                variant={type === assetType.value ? 'primary' : 'secondary'}
                onPress={() => setType(assetType.value)}
                style={styles.typeButton}
              />
            ))}
          </View>
        </View>

        <Button
          title="Create Asset"
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  typeSelector: {
    marginTop: 8,
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
  },
  createButton: {
    marginTop: 8,
  },
});

