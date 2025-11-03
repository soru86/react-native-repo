import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../store';
import { setCredentials, setLoading } from '../store/slices/authSlice';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import CoachNavigator from './CoachNavigator';
import LoadingScreen from '../components/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch(setCredentials({ token, user }));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'coach' ? (
          <Stack.Screen name="Coach" component={CoachNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
