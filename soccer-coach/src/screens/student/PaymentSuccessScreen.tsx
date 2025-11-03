import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { MainStackParamList } from '../../navigation/MainNavigator';

type PaymentSuccessScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PaymentSuccess'>;
type PaymentSuccessScreenRouteProp = RouteProp<MainStackParamList, 'PaymentSuccess'>;

const PaymentSuccessScreen: React.FC<{
  navigation: PaymentSuccessScreenNavigationProp;
  route: PaymentSuccessScreenRouteProp;
}> = ({ navigation, route }) => {
  const { amount } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your session has been booked successfully</Text>

        {amount && (
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>${amount}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconContainer: { marginBottom: SPACING.xl },
  title: { fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  amountContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    minWidth: 200,
    alignItems: 'center',
  },
  amountLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  amountValue: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.primary },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.surface },
});

export default PaymentSuccessScreen;
