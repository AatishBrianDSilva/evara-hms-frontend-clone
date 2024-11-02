// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { EUserRole } from '../../types/masterDashboard/global';

interface AuthTokens {
  authToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp of when the authToken expires
}

interface DecodedToken {
  exp: number; // Expiration time in seconds since the Unix epoch
  sub: string; // Subject (usually the user ID)
  role: EUserRole; // User's role
  username: string; // User's username
  clinicId: string; // Clinic ID
  branchId: string; // Branch ID
}

interface User {
  id: string;
  username: string;
  role: EUserRole;
  clinicId: string;
  branchId: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  tokens: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ authToken: string; refreshToken: string }>,
    ) => {
      const { authToken, refreshToken } = action.payload;
      const decoded: DecodedToken = jwtDecode(authToken);
      state.tokens = {
        authToken,
        refreshToken,
        expiresAt: decoded.exp * 1000, // Convert to milliseconds
      };
      state.user = {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        clinicId: decoded.clinicId,
        branchId: decoded.branchId,
      };
      state.isAuthenticated = true;
    },
    clearCredentials: state => {
      state.tokens = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
