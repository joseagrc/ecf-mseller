'use client'

// MUI Imports

import Grid from '@mui/material/Grid'

import DocumentsTable from './DocumentsListTable'

// Component Imports

const DocumentsList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DocumentsTable />
      </Grid>
    </Grid>
  )
}

export default DocumentsList
