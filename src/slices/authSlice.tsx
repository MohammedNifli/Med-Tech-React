// src/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Check for existing tokens in localStorage
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const isBlocked = localStorage.getItem('isBlocked') === 'true'; // Retrieve isBlocked from localStorage

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  
}
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;  // user is nullable (can be null)
  isBlocked: boolean; // Track if the user is blocked
}

const initialState: AuthState = {
  accessToken: accessToken ? accessToken : null,
  refreshToken: refreshToken ? refreshToken : null,
  isAuthenticated: !!accessToken,
  user: JSON.parse(localStorage.getItem('userData') || 'null'),
  isBlocked: isBlocked || false, // Ensure this is a boolean
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; userData: User; isBlocked: boolean }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isBlocked = action.payload.isBlocked; // Update isBlocked state from action
      state.user = action.payload.userData;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('userData', JSON.stringify(action.payload.userData));
      localStorage.setItem('isBlocked', String(action.payload.isBlocked)); // Store isBlocked in localStorage
      localStorage.setItem('role','user')
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;  // Clear user data
      // Note: We do NOT reset isBlocked here, so it remains as it is
      
      // Remove tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('role')
    },
    // Action to update isBlocked state when admin blocks/unblocks user
    setBlockedState: (state, action: PayloadAction<boolean>) => {
      state.isBlocked = action.payload;
      localStorage.setItem('isBlocked', String(action.payload)); // Ensure it's stored as a string
  },
  
  },
});

export const { setTokens, logout, setBlockedState } = authSlice.actions; // Export setBlockedState action
export default authSlice.reducer;
