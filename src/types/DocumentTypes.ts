export interface DocumentItem {
  fileName: string
  ncf: string
  updateAt: number
  documentType: string
  internalTrackId: string
  status: string
  dgiiResponse: string[]
  data?: any
  securityCode: string
  createdAt: number
  signedXml: string
  customerId: string
}

export interface Metadata {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
}

export interface DocumentType {
  items: DocumentItem[]
  metadata: Metadata
}

export interface DocumentSliceType {
  data: DocumentType
  isLoading: boolean
  error?: string | null
  isDrawerOpen: boolean
}

export interface DocumentsParams {
  documentType?: string
  status?: string
  internalTrackId?: string
  fromDate?: number
  toDate?: number
  limit?: number
  nextToken?: string
  showData?: boolean
}
