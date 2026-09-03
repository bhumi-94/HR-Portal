import { createSlice } from "@reduxjs/toolkit";

import { getHolidays } from "../../features/holiday/holidayThunk";

const initialState = {
    holidays : [] ,
    error : null ,
    message : null
}

const holidaySlice = createSlice({
    name : "holiday",

    initialState ,
    reducers : {
    },


    extraReducers: (builder) => {
        builder

        .addCase( getHolidays.fulfilled , (state,action) => {
            state.holidays = action.payload || [];
        })

        .addCase( getHolidays.rejected , (state, action) => {
            state.error = action.payload || "Unable to fetch holidays";
        })
    }

})

export default holidaySlice.reducer