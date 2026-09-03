import { createSlice } from "@reduxjs/toolkit";

import { submitFeedback, fetchMyFeedback } from "./feedbackThunk";

const initialState = {
  feedback: [],
  loading: false,
  error: null,
  success: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedbackStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.data) {
          state.feedback.unshift(action.payload.data);
        }
      })

      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchMyFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload;
      })
      .addCase(fetchMyFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeedbackStatus } = feedbackSlice.actions;

export default feedbackSlice.reducer;
