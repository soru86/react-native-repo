import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiService from '../../services/api';
import { updateUser } from './authSlice';
import { AppDispatch } from '../index';

export interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  rating?: number;
  totalSessions?: number;
  price?: number;
}

interface UserState {
  mentors: Mentor[];
  selectedMentor: Mentor | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  mentors: [],
  selectedMentor: null,
  isLoading: false,
  error: null,
};

export const fetchMentors = createAsyncThunk(
  'users/fetchMentors',
  async (params?: { search?: string; specialty?: string }) => {
    const data = await ApiService.getMentors(params);
    return data.mentors || data;
  }
);

export const fetchMentorById = createAsyncThunk(
  'users/fetchMentorById',
  async (mentorId: string) => {
    const data = await ApiService.getMentorById(mentorId);
    return data;
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData: any, { dispatch }) => {
    const data = await ApiService.updateUserProfile(profileData);
    dispatch(updateUser(data.user));
    return data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedMentor: (state, action: PayloadAction<Mentor | null>) => {
      state.selectedMentor = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mentors = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch mentors';
      })
      .addCase(fetchMentorById.fulfilled, (state, action) => {
        state.selectedMentor = action.payload;
      });
  },
});

export const { setSelectedMentor, clearError } = userSlice.actions;
export default userSlice.reducer;
