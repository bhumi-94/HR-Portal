import { createSlice } from "@reduxjs/toolkit";

import {
  fetchLeaveSummary,
  fetchMyLeaveRequests,
  requestLeave,
  getLeaveHistory
} from "./leaveThunk";

const initialState = {
  summary: {
    casual: {
      allocated: 7,
      used: 0,
      pending: 0,
      remaining: 7,
    },

    sick: {
      allocated: 7,
      used: 0,
      pending: 0,
      remaining: 7,
    },

    wfh: {
      allocated: 0,
      used: 0,
      pending: 0,
      remaining: 0,
    },
  },

  history: [],
  requests: [],
  loading: false,
  requestLoading: false,
  error: null,
  requestError: null,
  requestSuccess: false,
};

const leaveSlice = createSlice({
  name: "leave",

  initialState,

  reducers: {
    clearLeaveMessages: (state) => {
      state.error = null;
      state.requestError = null;
      state.requestSuccess = false;
    },
  },

  extraReducers: (builder) => {
    // FETCH LEAVE SUMMARY

    builder
      .addCase(fetchLeaveSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLeaveSummary.fulfilled, (state, action) => {
        state.loading = false;

        state.summary = {
          casual: {
            allocated: Number(action.payload?.casual?.allocated || 7),
            used: Number(action.payload?.casual?.used || 0),
            pending: Number(action.payload?.casual?.pending || 0),
            remaining: Number(action.payload?.casual?.remaining ?? 7),
          },

          sick: {
            allocated: Number(action.payload?.sick?.allocated || 7),
            used: Number(action.payload?.sick?.used || 0),
            pending: Number(action.payload?.sick?.pending || 0),
            remaining: Number(action.payload?.sick?.remaining ?? 7),
          },

          wfh: {
            allocated: Number(action.payload?.wfh?.allocated || 0),
            used: Number(action.payload?.wfh?.used || 0),
            pending: Number(action.payload?.wfh?.pending || 0),
            remaining: Number(action.payload?.wfh?.remaining || 0),
          },
        };
      })

      .addCase(fetchLeaveSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH MY LEAVE REQUESTS

    builder
      .addCase(fetchMyLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload || [];
      })

      .addCase(fetchMyLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REQUEST LEAVE

    builder
      .addCase(requestLeave.pending, (state) => {
        state.requestLoading = true;
        state.requestError = null;
        state.requestSuccess = false;
      })

      .addCase(requestLeave.fulfilled, (state) => {
        state.requestLoading = false;
        state.requestSuccess = true;
        state.requestError = null;
      })

      .addCase(requestLeave.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestSuccess = false;
        state.requestError = action.payload;
      });

    
      builder

        // existing cases...
        .addCase(getLeaveHistory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })

        .addCase(getLeaveHistory.fulfilled, (state, action) => {
          state.loading = false;
          state.history = action.payload;
        })

        .addCase(getLeaveHistory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  
  },
});

export const { clearLeaveMessages } = leaveSlice.actions;

export default leaveSlice.reducer;
