import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiService from '../../services/api';

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  type: 'individual' | 'group';
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  location?: string;
  notes?: string;
}

interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  selectedSession: null,
  isLoading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'sessions/fetch',
  async (params?: { type?: string; status?: string }) => {
    const data = await ApiService.getSessions(params);
    return data.sessions || data;
  }
);

export const fetchSessionById = createAsyncThunk(
  'sessions/fetchById',
  async (sessionId: string) => {
    const data = await ApiService.getSessionById(sessionId);
    return data;
  }
);

export const createSession = createAsyncThunk(
  'sessions/create',
  async (sessionData: {
    mentorId: string;
    type: 'individual' | 'group';
    date: string;
    time: string;
    duration?: number;
    maxParticipants?: number;
  }) => {
    const data = await ApiService.createSession(sessionData);
    return data;
  }
);

export const joinSession = createAsyncThunk(
  'sessions/join',
  async (sessionId: string) => {
    const data = await ApiService.joinSession(sessionId);
    return { sessionId, data };
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSelectedSession: (state, action: PayloadAction<Session | null>) => {
      state.selectedSession = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.selectedSession = action.payload;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
      })
      .addCase(joinSession.fulfilled, (state, action) => {
        const session = state.sessions.find((s) => s.id === action.payload.sessionId);
        if (session) {
          session.status = 'confirmed';
          if (session.currentParticipants !== undefined) {
            session.currentParticipants += 1;
          }
        }
      });
  },
});

export const { setSelectedSession, clearError } = sessionSlice.actions;
export default sessionSlice.reducer;
