// React Imports
import { useState } from 'react'

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
}

const StepAccountDetails = ({ handleNext, activeStep }: StepAccountDetailsProps) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>Información de la cuenta</Typography>
        <Typography>Datos de autenticación y acceso </Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Nombre' placeholder='Juan' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Apellido' placeholder='Lopez' />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField fullWidth type='email' label='Correo electrónico' placeholder='tu-correo@proveedor.com' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Contraseña'
            placeholder='············'
            id='outlined-adornment-password'
            type={isPasswordShown ? 'text' : 'password'}
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Confirmar Contraseña'
            placeholder='············'
            id='outlined-confirm-password'
            type={isConfirmPasswordShown ? 'text' : 'password'}
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
            variant='contained'
            onClick={handleNext}
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Siguiente
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default StepAccountDetails
