import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "./hrLeaveThunk";

const initialState = {
  requests: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  actionSuccess: false,
};

const hrLeaveSlice = createSlice({
  name: "hrLeave",

  initialState,

  reducers: {
    clearHrLeaveMessages: (state) => {
      state.error = null;
      state.actionError = null;
      state.actionSuccess = false;
    },
  },

  extraReducers: (builder) => {
    // GET ALL REQUESTS

    builder
      .addCase(fetchAllLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;

        state.requests = action.payload || [];
      })

      .addCase(fetchAllLeaveRequests.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    // APPROVE
    builder
      .addCase(approveLeaveRequest.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(approveLeaveRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        const leaveId = action.payload.leaveId;

        const request = state.requests.find((item) => item.id === leaveId);

        if (request) {
          request.status = "Approved";
        }
      })

      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.actionLoading = false;

        state.actionError = action.payload;
      });

    // REJECT

    builder
      .addCase(rejectLeaveRequest.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })

      .addCase(rejectLeaveRequest.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        const leaveId = action.payload.leaveId;

        const request = state.requests.find((item) => item.id === leaveId);

        if (request) {
          request.status = "Rejected";
        }
      })

      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.actionLoading = false;

        state.actionError = action.payload;
      });
  },
});

export const { clearHrLeaveMessages } = hrLeaveSlice.actions;

export default hrLeaveSlice.reducer;
