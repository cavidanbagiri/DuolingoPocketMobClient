// slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import FavoritesService from '../services/FavoritesService';

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        categories: [],
        loading: false,
        error: null,

    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        updateCategoryCounts: (state, action) => {
       
            const { oldCategoryId, newCategoryId } = action.payload;
            state.categories = state.categories.map(cat => {
                if (cat.id === oldCategoryId) {
                    return { ...cat, word_count: Math.max(0, cat.word_count - 1) };
                }
                if (cat.id === newCategoryId) {
                    return { ...cat, word_count: cat.word_count + 1 };
                }
                return cat;
            });

        }

    },
    extraReducers: (builder) => {
        builder
            // Get User Categories
            .addCase(FavoritesService.getUserCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FavoritesService.getUserCategories.fulfilled, (state, action) => {
                state.loading = false;
                console.log('coming action is ', action.payload);
                state.categories = action.payload; // Replace with fetched categories
            })
            .addCase(FavoritesService.getUserCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.payload?.detail || 'Failed to fetch categories';
                state.categories = []; // Clear categories on error
            })

            // Create New Category
            .addCase(FavoritesService.createNewCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FavoritesService.createNewCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload.category);
            })
            .addCase(FavoritesService.createNewCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.payload?.detail || 'Failed to create category';
            });
    }
});

export const { clearError, updateCategoryCounts } = favoritesSlice.actions;
export default favoritesSlice.reducer;