

import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.withCredentials = true;

// import $api from '../http';
import $api from '../http/api.js'

class AIService {

    static generateAIWordThunk = createAsyncThunk(
        '/words/generateaiword',
        async (data, thunkAPI) => {
            try {
                const response = await $api.post('/words/generateaiword', data);
                
                return response.data;
            } catch (error) {
                // Extract error details
                const errorData = error.response?.data || { message: error.message };
                const statusCode = error.response?.status || 500;

                // Pass custom error payload
                return thunkAPI.rejectWithValue({
                    payload: errorData,
                    status: statusCode,
                });
            }
        });


    // Keep your original method for backward compatibility
    static generateAIWord = (data) => {
        return this.generateAIWordThunk(data);
    };

}


export default AIService;

// Export the thunk directly for use in slices
// export const { generateAIWordThunk } = AIService;

export const generateAIWordThunk = AIService.generateAIWordThunk; // ✅

