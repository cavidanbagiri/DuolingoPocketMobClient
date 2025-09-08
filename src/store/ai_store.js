
import { createSlice } from '@reduxjs/toolkit';
import { generateAIWordThunk } from '../services/AIService';

const MAX_CACHE_SIZE = 50;

const initialState = {
  currentWord: null,
  aiResponse: null,
  isLoading: false,
  error: null,
  cache: {},
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setCurrentWord: (state, action) => {
      state.currentWord = action.payload;
    },
    clearCurrentWord: (state) => {
      state.currentWord = null;
    },
    clearAIResponse: (state) => {
      state.aiResponse = null;
      state.error = null;
      state.isLoading = false; // Reset loading state
    },
    setAIResponse: (state, action) => { // Add this action
      state.aiResponse = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIWordThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateAIWordThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiResponse = action.payload;
        state.error = null;

        // if (state.currentWord?.id) {
        //   state.cache[state.currentWord.id] = action.payload;
        // }

        if (state.currentWord?.id) {
          // LRU Cache implementation
          const cacheKeys = Object.keys(state.cache);
          
          // Remove oldest item if cache is full
          if (cacheKeys.length >= MAX_CACHE_SIZE) {
            // Simple approach: remove the first (oldest) key
            const oldestKey = cacheKeys[0];
            delete state.cache[oldestKey];
          }
          
          // Add new item to cache
          state.cache[state.currentWord.id] = action.payload;
        }


      })
      .addCase(generateAIWordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentWord, 
  clearCurrentWord, 
  clearAIResponse, 
  setAIResponse, 
  clearCache  } = aiSlice.actions;
export default aiSlice.reducer;
