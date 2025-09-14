

import { createAsyncThunk } from "@reduxjs/toolkit";


import $api from '../http/api.js'

class FavoritesService {

    static addFavorites = createAsyncThunk(
        '/words/add_favorites',
        async (data, thunkAPI) => {
            console.log('coming data is ', data);
            try {
                const response = await $api.post('/words/add_favorites', data);
                console.log('coming  response is ', response.data);
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
    }

export default FavoritesService;