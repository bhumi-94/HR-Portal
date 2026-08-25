import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/leave";

// GET LEAVE SUMMARY
export const getLeaveSummary = createAsyncThunk(
  "/getSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/summary`,
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch leave summary"
      );
    }
  }
);



export const requestLeave = createAsyncThunk(
  "/request",
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/request`,
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {
      console.error("Leave request error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to submit leave request"
      );
    }
  }
);
// GET MY LEAVES

export const getMyLeaves = createAsyncThunk(
  "/getMyLeaves",
  async (_, { rejectWithValue }) => {

    try {

      const response = await axios.get(
        `${API_URL}/my-leaves`,
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch leave requests"
      );
    }
  }
);