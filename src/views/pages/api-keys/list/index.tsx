'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

import type { ApiKeyType } from '@/types/ApiKeyTypes'
import ApiKeyTable from './ApiKeyListTable'

// Component Imports

const OrderList = () => {
  const [data, setData] = useState([] as ApiKeyType[])
  const apiKeyData = async () => {
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

    const result = await response.json()

    console.log(result)
    setData(result)

    return result
  }

  useEffect(() => {
    apiKeyData()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ApiKeyTable apiKeyData={data} />
      </Grid>
    </Grid>
  )
}

export default OrderList
