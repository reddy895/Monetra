import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../types';

const storedToken = localStorage.getItem('fp_access_token');
const storedRefreshToken = localStorage.getItem('fp_refresh_token');
const storedUser = localStorage.getItem('fp_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
  isAuthenticated: !!storedToken,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('fp_refresh_token', refreshToken);
      }
      localStorage.setItem('fp_access_token', accessToken);
      localStorage.setItem('fp_user', JSON.stringify(user));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('fp_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('fp_access_token');
      localStorage.removeItem('fp_refresh_token');
      localStorage.removeItem('fp_user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
