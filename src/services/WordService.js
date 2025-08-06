
import { createAsyncThunk } from '@reduxjs/toolkit';

import $api from '../http/api';

class WordService {

    static fetchWords = createAsyncThunk(
        '/words/fetch_words',
        async (word, thunkAPI) => {
            try {
                const response = await $api.get(`/words/fetch_words`);
                console.log('coming response is {}', response.data);
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

}


export default WordService;