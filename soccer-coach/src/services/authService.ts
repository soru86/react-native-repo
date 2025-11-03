import ApiService from './api';

class AuthService {
  // Email/Password authentication
  async loginWithEmail(email: string, password: string) {
    try {
      const data = await ApiService.login(email, password);
      return {
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async registerWithEmail(data: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'coach';
  }) {
    try {
      const result = await ApiService.register(data);
      return {
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Social login - call this from the hook
  async handleSocialLogin(provider: string, token: string, userInfo?: any) {
    try {
      const data = await ApiService.socialLogin(provider, token, userInfo);
      return {
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `${provider} sign-in failed`);
    }
  }

  // Facebook OAuth (placeholder - requires react-native-fbsdk-next setup)
  async loginWithFacebook() {
    try {
      // This would use react-native-fbsdk-next
      // For now, returning a placeholder structure
      throw new Error('Facebook login not implemented yet. Please configure react-native-fbsdk-next.');
    } catch (error: any) {
      throw new Error(error.message || 'Facebook sign-in failed');
    }
  }

  // Apple OAuth (placeholder - requires @invertase/react-native-apple-authentication)
  async loginWithApple() {
    try {
      // Apple Sign In implementation
      // This would use @invertase/react-native-apple-authentication
      throw new Error('Apple login not implemented yet. Please configure Apple Sign In.');
    } catch (error: any) {
      throw new Error(error.message || 'Apple sign-in failed');
    }
  }

  async logout() {
    try {
      await ApiService.logout();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}

export default new AuthService();
