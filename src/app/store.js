import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
     employee: employeeReducer,
  },
});

export default store;
