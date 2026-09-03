import { createAsyncThunk } from "@reduxjs/toolkit";

import apiClient from "../../api/apiClient";

// =====================================================
// GET ALL HOLIDAYS
// =====================================================

export const getHolidays = createAsyncThunk(
  "holiday/getHolidays",

  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/holidays/get-holidays"
      );

      return response.data.holidays;
    } catch (error) {
      console.log(
        "GET HOLIDAYS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to Fetch Holidays"
      );
    }
  }
);