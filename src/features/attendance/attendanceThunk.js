import { createAsyncThunk } from "@reduxjs/toolkit";

import apiClient from "../../api/apiClient";

// =====================================================
// FETCH MY ATTENDANCE
// =====================================================

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await apiClient.get(
        "/attendance/get-my-attendance"
      );

      return response.data.attendance || [];
    } catch (error) {
      console.log(
        "FETCH ATTENDANCE ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Attendance fetch failed"
      );
    }
  }
);

// =====================================================
// TAP IN
// =====================================================

export const tapIn = createAsyncThunk(
  "attendance/tapIn",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await apiClient.post(
        "/attendance/tap-in",
        {}
      );

      return response.data;
    } catch (error) {
      console.log(
        "TAP IN ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Tap In failed"
      );
    }
  }
);

// =====================================================
// TAP OUT
// =====================================================

export const tapOut = createAsyncThunk(
  "attendance/tapOut",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await apiClient.post(
        "/attendance/tap-out",
        {}
      );

      return response.data;
    } catch (error) {
      console.log(
        "TAP OUT ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Tap Out failed"
      );
    }
  }
);

// =====================================================
// FETCH EMPLOYEE HISTORY
// =====================================================

export const fetchEmployeeHistory = createAsyncThunk(
  "attendance/fetchEmployeeHistory",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue(
          "No token found. Please login again."
        );
      }

      const response = await apiClient.get(
        "/attendance/employee-history"
      );

      return response.data.history || [];
    } catch (error) {
      console.log(
        "FETCH EMPLOYEE HISTORY ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch employee history"
      );
    }
  }
);