// React Imports
import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

type StepAccountDetailsProps = {
  handleNext: () => void
  activeStep: number
  onSubmit: (data: any) => void
}

const StepAccountDetails = ({ activeStep, onSubmit }: StepAccountDetailsProps) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mbe-5'>
        <Typography variant='h4'>Información de la cuenta</Typography>
        <Typography>Datos de autenticación y acceso </Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='firstName'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Nombre' placeholder='Juan' />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='lastName'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Apellido' placeholder='Lopez' />}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
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
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{
              required: 'Contraseña es requerida',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
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
