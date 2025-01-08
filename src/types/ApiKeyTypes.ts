export interface ApiKeyType {
  createdDate: string
  description: string
  enabled: boolean
  id: string
  lastUpdatedDate: string
  name: string
  stageKeys: string[]
  value: string
}

export interface ApiKeyInputType {
  description: string
  stage: 'TesteCF' | 'CerteCF' | 'eCF'
}

export interface ApiKeySliceType {
  apiKeys: ApiKeyType[]
  isLoading: boolean
  error?: string | null
  drawerData: ApiKeyInputType | null
  isDrawerOpen: boolean
}
