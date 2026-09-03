import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "../features/employee/employeeSlice";
import attendanceReducer
  from "../features/attendance/attendanceSlice";
import leaveReducer 
  from "../features/leave/leaveSlice";
import hrLeaveReducer from "../features/leave/hrLeaveSlice"
import holidayReducer from "../features/holiday/holidaySlice"
import notificationReducer
  from "../features/notifications/notificationSlice";
import feedbackReducer from "../features/feedback/feedbackSlice"


const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    
    hrLeave: hrLeaveReducer,
    holiday : holidayReducer,
    notification: notificationReducer,
    feedback : feedbackReducer,

  },
});

export default store;
