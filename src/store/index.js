
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth_store.js'

const store = configureStore({
  reducer: {
    authSlice: authSlice,
  },
})

export default store;