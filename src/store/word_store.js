
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import WordService from '../services/WordService.js';
import { clearStorage, getFromStorage, saveToStorage } from '../utils/storage';

axios.defaults.withCredentials = true;

const initialState = {
    words: [],
    words_pending: false,
    is_words_error: false,
    is_words_success: false,
}

export const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {

        // WordService fetchWords
        builder.addCase(WordService.fetchWords.pending, (state, action) => {
            state.words_pending = true;
        })
        builder.addCase(WordService.fetchWords.fulfilled, (state, action) => {
            // console.log('action payload is {}', action.payload.payload.data[0]['en']);
            state.words_pending = false;
            state.words = action.payload.payload.data[0]['en'];
            console.log('words id ', state.words);
            state.is_words_success = true;
        });
        builder.addCase(WordService.fetchWords.rejected, (state, action) => {
            state.words_pending = false;
            state.is_words_error = true;
        });
    },
})

export const {  } = wordSlice.actions;

export default wordSlice.reducer;