import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/feedback";

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/submit`, feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Submit feedback error:", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to submit feedback",
      );
    }
  },
);

export const fetchMyFeedback = createAsyncThunk(
  "feedback/fetchMyFeedback",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedback",
      );
    }
  },
);
