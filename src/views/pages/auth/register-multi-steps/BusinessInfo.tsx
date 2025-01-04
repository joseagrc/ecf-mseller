// React Imports
import { Controller, useFormContext } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import { Divider, MenuItem, Select } from '@mui/material'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import CustomAutocomplete from '@/components/customAutocomplete'

type StepPersonalInfoProps = {
  handleNext: () => void
  handlePrev: () => void
  activeStep: number
  onSubmit: (data: any) => void
}

interface OptionType {
  label: string
  value: string | number
  isNew?: boolean
}

const businessCategories: OptionType[] = [
  { label: 'Agricultura', value: 'agricultura' },
  { label: 'Alimentación', value: 'alimentacion' },
  { label: 'Arte y Cultura', value: 'arte_y_cultura' },
  { label: 'Cafetería', value: 'cafeteria' },
  { label: 'Comercio', value: 'comercio' },
  { label: 'Consultoría', value: 'consultoria' },
  { label: 'Construcción', value: 'construccion' },
  { label: 'Deportes', value: 'deportes' },
  { label: 'Educación', value: 'educacion' },
  { label: 'Farmacia', value: 'farmacia' },
  { label: 'Finanzas', value: 'finanzas' },
  { label: 'Inmobiliaria', value: 'inmobiliaria' },
  { label: 'Legal', value: 'legal' },
  { label: 'Manufactura', value: 'manufactura' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Medios de Comunicación', value: 'medios_de_comunicacion' },
  { label: 'Minimarket', value: 'minimarket' },
  { label: 'Panadería', value: 'panaderia' },
  { label: 'Recursos Humanos', value: 'recursos_humanos' },
  { label: 'Restaurante', value: 'restaurante' },
  { label: 'Salud', value: 'salud' },
  { label: 'Servicios', value: 'servicios' },
  { label: 'Supermercado', value: 'supermercado' },
  { label: 'Tecnología', value: 'tecnologia' },
  { label: 'Tienda de Electrónica', value: 'tienda_de_electronica' },
  { label: 'Tienda de Ropa', value: 'tienda_de_ropa' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Turismo', value: 'turismo' }
]

const salesRanges: OptionType[] = [
  { label: 'Menos de RD$60,000', value: '<60000' },
  { label: 'RD$60,000 - RD$200,000', value: '60000-200000' },
  { label: 'RD$200,000 - RD$500,000', value: '200000-500000' },
  { label: 'RD$500,000 - RD$800,000', value: '5000000-800000' },
  { label: 'RD$800,000 - RD$1,000,000', value: '800000-1000000' },
  { label: 'Más de RD$1,000,000', value: '>1000000' }
]

const BusinessInfo = ({ handlePrev, activeStep, onSubmit }: StepPersonalInfoProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useFormContext()

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
            rules={{
              required: 'Confirmar RNC es requerido',
              validate: value => value === rnc || 'Los RNCs no coinciden'
            }}
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
            name='businessPhone'
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
            name='businessWebsite'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Website'
                error={!!errors.businessWebsite}
                helperText={errors.businessWebsite ? String(errors.businessWebsite.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='businessAddress'
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
            name='businessCity'
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
              name='businessCountry'
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
        <Grid item xs={12} sm={12}>
          <Divider>Informaciones Adicionales</Divider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomAutocomplete
            name='businessCategory'
            control={control}
            options={businessCategories}
            label='Categoría del Negocio'
            freeSolo
            rules={{ required: 'Categoría del negocio es requerida' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.salesRange}>
            <InputLabel>Rango de Ventas Mensuales</InputLabel>
            <Controller
              name='businessSalesRange'
              control={control}
              defaultValue=''
              rules={{ required: 'Rango de ventas mensuales es requerido' }}
              render={({ field }) => (
                <Select {...field} label='Rango de Ventas Mensuales'>
                  {salesRanges.map((range, index) => (
                    <MenuItem key={index} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.salesRange && <Typography color='error'>{String(errors.salesRange.message)}</Typography>}
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
