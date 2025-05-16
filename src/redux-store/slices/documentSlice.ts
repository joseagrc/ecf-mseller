// Third-party Imports
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { toast } from 'react-toastify'

import type { DocumentSliceType, DocumentsParams, DocumentType } from '@/types/DocumentTypes'
import axiosClient from '@/utils/axiosClient'

const initialState: DocumentSliceType = {
  data: {
    items: [],
    nextToken: '',
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
  const response = await axiosClient.get(`/api/documents?${query}`)

  if (response.status !== 200) {
    return { ...response.data }
  }

  const result = response.data as DocumentType

  return result
})

export const retryDocument = createAsyncThunk(
  'document/retryDocument',
  async (payload: { ecf: string; params: DocumentsParams }, { dispatch, rejectWithValue }) => {
    try {
      const query = new URLSearchParams(payload.params as any).toString()
      const response = await axiosClient.post(`/api/documents/retry-ecf?${query}`, { ecf: payload.ecf })

      console.log('Response from retryDocument:', response)

      if (response.status !== 200) {
        toast.error('Error al re-intentar el envío documento')

        return rejectWithValue(response.data)
      }
      toast.success('El re-intento del envío del documento fue exitoso')

      // Wait for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Dispatch getDocuments with the provided params
      dispatch(getDocuments(payload.params))

      return response.data
    } catch (error: any) {
      toast.error(`Error al re-intentar el envío documento ${error.message}`)

      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

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

    // Add reducers for retryDocument
    builder.addCase(retryDocument.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(retryDocument.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload ? (action.payload as any).message : action.error.message
    })
    builder.addCase(retryDocument.fulfilled, (state, action) => {
      console.log('Retry successful, fetching updated documents...', action.payload)
    })
  }
})

export default documentSlice.reducer
export const { toggleDrawer } = documentSlice.actions
