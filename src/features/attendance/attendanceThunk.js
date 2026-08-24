import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/attendance";

// GET MY ATTENDANCE

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await axios.get(
        `${API_URL}/get-my-attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

// TAP IN

export const tapIn = createAsyncThunk(
  "attendance/tapIn",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await axios.post(
        `${API_URL}/tap-in`,
        {}, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

// TAP OUT

export const tapOut = createAsyncThunk(
  "attendance/tapOut",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // Check token before sending request
      if (!token) {
        return rejectWithValue("No token found. Please login again.");
      }

      const response = await axios.post(
        `${API_URL}/tap-out`,
        {}, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

// Fetch employee history 

export const fetchEmployeeHistory = createAsyncThunk(
  "attendance/fetchEmployeeHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue(
          "No token found. Please login again."
        );
      }

      const response = await axios.get(
        `${API_URL}/employee-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.history;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee history"
      );
    }
  }
);