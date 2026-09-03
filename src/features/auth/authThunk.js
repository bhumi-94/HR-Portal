import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { setUser } from "./authSlice";

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", formData);

      return response.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", formData);

      dispatch(setUser(response.data));

      const token = response.data.token;

      localStorage.setItem("token", token);

      return response.data;
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data);

      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",

  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      return response.data;
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link",
      );
    }
  },
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",

  async ({ token, password }, { rejectWithValue }) => {
    try {
      console.log("Sending token:", token);

      const response = await apiClient.post("/auth/reset-password", {
        token,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("RESET API ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);
