
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

    // word_status:{
    //     status: null,
    //     word_id: null,
    //     action: null,
    //     is_learned: false,
    //     is_starred: false,
    // }
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
            state.words_pending = false;
            state.words = action.payload.payload.data[0]['en'];
            state.is_words_success = true;
        });
        builder.addCase(WordService.fetchWords.rejected, (state, action) => {
            state.words_pending = false;
            state.is_words_error = true;
        });

        // WordService setStatus
        builder.addCase(WordService.setStatus.fulfilled, (state, action) => {
            // state.word_status.status = action.payload.status;
            // state.word_status.word_id = action.payload.word_id;
            // state.word_status.action = action.payload.action;
            // state.word_status.is_learned = action.payload.is_learned;
            // state.word_status.is_starred = action.payload.is_starred;
        });
        builder.addCase(WordService.setStatus.rejected, (state, action) => {
            console.log('status apyload error is ', action.payload);
        });


    },
})

export const {  } = wordSlice.actions;

export default wordSlice.reducer;