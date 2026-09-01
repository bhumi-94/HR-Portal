import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/leave";

export const fetchAllLeaveRequests = createAsyncThunk(
  "hrLeave/fetchAllRequests",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

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

  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      if (!id) {
        return rejectWithValue("id is missing");
      }
      // console.log("APPROVING LEAVE ID:", leaveId);
      const response = await axios.put(
        `${API_URL}/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        },
      );

      console.log("APPROVE RESPONSE:", response.data);

      return {
        id,
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

      const response = await axios.put(
        `${API_URL}/${leaveId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        },
      );

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
