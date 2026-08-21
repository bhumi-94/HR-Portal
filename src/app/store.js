import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";
import attendanceReducer
  from "../features/attendance/attendanceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
  },
});

export default store;
