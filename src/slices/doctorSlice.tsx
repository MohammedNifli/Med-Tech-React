import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorInfo {
  docId: string;
  name: string;
  email: string;
  specialization: string;
}

interface DoctorAuthState {
  isAuthenticated: boolean;
  doctorInfo: DoctorInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isBlocked: boolean;
}

// Initial state (checking localStorage for persistent login)
const initialState: DoctorAuthState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  doctorInfo: localStorage.getItem('doctorInfo') 
    ? JSON.parse(localStorage.getItem('doctorInfo')!) 
    : null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isBlocked: localStorage.getItem('isBlocked') === 'true', // Convert stored string to boolean
};

const doctorAuthSlice = createSlice({
  name: 'doctorAuth',
  initialState,
  reducers: {
    // Action for successful login
    loginDoctorSuccess: (
      state,
      action: PayloadAction<{ doctorInfo: DoctorInfo; accessToken: string; refreshToken: string; isBlocked: boolean }>
    ) => {
      state.isAuthenticated = true;
      state.doctorInfo = action.payload.doctorInfo;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isBlocked = action.payload.isBlocked;

      // Save to localStorage
      localStorage.setItem('doctorInfo', JSON.stringify(action.payload.doctorInfo));
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('isBlocked', String(action.payload.isBlocked));
      localStorage.setItem('role','doctor')
    },
    // Logout action
    logoutDoctor: (state) => {
      state.isAuthenticated = false;
      state.doctorInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
  

      // Remove from localStorage
      localStorage.removeItem('doctorInfo');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
     localStorage.removeItem('role')
    },
    // Action to manually set blocked state
    setDoctorBlockedState: (state, action: PayloadAction<boolean>) => {
      state.isBlocked = action.payload;
      localStorage.setItem('isBlocked', String(action.payload));
    }
  },
});

export const { loginDoctorSuccess, logoutDoctor, setDoctorBlockedState } = doctorAuthSlice.actions;
export default doctorAuthSlice.reducer;
