
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentWord: null,
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
  },
});

export const { setCurrentWord, clearCurrentWord } = aiSlice.actions;
export default aiSlice.reducer;
