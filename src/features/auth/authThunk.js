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
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const result = response.data;

      console.log("LOGIN RESPONSE:", result);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      if (formData.rememberMe === true) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      else {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("user", JSON.stringify(result.user));
      }

      dispatch(setUser(result));

      return result;
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed",
      );
    }
  },
);
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ credential, rememberMe }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", {
        credential,
      });

      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      dispatch(
        setUser({
          token,
          user,
        }),
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed",
      );
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
