import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';
import ApiService from '../../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'coach';
  avatar?: string;
  phone?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  refreshToken: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await ApiService.login(credentials.email, credentials.password);
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      if (data.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: { name: string; email: string; password: string; role?: 'student' | 'coach' },
    { rejectWithValue }
  ) => {
    try {
      const data = await ApiService.register(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      if (data.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await ApiService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER,
  ]);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User; refreshToken?: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { setCredentials, setLoading, updateUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
