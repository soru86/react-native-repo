import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { PortfolioListScreen } from '../screens/PortfolioListScreen';
import { PortfolioDetailScreen } from '../screens/PortfolioDetailScreen';
import { CreatePortfolioScreen } from '../screens/CreatePortfolioScreen';
import { CreateAssetScreen } from '../screens/CreateAssetScreen';
import { EditAssetScreen } from '../screens/EditAssetScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const PortfolioStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.backgroundSecondary,
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
      },
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: colors.background,
      },
    }}
  >
    <Stack.Screen
      name="PortfolioList"
      component={PortfolioListScreen}
      options={{ title: 'Portfolios' }}
    />
    <Stack.Screen
      name="PortfolioDetail"
      component={PortfolioDetailScreen}
      options={{ title: 'Portfolio Details' }}
    />
    <Stack.Screen
      name="CreatePortfolio"
      component={CreatePortfolioScreen}
      options={{ title: 'Create Portfolio' }}
    />
    <Stack.Screen
      name="CreateAsset"
      component={CreateAssetScreen}
      options={{ title: 'Add Asset' }}
    />
    <Stack.Screen
      name="EditAsset"
      component={EditAssetScreen}
      options={{ title: 'Edit Asset' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          // Add padding at the bottom to account for Android system navigation
          paddingBottom: Platform.OS === 'android' 
            ? Math.max(insets.bottom, 10) 
            : Math.max(insets.bottom, 5),
          paddingTop: 8,
          // Minimum height with dynamic adjustment for safe area
          minHeight: Platform.OS === 'android' 
            ? 60 + Math.max(insets.bottom, 0)
            : 60 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          backgroundColor: colors.tabBarBackground,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
      }}
    >
    <Tab.Screen
      name="Portfolios"
      component={PortfolioStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ size, focused }) => (
          <Ionicons 
            name={focused ? 'briefcase' : 'briefcase-outline'} 
            size={size} 
            color={focused ? colors.primary : colors.textTertiary} 
          />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ size, focused }) => (
          <Ionicons 
            name={focused ? 'person' : 'person-outline'} 
            size={size} 
            color={focused ? colors.primary : colors.textTertiary} 
          />
        ),
      }}
    />
  </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainTabs /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

