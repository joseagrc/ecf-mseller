// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import DirectionalIcon from '@components/DirectionalIcon'
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

type StepBillingDetailsProps = {
  handlePrev: () => void
  activeStep: number
}

// Styled Components
const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content'
})<TypographyProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center'
}))

// Vars
const customInputData: CustomInputVerticalData[] = [
  {
    title: 'Gratis',
    value: 'free',
    content: (
      <Content component='div' className='flex justify-center items-center flex-col bs-full gap-2'>
        <Typography variant='body2' className='mlb-auto'>
          Ideal para iniciar la certificación y pequeños negocios
        </Typography>
        <div>
          <Typography color='primary' variant='body2' component='sup' className='self-start'>
            $
          </Typography>
          <Typography color='primary' variant='h4' component='span'>
            0
          </Typography>
          <Typography color='text.disabled' variant='body2' component='sub' className='self-end'>
            /mes
          </Typography>
        </div>
      </Content>
    ),
    isSelected: true
  },
  {
    title: 'Estándar',
    value: 'standard',
    content: (
      <Content component='div' className='flex justify-center items-center flex-col bs-full'>
        <Typography variant='body2' className='mlb-auto'>
          Esencial para pequeños y medianos negocios
        </Typography>
        <div>
          <Typography color='primary' variant='body2' component='sup' className='self-start'>
            $
          </Typography>
          <Typography color='primary' variant='h4' component='span'>
            99
          </Typography>
          <Typography variant='body2' component='sub' className='self-end' color='text.disabled'>
            /mes
          </Typography>
        </div>
      </Content>
    )
  },
  {
    title: 'Empresarial',
    value: 'enterprise',
    content: (
      <Content component='div' className='flex justify-center items-center flex-col bs-full'>
        <Typography variant='body2' className='mlb-auto'>
          Solution for enterprise & organizations Solución para empresas que generan alto volumen de facturación
        </Typography>
        <div>
          <Typography color='primary' variant='body2' component='sup' className='self-start'>
            $
          </Typography>
          <Typography color='primary' variant='h4' component='span'>
            499
          </Typography>
          <Typography variant='body2' component='sub' className='self-end' color='text.disabled'>
            /mes
          </Typography>
        </div>
      </Content>
    )
  }
]

const StepBillingDetails = ({ handlePrev, activeStep }: StepBillingDetailsProps) => {
  // States
  const [selectedOption, setSelectedOption] = useState<string>('free')

  const handleOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectedOption(prop)
    } else {
      setSelectedOption((prop.target as HTMLInputElement).value)
    }
  }

  return (
    <>
      <div className='mbe-5'>
        <Typography variant='h4'>Seleccionar Plan</Typography>
        <Typography>Seleccionar el plan acomodado</Typography>
      </div>
      <Grid container spacing={5}>
        {customInputData.map((item, index) => (
          <CustomInputVertical
            type='radio'
            key={index}
            data={item}
            disabled
            gridProps={{ xs: 12, sm: 4 }}
            selected={selectedOption}
            name='custom-radios-basic'
            handleChange={handleOptionChange}
          />
        ))}
      </Grid>
      <div className='mbs-12 mbe-5'>
        <Typography variant='h4'>Información de pago</Typography>
        <Typography>Pago automático, aún no disponible</Typography>
      </div>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <TextField disabled fullWidth label='Card Number' placeholder='1234 1234 1234 1234' />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField disabled fullWidth label='Name on Card' placeholder='John Doe' />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField disabled fullWidth label='Expiry Date' placeholder='MM/YY' />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField disabled fullWidth label='CVV' placeholder='123' />
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
            variant='contained'
            color='success'
            onClick={() => alert('Submitted..!!')}
            endIcon={<i className='ri-check-line' />}
          >
            Crear Cuenta
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default StepBillingDetails
