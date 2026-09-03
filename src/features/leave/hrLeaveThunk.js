import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
export const fetchAllLeaveRequests = createAsyncThunk(
  "hrLeave/fetchAllRequests",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await apiClient.get("/leave/all");

      console.log("ALL LEAVE REQUESTS:", response.data);

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Fetch all leave requests error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave requests",
      );
    }
  },
);

export const approveLeaveRequest = createAsyncThunk(
  "hrLeave/approveLeaveRequest",

  async (leaveId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      if (!leaveId) {
        return rejectWithValue("Leave ID is missing");
      }

      console.log("APPROVING LEAVE ID:", leaveId);

      const response = await apiClient.put(`/leave/${leaveId}/approve`, {});

      console.log("APPROVE RESPONSE:", response.data);

      return {
        leaveId,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "Approve leave error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to approve leave",
      );
    }
  },
);

export const rejectLeaveRequest = createAsyncThunk(
  "hrLeave/rejectLeaveRequest",

  async (leaveId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      if (!leaveId) {
        return rejectWithValue("Leave ID is missing");
      }

      console.log("REJECTING LEAVE ID:", leaveId);

      const response = await apiClient.put(`/leave/${leaveId}/reject`, {});

      console.log("REJECT RESPONSE:", response.data);

      return {
        leaveId,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "Reject leave error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to reject leave",
      );
    }
  },
);
