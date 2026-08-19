import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUser } from "./authSlice";
const API_URL = "http://localhost:3000/api/auth";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      dispatch(setUser(response.data));
      const token = response.data.token;
      localStorage.setItem("token", token);
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
  
);


// FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link",
      );
    }
  },
);
// RESET PASSWORD
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      console.log("Sending token:", token);
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Reset API error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);
