import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAttendance,
  tapIn,
  tapOut,
  fetchEmployeeHistory,
} from "../../features/attendance/attendanceThunk";

const initialState = {
  attendance: [],

  loading: false,
  error: null,
  message: null,

  // Employee History
  history: [],
  historyLoading: false,
  historyError: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH ATTENDANCE
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload || [];
      })

      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch attendance";
      });

    // TAP IN
    builder
      .addCase(tapIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(tapIn.fulfilled, (state, action) => {
        state.loading = false;

        state.message =
          action.payload?.message || "Successfully tapped in";
      })

      .addCase(tapIn.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Tap In failed";
      });

    // TAP OUT
    builder
      .addCase(tapOut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(tapOut.fulfilled, (state, action) => {
        state.loading = false;

        state.message =
          action.payload?.message || "Successfully tapped out";
      })
      
      .addCase(tapOut.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Tap Out failed";
      });

    // EMPLOYEE HISTORY
    builder
      .addCase(fetchEmployeeHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })

      .addCase(fetchEmployeeHistory.fulfilled, (state, action) => {
        state.historyLoading = false;

        state.history = action.payload || [];
      })

      .addCase(fetchEmployeeHistory.rejected, (state, action) => {
        state.historyLoading = false;

        state.historyError =
          action.payload || "Unable to fetch employee history";
      });
  },
});

export const {
  clearAttendanceMessage,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;