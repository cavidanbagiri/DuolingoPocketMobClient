

import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.withCredentials = true;

// import $api from '../http';
import $api from '../http/api.js'

class AuthService {

    static register = createAsyncThunk(
        '/auth/register',
        async (credentials, thunkAPI) => {
            try {
                // const response = await $api.post('/auth/register', credentials);
                const response = await axios.post('http://10.0.2.2:8000/api/auth/register', credentials);
                console.log('response is {}', response);
                
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

    static login = createAsyncThunk(
        '/auth/login',
        async (credentials, thunkAPI) => {
            try {
                const response = await $api.post('http://10.0.2.2:8000/api/auth/login', credentials);
                // Return data on success
                console.log('response is {}', response.data);
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

    static refresh = createAsyncThunk(
        '/auth/refresh',
        async () => {
            try{
                const response = await $api.post('/auth/refresh');
                return {
                    payload: response.data,
                    status: response.status,
                };
            }
            catch (error) {
                const errorData = error.response?.data || { message: error.message };
                const statusCode = error.response?.status || 500;

                // Pass custom error payload
                return thunkAPI.rejectWithValue({
                    payload: errorData,
                    status: statusCode,
                });
            }
        }
    )

    static userLogout = createAsyncThunk(
       'http://10.0.2.2:8000/api/auth/logout',
       async ()=>{
        try{
            console.log('here work')
            const response = await $api.post('http://10.0.2.2:8000/api/auth/logout');
            console.log('0-000000000000000000000000000')
            console.log('response is {}', response.data);
            console.log('0-000000000000000000000000000')
            return {
                payload: response.data,
                status: response.status,
            };
        }
        catch (error) {
            const errorData = error.response?.data || { message: error.message };
            const statusCode = error.response?.status || 500;
            // Pass custom error payload
            return thunkAPI.rejectWithValue({
                payload: errorData,
                status: statusCode,
            });
        }
        
       }
   )

}

export default AuthService;
