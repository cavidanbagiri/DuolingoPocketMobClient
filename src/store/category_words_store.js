// slices/categoryWordsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import FavoritesService from '../services/FavoritesService';

const categoryWordsSlice = createSlice({
  name: 'categoryWords',
  initialState: {
    currentCategory: null,
    words: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCategoryWords: (state) => {
      state.words = [];
      state.currentCategory = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(FavoritesService.getCategoryWords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FavoritesService.getCategoryWords.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = {
          id: action.payload.category_id,
          name: action.payload.category_name
        };
        state.words = action.payload.words;
      })
      .addCase(FavoritesService.getCategoryWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.payload?.detail || 'Failed to fetch category words';
        state.words = [];
      });
  }
});

export const { clearCategoryWords } = categoryWordsSlice.actions;
export default categoryWordsSlice.reducer;