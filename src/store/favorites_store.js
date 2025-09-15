// slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import FavoritesService from '../services/FavoritesService';

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        categories: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
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

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;