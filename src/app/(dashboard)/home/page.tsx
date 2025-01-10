// MUI Imports
import Grid from '@mui/material/Grid'

import { Typography } from '@mui/material'

import Stepper from '@/views/pages/home/Stepper'

const eCommerceProductsAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Bienvenido a eCF-MSeller</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stepper />
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
