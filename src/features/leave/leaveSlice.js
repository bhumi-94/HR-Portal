import { createSlice } from "@reduxjs/toolkit";

import {
  getLeaveSummary,
  requestLeave,
  getMyLeaves,
} from "./leaveThunk";

const initialState = {
  summary: {
    casual: {
      total: 0,
      pending: 0,
    },

    sick: {
      total: 0,
      pending: 0,
    },

    wfh: {
      total: 0,
      pending: 0,
    },
  },

  leaves: [],
  loading: false,
  submitting: false,
  error: null,
  success: false,
  message: "",
};


const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },
    clearLeaveSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    resetLeaveState: (state) => {
      state.submitting = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },


  extraReducers: (builder) => {

    // GET SUMMARY

    builder
      .addCase(
        getLeaveSummary.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getLeaveSummary.fulfilled,
        (state, action) => {
          state.loading = false;
          state.summary =
            action.payload.data;
        }
      )
      .addCase(
        getLeaveSummary.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );


    // REQUEST LEAVE

    builder
      .addCase(
        requestLeave.pending,
        (state) => {
          state.submitting = true;
          state.error = null;
          state.success = false;
        }
      )
      .addCase(
        requestLeave.fulfilled,
        (state, action) => {
          state.submitting = false;
          state.success = true;
          state.message =
            action.payload.message;
        }
      )
      .addCase(
        requestLeave.rejected,
        (state, action) => {
          state.submitting = false;
          state.success = false;
          state.error =
            action.payload;
        }
      );

    // GET MY LEAVES

    builder
      .addCase(
        getMyLeaves.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getMyLeaves.fulfilled,
        (state, action) => {
          state.loading = false;
          state.leaves =
            action.payload.data;
        }
      )

      .addCase(
        getMyLeaves.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );
  },
});


export const {
  clearLeaveError,
  clearLeaveSuccess,
  resetLeaveState,
} = leaveSlice.actions;


export default leaveSlice.reducer;