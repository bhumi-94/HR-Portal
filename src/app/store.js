import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";
import attendanceReducer
  from "../features/attendance/attendanceSlice";
import leaveReducer 
  from "../features/leave/leaveSlice";
import hrLeaveReducer from "../features/leave/hrLeaveSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    
    hrLeave: hrLeaveReducer
  },
});

export default store;
