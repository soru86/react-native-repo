export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',

  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',

  border: '#E5E5EA',
  divider: '#C6C6C8',

  overlay: 'rgba(0, 0, 0, 0.5)',

  // Brand colors
  green: '#34C759',
  blue: '#007AFF',
  purple: '#5856D6',
  orange: '#FF9500',
  red: '#FF3B30',
  yellow: '#FFCC00',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

import { Platform } from 'react-native';

// API Base URL - Change this to your machine's IP address when testing on physical device
// To find your IP: 
//   - macOS/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
//   - Windows: `ipconfig` (look for IPv4 Address)
// For iOS Simulator/Android Emulator, use 'localhost'
// For physical devices, use your machine's local IP (e.g., '192.168.1.16')

const getApiBaseUrl = () => {
  // Use environment variable if set
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Your local machine's IP address (update this if your IP changes)
  // Find your IP: macOS/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
  //                 Windows: `ipconfig` (look for IPv4 Address)
  const LOCAL_IP = '192.168.1.16';

  // Set to true when testing on a PHYSICAL device
  // Set to false when testing on iOS Simulator or Android Emulator
  const USE_PHYSICAL_DEVICE = true; // Change this to false for simulators

  if (__DEV__) {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (USE_PHYSICAL_DEVICE) {
        // Use IP address for physical devices
        const url = `http://${LOCAL_IP}:3000/api`;
        console.log(`📱 Using network IP for physical device: ${url}`);
        return url;
      } else {
        // Use localhost for simulators/emulators
        return 'http://localhost:3000/api';
      }
    }
    // Default to localhost for development (web)
    return 'http://localhost:3000/api';
  }

  // Production API URL
  return 'https://api.soccercoach.app/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};
