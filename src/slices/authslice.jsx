import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    setAuth(state, action) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      localStorage.setItem('userId', state.userId);
      localStorage.setItem('token', state.token);
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
