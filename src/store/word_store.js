
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import WordService from '../services/WordService.js';
import { clearStorage, getFromStorage, saveToStorage } from '../utils/storage';

axios.defaults.withCredentials = true;

// const initialState = {
//     words: [],
//     words_pending: false,
//     is_words_error: false,
//     is_words_success: false,

//     detail: {},
//     loading: false,

//     statistics: null,

//     pos_statistics: null,

// }

const initialState = {
    words: [],
    wordsData: [], // New: stores the complete language-wise data
    availableLanguages: [], // New: stores available language codes
    selectedLanguage: null, // New: currently selected language
    words_pending: false,
    is_words_error: false,
    is_words_success: false,

    detail: {},
    loading: false,

    statistics: null,

    pos_statistics: null,
};

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
        },

        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
            // Find and set words for the selected language
            // const selectedLangData = state.wordsData.find(data => data.lang === action.payload);
            // if (selectedLangData) {
            //     state.words = selectedLangData.words;
            // }
        }

    },
    extraReducers: (builder) => {

        
        // WordService getStatisticsForDashboard
        builder.addCase(WordService.getStatisticsForDashboard.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.getStatisticsForDashboard.fulfilled, (state, action) => {
            state.loading = false;
            state.statistics = action.payload;
        });
        builder.addCase(WordService.getStatisticsForDashboard.rejected, (state, action) => {
            state.loading = false;
        });



        builder.addCase(WordService.fetchAvailableLanguages.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.fetchAvailableLanguages.fulfilled, (state, action) => {
            state.loading = false;
            state.availableLanguages = action.payload;
        });
        builder.addCase(WordService.fetchAvailableLanguages.rejected, (state, action) => {
            state.loading = false;
        });




        builder.addCase(WordService.handleLanguageSelect.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.handleLanguageSelect.fulfilled, (state, action) => {
            state.loading = false;
            state.words = action.payload;
        });
        builder.addCase(WordService.handleLanguageSelect.rejected, (state, action) => {
            state.loading = false;
        });




        // -------------------------------------------------------------------------------- For fetching words Old codes

        // WordService fetchWords           -- This is old code and work
        // builder.addCase(WordService.fetchWords.pending, (state, action) => {
        //     state.words_pending = true;
        // })
        // builder.addCase(WordService.fetchWords.fulfilled, (state, action) => {
        //     // console.log('coming words is .....', action.payload.payload);
        //     state.words_pending = false;
        //     if (action.payload.payload?.length === 0) {
        //         console.log('enter if')
        //         state.words = [];
        //         return;
        //     }
        //     else{
        //         console.log('enter elkse')
        //         state.words = action.payload?.payload
        //     }
        //     console.log('words is ', state.words)
        //     state.is_words_success = true;
        // });
        // builder.addCase(WordService.fetchWords.rejected, (state, action) => {
        //     state.words_pending = false;
        //     state.is_words_error = true;
        // });

        // builder.addCase(WordService.fetchWords.pending, (state, action) => {
        //     state.words_pending = true;
        // })

        // builder.addCase(WordService.fetchWords.fulfilled, (state, action) => {
        //     state.words_pending = false;
            
        //     const payload = action.payload?.payload;
            
        //     if (!payload || payload.length === 0) {
        //         state.words = [];
        //         state.availableLanguages = [];
        //         state.selectedLanguage = null;
        //         return;
        //     }
            
        //     // Store the complete response with languages
        //     state.wordsData = payload;
        //     console.log('words data is ', payload)
            
        //     // Extract available languages
        //     state.availableLanguages = payload.map(langData => langData.lang);
            
        //     // If only one language, auto-select it
        //     if (payload.length === 1) {
        //         state.selectedLanguage = payload[0].lang;
        //         state.words = payload[0].words; // Show words for the single language
        //     } else {
        //         state.selectedLanguage = null; // User needs to choose
        //         state.words = []; // No words shown until language is selected
        //     }
            
        //     state.is_words_success = true;
        // });

        // builder.addCase(WordService.fetchWords.rejected, (state, action) => {
        //     state.words_pending = false;
        //     state.is_words_error = true;
        // });

        // -------------------------------------------------------------------------------- 






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


        // WordService getPosStatisticsForDashboard
        builder.addCase(WordService.getPosStatistics.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(WordService.getPosStatistics.fulfilled, (state, action) => {
            state.loading = false;
            state.pos_statistics = action.payload;
        });
        builder.addCase(WordService.getPosStatistics.rejected, (state, action) => {
            state.loading = false;
        });


    },
})

export const { setWordsPendingFalse, clearDetail, setDetail, setSelectedLanguage  } = wordSlice.actions;

export default wordSlice.reducer;