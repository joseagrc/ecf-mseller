// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import apiKeyReducer from '@/redux-store/slices/apiKeySlice'
import documentReducer from '@/redux-store/slices/documentSlice'

export const store = configureStore({
  reducer: {
    apiKeyReducer,
    documentReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
