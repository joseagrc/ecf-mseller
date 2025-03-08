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
  qr_url: string
  summarySignedXml?: string
  commercialApprovalStatus?: string
  commercialApprovalUrl?: string
  commercialApprovalReceivedAt?: string
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
  nextToken: string
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
  fromDate?: number | null | undefined
  toDate?: number | null | undefined
  limit?: number
  nextToken?: string
  showData?: boolean
  ecf?: string
}

export interface DocumentsFilterValues extends DocumentsParams {
  environment: string
}
