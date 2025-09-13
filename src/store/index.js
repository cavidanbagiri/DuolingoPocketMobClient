
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth_store.js'
import wordSlice from './word_store.js'
import aiSlice from './ai_store.js'
import translateSlice from './translate_store.js'

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    wordSlice: wordSlice,
    aiSlice: aiSlice,
    translateSlice: translateSlice,
  },
})

export default store;