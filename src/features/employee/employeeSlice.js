import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// GET ALL USERS
export const fetchUsers = createAsyncThunk(
  "employee/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      if (!token) {
        return rejectWithValue(
          "No token found. Please login again."
        );
      }
      const response = await axios.get(
        `${API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        "USERS API RESPONSE:",
        response.data
      );
      return response.data.users;
    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch users"
      );
    }
  }
);
// ENABLE / DISABLE USER
export const updateUserStatus = createAsyncThunk(
  "employee/updateUserStatus",
  async (
    { userId, isActive },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/users/${userId}/status`,
        {
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update user status"
      );
    }
  }
);

// INITIAL STATE

const initialState = {
  users: [],
  loading: false,
  error: null,
  updatingUserId: null,
};

// SLICE

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // GET USERS
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure users is always an array
        state.users = Array.isArray(action.payload)
          ? action.payload
          : [];
        console.log(
          "REDUX USERS:",
          state.users
        );
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // UPDATE STATUS
    builder
      .addCase(
        updateUserStatus.pending,
        (state, action) => {
          state.updatingUserId =
            action.meta.arg.userId;
        }
      )
      .addCase(
        updateUserStatus.fulfilled,
        (state, action) => {
          state.updatingUserId = null;
          const updatedUser = action.payload;
          const index =
            state.users.findIndex(
              (user) =>
                Number(user.id) ===
                Number(updatedUser.id)
            );
          if (index !== -1) {
            state.users[index] =
              updatedUser;
          }
        }
      )
      .addCase(
        updateUserStatus.rejected,
        (state, action) => {
          state.updatingUserId = null;
          state.error = action.payload;
        }
      );
  },
});


export default employeeSlice.reducer;


