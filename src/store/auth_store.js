import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import AuthService from '../services/AuthService.js';
import { clearStorage, getFromStorage, saveToStorage } from '../utils/storage';

axios.defaults.withCredentials = true;


const initialState = {
    user: {
        email: 'unknown',
        username: '',
    },
    login_message: '',
    login_pending: false,
    is_auth: false,
    is_login_error: false,
    login_success: false,
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoginPending: (state, action) => {
            state.login_pending = action.payload;
        },
        setIsAuth: (state, action) => {
            state.is_auth = action.payload;
        },
        setIsLoginErrorTrue: (state) => {
            state.is_login_error = true;
        },
        setIsLoginErrorFalse: (state) => {
            state.is_login_error = false;
        },
        setIsLoginSuccessFalse: (state) => {
            state.login_success = false;
        },
    },
    extraReducers: (builder) => {

        // Userservice register
        builder.addCase(AuthService.register.pending, (state, action) => {
            state.login_pending = true;
        })
        builder.addCase(AuthService.register.fulfilled, (state, action) => {
            state.is_auth = true;
            state.login_pending = false;
            state.user = action.payload;
            state.login_success = true;
            state.login_message = 'Successfully registered';
            // saveToStorage('token', action.payload?.payload?.access_token);
            // saveToStorage('sub', action.payload?.payload?.user?.sub);  
            // saveToStorage('username', action.payload?.payload?.user?.username); 
        });
        builder.addCase(AuthService.register.rejected, (state, action) => {
            state.login_pending = false;
            state.is_auth = false;
            state.is_login_error = true;
            state.login_message = action.payload?.payload?.detail;
        });


        // Userservice login
        builder.addCase(AuthService.login.pending, (state, action) => {
            state.login_pending = true;
        })
        builder.addCase(AuthService.login.fulfilled, (state, action) => {
            state.is_auth = true;
            state.login_pending = false;
            state.user = action.payload;
            state.login_success = true;
            state.login_message = 'Successfully logged in';
            saveToStorage('token', action.payload?.payload?.access_token);
            saveToStorage('sub', action.payload?.payload?.user?.sub);  
            saveToStorage('username', action.payload?.payload?.user?.username); 
        });
        builder.addCase(AuthService.login.rejected, (state, action) => {
            state.login_pending = false;
            state.is_auth = false;
            state.is_login_error = true;
            state.login_message = action.payload?.payload?.detail;

        });


        // Userservice refresh
        builder.addCase(AuthService.refresh.fulfilled, (state, action) => {
            state.is_auth = true;
            state.user = action.payload;
            saveToStorage('token', action.payload.payload.access_token);
            saveToStorage('sub', action.payload.payload.user.sub);
            saveToStorage('username', action.payload.payload.user.username);
        });
        builder.addCase(AuthService.refresh.rejected, (state, action) => {
            console.log('refresh second', action.payload);
        });


        // Userservice logout
        builder.addCase(AuthService.userLogout.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);
            state.is_auth = false;
            state.user = null;
            state.is_login_error = false,
            state.login_success = false,
            clearStorage()
        });

    },
});

export const { setUser, setLoginPending, setIsAuth, setIsLoginErrorTrue, setIsLoginErrorFalse, setIsLoginSuccessFalse } = authSlice.actions;

export default authSlice.reducer;