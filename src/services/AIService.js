

import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.withCredentials = true;

// import $api from '../http';
import $api from '../http/api.js'

class AIService {

    static generateAIWord = createAsyncThunk(
        '/words/generateaiword',
        async (data, thunkAPI) => {
            try {
                const response = await $api.post('/words/generateaiword', data);
                console.log('coming response is ', response.data);
                return {
                    payload: response.data,
                    status: response.status,
                };
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

}

export default AIService;