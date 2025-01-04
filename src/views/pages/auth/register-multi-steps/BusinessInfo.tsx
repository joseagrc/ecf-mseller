// React Imports
import { Controller, useFormContext } from 'react-hook-form'

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
  onSubmit: (data: any) => void
}

const BusinessInfo = ({ handlePrev, activeStep, onSubmit }: StepPersonalInfoProps) => {
  const { control, handleSubmit, watch, formState: { errors } } = useFormContext()

  const rnc = watch('rnc')

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
            rules={{ required: 'Nombre del negocio es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Nombre Negocio'
                placeholder=''
                error={!!errors.businessName}
                helperText={errors.businessName ? String(errors.businessName.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='rnc'
            control={control}
            defaultValue=''
            rules={{ required: 'RNC es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='RNC'
                placeholder=''
                error={!!errors.rnc}
                helperText={errors.rnc ? String(errors.rnc.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='confirmRnc'
            control={control}
            defaultValue=''
            rules={{ required: 'Confirmar RNC es requerido', validate: value => value === rnc || 'Los RNCs no coinciden' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Confirmar RNC'
                placeholder=''
                error={!!errors.confirmRnc}
                helperText={errors.confirmRnc ? String(errors.confirmRnc.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='phone'
            control={control}
            defaultValue=''
            rules={{ required: 'Teléfono es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Teléfono'
                placeholder='809-000-0000'
                error={!!errors.phone}
                helperText={errors.phone ? String(errors.phone.message) : ''}
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
            rules={{ required: 'Código PIN es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Código PIN'
                placeholder='689421'
                error={!!errors.pinCode}
                helperText={errors.pinCode ? String(errors.pinCode.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='address'
            control={control}
            defaultValue=''
            rules={{ required: 'Dirección es requerida' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Dirección'
                placeholder=''
                error={!!errors.address}
                helperText={errors.address ? String(errors.address.message) : ''}
              />

            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='city'
            control={control}
            defaultValue=''
            rules={{ required: 'Ciudad es requerida' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Ciudad'
                placeholder=''
                error={!!errors.city}
                helperText={errors.city ? String(errors.city.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.country}>
            <InputLabel>País</InputLabel>
            <Controller
              name='country'
              control={control}
              defaultValue='republica dominicana'
              rules={{ required: 'País es requerido' }}
              render={({ field }) => (
                <Select {...field} label='País' disabled>
                  <MenuItem value='republica dominicana'>República Dominicana</MenuItem>
                </Select>
              )}
            />
            {errors.country && <Typography color='error'>{String(errors.country.message)}</Typography>}
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

