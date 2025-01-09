// Third-party Imports
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { DocumentSliceType, DocumentsParams, DocumentType } from '@/types/DocumentTypes'

const initialState: DocumentSliceType = {
  data: {
    items: [],
    metadata: {
      totalItems: 0,
      itemsPerPage: 0,
      currentPage: 0,
      totalPages: 0
    }
  },
  isLoading: false,
  error: null,
  isDrawerOpen: false
}

export const getDocuments = createAsyncThunk('document/getGetDocuments', async (params: DocumentsParams) => {
  const query = new URLSearchParams(params as any).toString()
  const response = await fetch(`/api/documents?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const result = await response.json()

    return { ...result }
  }

  const result = (await response.json()) as DocumentType

  return result
})

export const documentSlice = createSlice({
  name: 'documents',
  initialState: initialState,
  reducers: {
    toggleDrawer: state => {
      state.isDrawerOpen = !state.isDrawerOpen
    }
  },
  extraReducers: builder => {
    builder.addCase(getDocuments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getDocuments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    builder.addCase(getDocuments.fulfilled, (state, action: PayloadAction<DocumentType>) => {
      state.data = action.payload
      state.isLoading = false
    })
  }
})

export default documentSlice.reducer
export const { toggleDrawer } = documentSlice.actions
