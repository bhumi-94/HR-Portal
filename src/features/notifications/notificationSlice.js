import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notificationThunk";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload;

        state.unreadCount = action.payload.filter(
          (notification) => notification.is_read === 0,
        ).length;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

    builder.addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
      state.unreadCount = action.payload.length;
    });

    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find(
        (item) => item.id === action.payload.notificationId,
      );

      if (notification && notification.is_read === 0) {
        notification.is_read = 1;

        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        is_read: 1,
      }));

      state.unreadCount = 0;
    });
  },
});

export default notificationSlice.reducer;
