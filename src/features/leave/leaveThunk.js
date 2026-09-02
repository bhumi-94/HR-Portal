import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/leave";

// GET LEAVE SUMMARY

export const fetchLeaveSummary = createAsyncThunk(
  "leave/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(`${API_URL}/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data.data;
    } catch (error) {
      console.error("Fetch leave summary error:", error);

      if (error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch leave summary",
        );
      }

      return rejectWithValue(
        "Unable to connect to server. Please check your backend.",
      );
    }
  },
);

// GET MY LEAVE REQUESTS

export const fetchMyLeaveRequests = createAsyncThunk(
  "leave/fetchMyRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Fetch my leave requests error:", error);

      if (error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch leave requests",
        );
      }

      return rejectWithValue(
        "Unable to connect to server. Please check your backend.",
      );
    }
  },
);

// REQUEST LEAVE
export const requestLeave = createAsyncThunk(
  "leave/request",
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.post(`${API_URL}/request`, leaveData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Request leave error:", error);
      if (error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to submit leave request",
        );
      }
      return rejectWithValue(
        "Unable to connect to server. Please check your backend.",
      );
    }
  },
);
export const getLeaveHistory = createAsyncThunk(
  "leave/getLeaveHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/getLeaveHistory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("LEAVE HISTORY:", response.data.data);

      return response.data.data;
    } catch (error) {
      console.error(
        "Leave history error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch leave history"
      );
    }
  }
);
