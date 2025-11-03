import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loginWithGoogle, isLoading } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await loginWithGoogle();
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      if (result.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      dispatch(setCredentials({ token: result.token, user: result.user, refreshToken: result.refreshToken }));
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      // Show error message to user
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Brand */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>⚽</Text>
            <Text style={styles.appName}>Beyond The Bench</Text>
            <Text style={styles.tagline}>Beyond Training Toward Excellence</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Develop Your Soccer Potential</Text>
            <Text style={styles.subtitle}>
              Find the right coach for your journey and take your game to the next level
            </Text>

            {/* Hero Image Placeholder */}
            <View style={styles.imageContainer}>
              <View style={styles.heroImage}>
                <Text style={styles.imagePlaceholder}>🎯</Text>
              </View>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.googleButtonText}>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? SPACING.md : SPACING.xl,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logoText: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.surface,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  imageContainer: {
    marginTop: SPACING.xl,
  },
  heroImage: {
    width: 250,
    height: 250,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 100,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButton: {
    backgroundColor: COLORS.surface,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.surface,
  },
  googleButton: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
  },
  googleButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.surface,
    opacity: 0.8,
  },
});

export default WelcomeScreen;
