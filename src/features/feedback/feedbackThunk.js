import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",

  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/feedback/submit",
        feedbackData
      );

      return response.data;
    } catch (error) {
      console.error(
        "Submit feedback error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to submit feedback"
      );
    }
  }
);

export const fetchMyFeedback = createAsyncThunk(
  "feedback/fetchMyFeedback",

  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/feedback/my"
      );

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Fetch feedback error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch feedback"
      );
    }
  }
);