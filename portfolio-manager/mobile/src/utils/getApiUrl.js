import { Platform } from 'react-native';

/**
 * Get the GraphQL API URL based on the platform and environment
 * 
 * For physical devices: Use your machine's local IP address
 * Find it with:
 *   Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
 *   Windows: ipconfig | findstr IPv4
 * 
 * Set EXPO_PUBLIC_API_URL in .env or app.json for custom URL
 */
export const getApiUrl = () => {
  // Priority 1: Check environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('Using API URL from environment:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Priority 2: Check Expo manifest (for production builds)
  try {
    const Constants = require('expo-constants').default;
    if (Constants?.expoConfig?.extra?.apiUrl) {
      console.log('Using API URL from config:', Constants.expoConfig.extra.apiUrl);
      return Constants.expoConfig.extra.apiUrl;
    }
  } catch (e) {
    // Constants not available, skip
  }

  // Platform-specific defaults
  if (Platform.OS === 'web') {
    const url = 'http://localhost:4000/graphql';
    console.log('Web platform - using:', url);
    return url;
  }

  if (Platform.OS === 'android') {
    // Android emulator special IP to access host machine
    // For physical Android devices, use your computer's local IP
    const url = __DEV__ ? 'http://10.0.2.2:4000/graphql' : 'http://localhost:4000/graphql';
    console.log('Android platform - using:', url);
    return url;
  }

  if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    // For physical iOS devices, use your computer's local IP
    const url = __DEV__ ? 'http://localhost:4000/graphql' : 'http://localhost:4000/graphql';
    console.log('iOS platform - using:', url);
    return url;
  }

  // Fallback
  const url = 'http://localhost:4000/graphql';
  console.warn('Unknown platform, using default:', url);
  return url;
};

/**
 * Helper to get local IP address (for manual configuration)
 * This is just a guide - you need to set it manually in .env
 */
export const getLocalIpInstructions = () => {
  if (Platform.OS === 'ios') {
    return `
For iOS Simulator: http://localhost:4000/graphql
For Physical iOS Device: 
  1. Find your Mac's IP: ifconfig | grep "inet " | grep -v 127.0.0.1
  2. Use: http://YOUR_IP:4000/graphql
  3. Set EXPO_PUBLIC_API_URL in .env file
`;
  }
  
  if (Platform.OS === 'android') {
    return `
For Android Emulator: http://10.0.2.2:4000/graphql
For Physical Android Device:
  1. Find your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
  2. Use: http://YOUR_IP:4000/graphql
  3. Set EXPO_PUBLIC_API_URL in .env file
`;
  }
  
  return 'Set EXPO_PUBLIC_API_URL environment variable with your API URL';
};

