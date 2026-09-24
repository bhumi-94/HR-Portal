import { createSlice } from "@reduxjs/toolkit";
const storedToken =
  localStorage.getItem("token") || sessionStorage.getItem("token");

const storedUser =
  localStorage.getItem("user") || sessionStorage.getItem("user");

let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
