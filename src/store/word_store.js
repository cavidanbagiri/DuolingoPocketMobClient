
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

    detail: {},
    loading: false,

}

export const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.detail = null;
        }
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
        });
        builder.addCase(WordService.setStatus.rejected, (state, action) => {
            console.log('status apyload error is ', action.payload);
        });


        // WordService getDetailWord
        builder.addCase(WordService.getDetailWord.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.getDetailWord.fulfilled, (state, action) => {
            // state.loading = false;
            // console.log('get detail word is ', action.payload);
            // state.detail = action.payload;
            state.loading = false;
            const payload = action.payload || {};
            state.detail = {
                ...payload,
                meanings: payload.meanings ?? [],
                example_sentences: payload.example_sentences ?? [],
                translations: payload.translations ?? [],
            };
        });
        builder.addCase(WordService.getDetailWord.rejected, (state, action) => {
            state.loading = false;
            console.log('get detail word error is ', action.payload);
        });


    },
})

export const { clearDetail } = wordSlice.actions;

export default wordSlice.reducer;