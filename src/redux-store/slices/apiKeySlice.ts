// Third-party Imports
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { ApiKeyInputType, ApiKeySliceType, ApiKeyType } from '@/types/ApiKeyTypes'

const initialState: ApiKeySliceType = {
  apiKeys: [],
  isLoading: false,
  error: null,
  drawerData: null,
  isDrawerOpen: false
}

export const addApiKey = createAsyncThunk('apiKey/addApiKey', async (apiKey: ApiKeyInputType, { dispatch }) => {
  const response = await fetch('/api/api-keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiKey)
  })

  if (response.ok) {
    const result = await response.json()

    await dispatch(getApiKeys())

    
return result
  }
})

export const getApiKeys = createAsyncThunk('apiKey/getApiKeys', async () => {
  const response = await fetch('/api/api-keys', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const result = await response.json()

    return { ...result }
  }

  const result = (await response.json()) as ApiKeyType[]

  return result
})

export const deleteApiKey = createAsyncThunk('apiKey/deleteApiKey', async (apiKeyId: string, { dispatch }) => {
  const response = await fetch(`/api/api-keys`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'remove',
      keyId: apiKeyId
    })
  })

  if (response.ok) {
    const result = await response.json()

    await dispatch(getApiKeys())

    
return result
  }
})

export const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState: initialState,
  reducers: {
    toggleDrawer: (state, payload) => {
      state.drawerData = payload.payload
      state.isDrawerOpen = !state.isDrawerOpen
    }
  },
  extraReducers: builder => {
    builder.addCase(getApiKeys.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getApiKeys.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(getApiKeys.fulfilled, (state, action: PayloadAction<ApiKeyType[]>) => {
      state.apiKeys = action.payload
      state.isLoading = false
    })

    builder.addCase(addApiKey.pending, state => {
      state.isLoading = true
    })
    builder.addCase(addApiKey.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })

    builder.addCase(deleteApiKey.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteApiKey.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(deleteApiKey.fulfilled, (state, action: PayloadAction<string>) => {
      state.apiKeys = state.apiKeys.filter(apiKey => apiKey.id !== action.payload)
      state.isLoading = false
    })
  }
})

export default apiKeySlice.reducer
export const { toggleDrawer } = apiKeySlice.actions
