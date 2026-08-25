import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";
import attendanceReducer
  from "../features/attendance/attendanceSlice";
import leaveReducer 
  from "../features/leave/leaveSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
  },
});

export default store;
