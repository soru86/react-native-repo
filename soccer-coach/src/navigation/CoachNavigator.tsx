import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

import CoachDashboardScreen from '../screens/coach/CoachDashboardScreen';
import CoachSessionsScreen from '../screens/coach/CoachSessionsScreen';
import ManageUsersScreen from '../screens/coach/ManageUsersScreen';
import CoachProfileScreen from '../screens/coach/CoachProfileScreen';
import SessionDetailsScreen from '../screens/coach/SessionDetailsScreen';

export type CoachStackParamList = {
  CoachTabs: undefined;
  ManageUsers: undefined;
  SessionDetails: { sessionId: string };
};

export type CoachTabParamList = {
  Dashboard: undefined;
  Sessions: undefined;
  Users: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<CoachTabParamList>();
const Stack = createStackNavigator<CoachStackParamList>();

const CoachTabs = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: Math.max(bottomInset, 5),
          paddingTop: 5,
          height: 60 + bottomInset,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={CoachDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={CoachSessionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={ManageUsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CoachProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const CoachNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CoachTabs" component={CoachTabs} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
      <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} />
    </Stack.Navigator>
  );
};

export default CoachNavigator;
