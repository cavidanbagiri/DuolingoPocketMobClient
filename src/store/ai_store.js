
import { createSlice } from '@reduxjs/toolkit';
// import AIService from '../services/AIService';
import { generateAIWord } from '../services/AIService';

const initialState = {
  currentWord: null,
  aiResponse: null,
  isLoading: false,
  error: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIWord.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateAIWord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiResponse = action.payload;
        state.error = null;
      })
      .addCase(generateAIWord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentWord, clearCurrentWord, clearAIResponse } = aiSlice.actions;
export default aiSlice.reducer;
