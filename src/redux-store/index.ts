// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import apiKeyReducer from '@/redux-store/slices/apiKeySlice'

export const store = configureStore({
  reducer: {
    apiKeyReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
