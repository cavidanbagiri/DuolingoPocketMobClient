
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
            state.words_pending = false;
            console.log('coming words from action payload is {action.payload} ', action.payload);
            state.words = action.payload.payload.data[0]['en'];
            state.is_words_success = true;
        });
        builder.addCase(WordService.fetchWords.rejected, (state, action) => {
            state.words_pending = false;
            state.is_words_error = true;
        });

        // WordService setStatus
        builder.addCase(WordService.setStatus.fulfilled, (state, action) => {
            // console.log('action payload is {action.payload} ', action.payload);
            // if (action.payload.action === 'learned') {
            //     state.words.forEach((word, index) => {
            //         if (word.id === action.payload.word_id) {
            //             state.words[index].is_learned = action.payload.is_learned;
            //         }
            //     });
            // }
            // const { word_id, is_learned, action: actionType } = action.payload;

            // if (actionType === 'learned') {
            //     // If word is now learned, remove it from the list
            //     if (is_learned) {
            //         state.words = state.words.filter(word => word.id !== word_id);
            //     } else {
            //         // If un-learned (toggled back), update it in place
            //         const word = state.words.find(word => word.id === word_id);
            //         if (word) word.is_learned = false;
            //     }
            // }
        });
        builder.addCase(WordService.setStatus.rejected, (state, action) => {
            console.log('status apyload error is ', action.payload);
        });


    },
})

export const { } = wordSlice.actions;

export default wordSlice.reducer;