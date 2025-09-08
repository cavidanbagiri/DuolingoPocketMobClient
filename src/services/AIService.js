

import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.withCredentials = true;

// import $api from '../http';
import $api from '../http/api.js'

// Export the async thunk directly, not inside a class
export const generateAIWord = createAsyncThunk(
  'ai/generateAIWord',
  async (data, thunkAPI) => {
    try {
      const response = await $api.post('/words/generateaiword', data);
      return response.data; // Return just the data, not the whole response object
    } catch (error) {
      const errorData = error.response?.data || { message: error.message };
      return thunkAPI.rejectWithValue(errorData); // Return just the error data
    }
  }
);

class AIService {

    // static generateAIWord = createAsyncThunk(
    //     '/words/generateaiword',
    //     async (data, thunkAPI) => {
    //         try {
    //             const response = await $api.post('/words/generateaiword', data);
    //             // return {
    //             //     payload: response.data,
    //             //     status: response.status,
    //             // };
    //             console.log('coming data is ', response.data);
    //             return response.data;
    //         } catch (error) {
    //             // Extract error details
    //             const errorData = error.response?.data || { message: error.message };
    //             const statusCode = error.response?.status || 500;

    //             // Pass custom error payload
    //             return thunkAPI.rejectWithValue({
    //                 payload: errorData,
    //                 status: statusCode,
    //             });
    //         }
    //     });

}

// export default AIService;

// export { generateAIWord }; // Export the thunk