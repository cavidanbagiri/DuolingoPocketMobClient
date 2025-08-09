
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

    statistics: null,

}

export const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {

        setWordsPendingFalse: (state) => {
            state.words_pending = false;
        },

        clearDetail: (state) => {
            state.detail = null;
        },
        
        setDetail: (state, action) => {
            const { actionType, value } = action.payload;
            if (state.detail) {
                if (actionType === 'star') {
                    state.detail.is_starred = value;
                } else if (actionType === 'learned') {
                    state.detail.is_learned = value;
                }
            }
        }
    },
    extraReducers: (builder) => {

        // WordService fetchWords
        builder.addCase(WordService.fetchWords.pending, (state, action) => {
            state.words_pending = true;
        })
        builder.addCase(WordService.fetchWords.fulfilled, (state, action) => {
            state.words_pending = false;
            if (action.payload.payload.data.length === 0) {
                state.words = [];
                return;
            }
            else{
                state.words = action.payload.payload.data[0]['en'];
            }
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


        // WordService getStatisticsForDashboard
        builder.addCase(WordService.getStatisticsForDashboard.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.getStatisticsForDashboard.fulfilled, (state, action) => {
            console.log('get statistics is ', action.payload);
            state.loading = false;
            state.statistics = action.payload;
        });
        builder.addCase(WordService.getStatisticsForDashboard.rejected, (state, action) => {
            state.loading = false;
            console.log('get detail word error is ', action.payload);
        });


    },
})

export const { setWordsPendingFalse, clearDetail, setDetail  } = wordSlice.actions;

export default wordSlice.reducer;