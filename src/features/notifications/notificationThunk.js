import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:3000/api/notifications";



export const fetchNotifications = createAsyncThunk(

  "notification/fetchNotifications",

  async (_, { rejectWithValue }) => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        return rejectWithValue(
          "Authentication token not found"
        );

      }

      const response =
        await axios.get(
          API_URL,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            withCredentials: true,
          }
        );

      return response.data.data || [];

    } catch (error) {

      console.error(
        "Fetch notifications error:",
        error.response?.data ||
          error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadNotifications =
  createAsyncThunk(

    "notification/fetchUnread",

    async (_, { rejectWithValue }) => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            `${API_URL}/unread`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              withCredentials: true,
            }
          );

        return response.data.data || [];

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch unread notifications"
        );
      }
    }
  );

export const markNotificationAsRead =
  createAsyncThunk(

    "notification/markAsRead",

    async (
      notificationId,
      { rejectWithValue }
    ) => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.patch(

            `${API_URL}/${notificationId}/read`,

            {},

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              withCredentials: true,
            }
          );

        return {
          notificationId,
          ...response.data,
        };

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to mark notification as read"
        );
      }
    }
  );

export const markAllNotificationsAsRead =
  createAsyncThunk(

    "notification/markAllAsRead",

    async (_, { rejectWithValue }) => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.patch(

            `${API_URL}/read-all`,

            {},

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              withCredentials: true,
            }
          );

        return response.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to mark notifications as read"
        );
      }
    }
  );