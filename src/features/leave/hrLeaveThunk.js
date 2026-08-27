import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/leave";


// GET ALL LEAVE REQUESTS - HR

export const fetchAllLeaveRequests = createAsyncThunk(
  "hrLeave/fetchAllRequests",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

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
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch leave requests"
      );
    }
  }
);

// APPROVE LEAVE

export const approveLeaveRequest = createAsyncThunk(
  "/approve",

  async (leaveId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${leaveId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return {
        leaveId,
        ...response.data,
      };

    } catch (error) {
      console.error(
        "Approve leave error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to approve leave"
      );
    }
  }
);

// REJECT LEAVE
export const rejectLeaveRequest = createAsyncThunk(
  "/reject",

  async (leaveId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${leaveId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return {
        leaveId,
        ...response.data,
      };

    } catch (error) {
      console.error(
        "Reject leave error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to reject leave"
      );
    }
  }
);