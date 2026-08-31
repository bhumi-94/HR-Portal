import { createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios"

const API_URL = "http://localhost:3000/api/holidays"

// Get All Holidays 

export const getHolidays = createAsyncThunk(
    "holiday/getHolidays" ,

    async(_ , { rejectWithValue }) => {
        try{

            const response =  await axios.get(
                `${API_URL}/get-holidays`
            )

            return response.data.holidays;
        }catch(error){
            console.log(error)

            return rejectWithValue(
                error.response?.data?.message || "Failed to Fetch Holidays"
            )

        }
    }
)