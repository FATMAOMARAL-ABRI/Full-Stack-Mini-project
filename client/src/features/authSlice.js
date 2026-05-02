// features/authSlice.js
// Handles user authentication state: login, logout, and user info (id, name, role)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ── Async thunk: sends login credentials to backend ──
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3001/api/user/login", {
        email,
        password,
      });
      const { user, message } = response.data;
      return { user, message };
    } catch (error) {
      // Pass server error message to rejected action
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    userName: null,
    role: null,      // "admin" | "customer"
    error: null,
    isLoading: false,
  },
  reducers: {
    // ── Logout: wipe all user info from state ──
    logout: (state) => {
      state.userId   = null;
      state.userName = null;
      state.role     = null;
      state.error    = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // While the request is in-flight
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      // On success: populate user info
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId    = action.payload.user._id;
        state.userName  = action.payload.user.userName;
        state.role      = action.payload.user.role;
        state.error     = null;
      })
      // On failure: clear user info and store error
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.userId    = null;
        state.userName  = null;
        state.role      = null;
        state.error     = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
