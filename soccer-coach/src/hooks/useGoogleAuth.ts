import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useState } from 'react';
import ApiService from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = Platform.select({
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_GOOGLE_CLIENT_ID',
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_GOOGLE_CLIENT_ID',
  default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_GOOGLE_CLIENT_ID',
});

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID!,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: Platform.select({
      ios: 'soccercoach://',
      android: 'soccercoach://',
      default: 'soccercoach://',
    }),
  });

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();

      if (result.type === 'success') {
        const { authentication } = result;
        const token = authentication?.idToken || authentication?.accessToken;

        if (token && authentication?.accessToken) {
          // Fetch user info from Google
          const userInfoResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication.accessToken}`
          );
          const userInfo = await userInfoResponse.json();

          // Send to backend for verification and JWT token
          const authService = (await import('../services/authService')).default;
          const data = await authService.handleSocialLogin('google', token, userInfo);
          setIsLoading(false);
          return {
            token: data.token,
            refreshToken: data.refreshToken,
            user: data.user,
          };
        }
      }

      setIsLoading(false);
      throw new Error('Google sign-in was cancelled or failed');
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Google sign-in failed');
    }
  };

  return {
    loginWithGoogle,
    isLoading,
    request,
    response,
  };
};
