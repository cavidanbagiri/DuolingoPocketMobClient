
import { createAsyncThunk } from '@reduxjs/toolkit';

import $api from '../http/api';

class WordService {

    // static fetchWords = createAsyncThunk(
    //     '/words/fetch_words',
    //     async ({ filter = 'all' } = {}, thunkAPI) => {
    //         try {
    //             let starred = false;
    //             let learned = false;
    //             if (filter === 'starred') {
    //                 starred = true;
    //             }
    //             if (filter === 'learned') {
    //                 learned = true;
    //             }
    //             const response = await $api.get(`/words/fetch_words`,
    //                 { 
    //                     params: 
    //                     { 
    //                         only_starred: starred,
    //                         only_learned: learned
    //                     } 
    //                 }
    //             );
    //             return {
    //                 payload: response.data,
    //                 status: response.status,
    //             };
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
    //     }
    // )


    static fetchAvailableLanguages = createAsyncThunk(
        '/user/languages',
        async () => {
            try {
                const response = await $api.get('/user/languages');
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
        }
    )

    static handleLanguageSelect = createAsyncThunk(
        '/words/:langCode',
        async (langCode, thunkAPI) => {
            try {
                const response = await $api.get(`/words/${langCode}?limit=50`);
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
        }
    )




    static setStatus = createAsyncThunk(
        '/words/setstatus',
        async (data, thunkAPI) => {
            try {
                const response = await $api.post(`/words/setstatus`, data);
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
        }
    )

    static getDetailWord = createAsyncThunk(
        '/words/get_detail_word',
        async (word_id, thunkAPI) => {
            try {
                const response = await $api.get(`/words/get_detail_word/${word_id}`);
                console.log('word detail is ', response.data);
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
        }
    )

    static getStatisticsForDashboard = createAsyncThunk(
        '/words/get_statistics',
        async (data, thunkAPI) => {
            try {
                const response = await $api.get(`/words/get_statistics`);
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
        }
    )

    static getPosStatistics = createAsyncThunk(
        '/words/get_pos_statistics',
        async (data, thunkAPI) => {
            try {
                const response = await $api.get(`/words/get_pos_statistics`);
                console.log('coming statistics is ', response.data);
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
        }
    )


    static getWordWithPos = createAsyncThunk(
        '/words/get_word_with_pos',
        async (data, thunkAPI) => {
            try {
                const response = await $api.get(`/words/get_word_with_pos/${data.lang}/${data.pos}`);
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
        }
    )



}


export default WordService;