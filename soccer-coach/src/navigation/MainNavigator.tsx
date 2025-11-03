import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

import DashboardScreen from '../screens/student/DashboardScreen';
import ChooseMentorScreen from '../screens/student/ChooseMentorScreen';
import BookSessionScreen from '../screens/student/BookSessionScreen';
import CreateGroupSessionScreen from '../screens/student/CreateGroupSessionScreen';
import JoinGroupSessionScreen from '../screens/student/JoinGroupSessionScreen';
import UploadRecordingScreen from '../screens/student/UploadRecordingScreen';
import VideoFeedbackScreen from '../screens/student/VideoFeedbackScreen';
import PaymentSuccessScreen from '../screens/student/PaymentSuccessScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  ChooseMentor: undefined;
  BookSession: { mentorId?: string };
  CreateGroupSession: { mentorId?: string };
  JoinGroupSession: undefined;
  UploadRecording: undefined;
  VideoFeedback: { videoId: string };
  PaymentSuccess: { sessionId: string; amount?: number };
  Profile: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Sessions: undefined;
  Recordings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const MainTabs = () => {
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
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={ChooseMentorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Recordings"
        component={UploadRecordingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChooseMentor" component={ChooseMentorScreen} />
      <Stack.Screen name="BookSession" component={BookSessionScreen} />
      <Stack.Screen name="CreateGroupSession" component={CreateGroupSessionScreen} />
      <Stack.Screen name="JoinGroupSession" component={JoinGroupSessionScreen} />
      <Stack.Screen name="UploadRecording" component={UploadRecordingScreen} />
      <Stack.Screen name="VideoFeedback" component={VideoFeedbackScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
