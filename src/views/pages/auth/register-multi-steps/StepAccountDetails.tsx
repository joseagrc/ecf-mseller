// React Imports
import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

// MUI Imports
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

type StepAccountDetailsProps = {
  handleNext: () => void
  activeStep: number
}

interface OptionType {
  label: string
  value: string | number
  isNew?: boolean
}

const jobTitles: OptionType[] = [
  { label: 'Gerente General', value: 'gerente_general' },
  { label: 'Director de Finanzas', value: 'director_finanzas' },
  { label: 'Director de Marketing', value: 'director_marketing' },
  { label: 'Director de Recursos Humanos', value: 'director_rrhh' },
  { label: 'Director de Tecnología', value: 'director_tecnologia' },
  { label: 'Gerente de Ventas', value: 'gerente_ventas' },
  { label: 'Gerente de Operaciones', value: 'gerente_operaciones' },
  { label: 'Gerente de Producto', value: 'gerente_producto' },
  { label: 'Gerente de Proyectos', value: 'gerente_proyectos' },
  { label: 'Analista Financiero', value: 'analista_financiero' },
  { label: 'Analista de Marketing', value: 'analista_marketing' },
  { label: 'Analista de Recursos Humanos', value: 'analista_rrhh' },
  { label: 'Desarrollador de Software', value: 'desarrollador_software' },
  { label: 'Ingeniero de Sistemas', value: 'ingeniero_sistemas' },
  { label: 'Especialista en Ciberseguridad', value: 'especialista_ciberseguridad' },
  { label: 'Consultor de Negocios', value: 'consultor_negocios' },
  { label: 'Asistente Administrativo', value: 'asistente_administrativo' },
  { label: 'Recepcionista', value: 'recepcionista' },
  { label: 'Contador', value: 'contador' },
  { label: 'Abogado', value: 'abogado' }
]

const StepAccountDetails = ({ activeStep, handleNext }: StepAccountDetailsProps) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()

  const password = watch('password')

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  return (
    <form>
      <div className='mbe-5'>
        <Typography variant='h4'>Información de la cuenta</Typography>
        <Typography>Datos de autenticación y acceso </Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='givenName'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Nombre' placeholder='Juan' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='familyName'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Apellido' placeholder='Lopez' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{
              required: 'Correo electrónico es requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico no válido' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='email'
                label='Correo electrónico'
                placeholder='tu-correo@proveedor.com'
                error={!!errors.email}
                helperText={errors.email ? String(errors.email.message) : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.jobTitle}>
            <InputLabel>Título del Trabajo</InputLabel>
            <Controller
              name='jobTitle'
              control={control}
              defaultValue=''
              rules={{ required: 'Título del trabajo es requerido' }}
              render={({ field }) => (
                <Select {...field} label='Título del Trabajo'>
                  {jobTitles.map((title, index) => (
                    <MenuItem key={index} value={title.value}>
                      {title.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.jobTitle && <Typography color='error'>{String(errors.jobTitle.message)}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{
              required: 'Contraseña es requerida',
              minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Contraseña'
                placeholder='············'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password ? String(errors.password.message) : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='confirmPassword'
            control={control}
            defaultValue=''
            rules={{
              required: 'Confirmar contraseña es requerido',
              validate: value => value === password || 'Las contraseñas no coinciden'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Confirmar Contraseña'
                placeholder='············'
                id='outlined-confirm-password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? String(errors.confirmPassword.message) : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle confirm password visibility'
                      >
                        <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} className='flex justify-between'>
          <Button
            disabled={activeStep === 0}
            color='secondary'
            variant='outlined'
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Anterior
          </Button>
          <Button
            type='submit'
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Siguiente
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StepAccountDetails
