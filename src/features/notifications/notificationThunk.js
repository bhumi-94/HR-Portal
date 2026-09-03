import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await apiClient.get(
        "/notifications"
      );

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notifications"
      );
    }
  }
);
export const fetchUnreadNotifications = createAsyncThunk(
  "notification/fetchUnread",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await apiClient.get(
        "/notifications/unread"
      );

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Fetch unread notifications error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch unread notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",

  async (notificationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await apiClient.patch(
        `/notifications/${notificationId}/read`,
        {}
      );

      return {
        notificationId,
        ...response.data,
      };
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await apiClient.patch(
        "/notifications/read-all",
        {}
      );

      return response.data;
    } catch (error) {
      console.error(
        "Mark all notifications as read error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark notifications as read"
      );
    }
  }
);