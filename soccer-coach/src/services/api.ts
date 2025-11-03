import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token and log requests
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development
        if (__DEV__) {
          console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and log errors
    this.api.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Log error details
        if (__DEV__) {
          console.error('❌ API Error:', {
            message: error.message,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          });
          
          // Network error (connection failed)
          if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
            console.error('🔴 Connection Failed - Check if server is running and API_BASE_URL is correct');
            console.error(`   Current API URL: ${API_BASE_URL}`);
            console.error('   For physical devices, ensure you use your machine\'s IP address, not localhost');
          }
        }
        
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { token, refreshToken: newRefreshToken } = response.data;
              await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
              if (newRefreshToken) {
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              }

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear storage and redirect to login
            await AsyncStorage.multiRemove([
              STORAGE_KEYS.TOKEN,
              STORAGE_KEYS.REFRESH_TOKEN,
              STORAGE_KEYS.USER,
            ]);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'coach';
  }) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async socialLogin(provider: string, token: string, userInfo?: any) {
    const response = await this.api.post('/auth/social', {
      provider,
      token,
      userInfo,
    });
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
    return response.data;
  }

  // User endpoints
  async getUserProfile() {
    const response = await this.api.get('/user/profile');
    return response.data;
  }

  async updateUserProfile(data: any) {
    const response = await this.api.put('/user/profile', data);
    return response.data;
  }

  // Mentor endpoints
  async getMentors(params?: { search?: string; specialty?: string }) {
    const response = await this.api.get('/mentors', { params });
    return response.data;
  }

  async getMentorById(id: string) {
    const response = await this.api.get(`/mentors/${id}`);
    return response.data;
  }

  // Session endpoints
  async getSessions(params?: { type?: string; status?: string }) {
    const response = await this.api.get('/sessions', { params });
    return response.data;
  }

  async getSessionById(id: string) {
    const response = await this.api.get(`/sessions/${id}`);
    return response.data;
  }

  async createSession(data: {
    mentorId: string;
    type: 'individual' | 'group';
    date: string;
    time: string;
    duration?: number;
    maxParticipants?: number;
  }) {
    const response = await this.api.post('/sessions', data);
    return response.data;
  }

  async joinSession(sessionId: string) {
    const response = await this.api.post(`/sessions/${sessionId}/join`);
    return response.data;
  }

  async cancelSession(sessionId: string) {
    const response = await this.api.post(`/sessions/${sessionId}/cancel`);
    return response.data;
  }

  // Video endpoints
  async uploadVideo(videoUri: string, sessionId?: string) {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    } as any);
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    const response = await this.api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getVideoFeedback(videoId: string) {
    const response = await this.api.get(`/videos/${videoId}/feedback`);
    return response.data;
  }

  async getVideos(params?: { sessionId?: string }) {
    const response = await this.api.get('/videos', { params });
    return response.data;
  }

  // Payment endpoints
  async createPayment(data: {
    sessionId: string;
    amount: number;
    currency?: string;
  }) {
    const response = await this.api.post('/payments', data);
    return response.data;
  }

  async getPaymentStatus(paymentId: string) {
    const response = await this.api.get(`/payments/${paymentId}`);
    return response.data;
  }

  // Coach endpoints
  async getCoachDashboard() {
    const response = await this.api.get('/coach/dashboard');
    return response.data;
  }

  async getCoachUsers(params?: { search?: string; role?: string }) {
    const response = await this.api.get('/coach/users', { params });
    return response.data;
  }

  async updateCoachProfile(data: any) {
    const response = await this.api.put('/coach/profile', data);
    return response.data;
  }

  async provideFeedback(videoId: string, feedback: {
    comments: string;
    rating?: number;
    improvements?: string[];
  }) {
    const response = await this.api.post(`/videos/${videoId}/feedback`, feedback);
    return response.data;
  }
}

export default new ApiService();
