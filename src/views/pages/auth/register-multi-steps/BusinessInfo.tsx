// React Imports
import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

type StepPersonalInfoProps = {
  handleNext: () => void
  handlePrev: () => void
  activeStep: number
}

const BusinessInfo = ({ handleNext, handlePrev, activeStep }: StepPersonalInfoProps) => {
  const { control, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
    handleNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mbe-5'>
        <Typography variant='h4'>Información del negocio</Typography>
        <Typography>Entidad autorizada por la DGII</Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12}>
          <Controller
            name='businessName'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Nombre Negocio' placeholder='' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='rnc'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth type='number' label='RNC' placeholder='' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='confirmRnc'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth type='number' label='Confirmar RNC' placeholder='' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='phone'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Teléfono'
                placeholder='809-000-0000'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>DO (+1)</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='pinCode'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth type='number' label='Pin Code' placeholder='689421' />}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='address'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Dirección' placeholder='' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='city'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Ciudad' placeholder='' />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>País</InputLabel>
            <Controller
              name='country'
              control={control}
              defaultValue='republica dominicana'
              render={({ field }) => (
                <Select {...field} label='País' disabled>
                  <MenuItem value='republica dominicana'>República Dominicana</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} className='flex justify-between'>
          <Button
            disabled={activeStep === 0}
            variant='outlined'
            color='secondary'
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Anterior
          </Button>
          <Button
            type='submit'
            variant='contained'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Siguiente
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default BusinessInfo
