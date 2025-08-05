import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import AuthService from '../services/AuthService.js';
import { clearStorage, getFromStorage, saveToStorage } from '../utils/storage';

axios.defaults.withCredentials = true;


const initialState = {
    user: {
        email: 'unknown',
        username: '',
        target_langs: [],
    },
    login_message: '',
    login_pending: false,
    is_auth: false,
    native_lang: '', // New Added
    choosen_lang: '', // New Added
    is_login_error: false,
    login_success: false,
    new_target_lang_cond:{
        is_cond: false,
        msg: '',
        res: null,
    },
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
        setNewTargetLanguageCondFalse: (state, action) => { 
            state.new_target_lang_cond.is_cond = false;
            state.new_target_lang_cond.msg = '';
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
            state.user.target_langs = action.payload?.payload?.user?.learning_targets;
            saveToStorage('token', action.payload?.payload?.access_token);
            saveToStorage('sub', action.payload?.payload?.user?.sub);  
            saveToStorage('username', action.payload?.payload?.user?.username); 
            if (action.payload.payload.user.native === null) {
                saveToStorage('native', '');
            }
            else {
                saveToStorage('native', action.payload.payload.user.native);
                state.native_lang = action.payload.payload.user.native
            }
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
            if (action.payload.payload.user.native === null) {
                saveToStorage('native', '');
            }
            else {
                saveToStorage('native', action.payload.payload.user.native);
            }
        });
        builder.addCase(AuthService.refresh.rejected, (state, action) => {
            console.log('refresh second', action.payload);
        });


        // Userservice logout
        builder.addCase(AuthService.userLogout.fulfilled, (state, action) => {
            
            state.is_auth = false;
            state.user = null;
            state.is_login_error = false,
            state.login_success = false, 

            clearStorage()
        });

        // UserService setNativeLanguage
        builder.addCase(AuthService.setNativeLanguage.fulfilled, (state, action) => {
            state.native_lang = action.payload?.payload?.native
            saveToStorage('native', action.payload?.payload?.native); 

        });
        builder.addCase(AuthService.setNativeLanguage.rejected, (state, action) => {
            console.log('refresh second', action.payload);
        });

        // UserService setChoosenLanguage
        builder.addCase(AuthService.setTargetLanguage.fulfilled, (state, action) => {
            saveToStorage('target', action.payload?.payload?.target_language_code); 
            state.choosen_lang = action.payload?.payload?.target_language_code
            state.new_target_lang_cond.is_cond = true;
            state.new_target_lang_cond.msg = action.payload?.payload?.msg;
            // state.user.target_langs.push(action.payload?.payload?.target_language_code);
            state.user.target_langs = [...state.user.target_langs, action.payload?.payload?.target_language_code];
            state.new_target_lang_cond.res = action.payload?.payload?.target_language_code;

        });
        builder.addCase(AuthService.setTargetLanguage.rejected, (state, action) => {
            console.log('target rejected', action.payload);
        });

    },
});

export const { setUser, setLoginPending, setIsAuth, setIsLoginErrorTrue, setIsLoginErrorFalse, setIsLoginSuccessFalse, setNewTargetLanguageCondFalse } = authSlice.actions;

export default authSlice.reducer;