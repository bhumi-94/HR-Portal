import { createAsyncThunk } from "@reduxjs/toolkit";

import apiClient from "../../api/apiClient";

export const fetchLeaveSummary = createAsyncThunk(
  "leave/fetchSummary",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }
      const response = await apiClient.get("/leave/summary");

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

export const fetchMyLeaveRequests = createAsyncThunk(
  "leave/fetchMyRequests",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await apiClient.get("/leave/my");

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

export const requestLeave = createAsyncThunk(
  "leave/request",

  async (leaveData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await apiClient.post("/leave/request", leaveData);

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

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await apiClient.get("/leave/getLeaveHistory");

      console.log("LEAVE HISTORY:", response.data.data);

      return response.data.data;
    } catch (error) {
      console.error(
        "Leave history error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave history",
      );
    }
  },
);
