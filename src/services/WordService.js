
import { createAsyncThunk } from '@reduxjs/toolkit';

import $api from '../http/api';

class WordService {

    static fetchWords = createAsyncThunk(
        '/words/fetch_words',
        async ({ filter = 'all' } = {}, thunkAPI) => {
            try {
                let starred = false;

                if (filter === 'starred') {
                    starred = true;
                }
                const response = await $api.get(`/words/fetch_words`,
                    { 
                        params: 
                        { 
                            only_starred: starred
                        } 
                    }
                );
                // console.log('coming data is {}', response.data);
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


}


export default WordService;