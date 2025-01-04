'use client'

// React Imports
import { useState } from 'react'

import Link from 'next/link'

import { useForm, FormProvider } from 'react-hook-form'

// Next Imports

// MUI Imports
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepAccountDetails from './StepAccountDetails'
import BusinessInfo from './BusinessInfo'
import StepBillingDetails from './StepBillingDetails'
import StepperCustomDot from '@components/stepper-dot'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Vars
const steps = [
  {
    title: 'Cuenta',
    subtitle: 'Datos de la Cuenta'
  },
  {
    title: 'Negocio',
    subtitle: 'Datos del Negocio'
  },
  {
    title: 'Facturación',
    subtitle: 'Detalles de Facturación'
  }
]

const getStepContent = (
  step: number,
  handleNext: () => void,
  handlePrev: () => void,
  onSubmit: (data: any) => void
) => {
  switch (step) {
    case 0:
      return <StepAccountDetails activeStep={step} handleNext={handleNext} />
    case 1:
      return <BusinessInfo activeStep={step} handleNext={handleNext} handlePrev={handlePrev} />
    case 2:
      return <StepBillingDetails activeStep={step} handlePrev={handlePrev} onSubmit={onSubmit} />
    default:
      return null
  }
}

const RegisterMultiSteps = () => {
  // States
  const [activeStep, setActiveStep] = useState<number>(0)

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  const methods = useForm({
    defaultValues: {
      givenName: '',
      familyName: '',
      email: '',
      jobTitle: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      rnc: '',
      confirmRnc: '',
      businessPhone: '',
      businessWebsite: '',
      businessAddress: '',
      businessCity: '',
      businessCountry: 'republica dominicana',
      businessCategory: '',
      howTheyFoundYou: '',
      interestedInProvidingService: '',
      termsAccepted: false
    }
  })

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const onSubmit = async (data: any) => {
    console.log(data)

    if (activeStep === steps.length - 1) {
      try {
        const response = await fetch('/api/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json()
        console.log('User added successfully:', result)
        alert('Form submitted successfully!')
      } catch (error) {
        console.error('Error adding user:', error)
      }
    } else {
      handleNext()
    }
  }

  return (
    <FormProvider {...methods}>
      <div className='flex bs-full justify-between items-center'>
        <div
          className={classnames('flex bs-full items-center justify-center is-[594px] max-md:hidden', {
            'border-ie': settings.skin === 'bordered'
          })}
        >
          <img
            src='/images/illustrations/objects/e-cf-registration-image.png'
            alt='multi-steps-character'
            className={classnames('mis-[12px] bs-auto max-bs-[428px] max-is-full', {
              'scale-x-[-1]': theme.direction === 'rtl'
            })}
          />
        </div>
        <div className='flex justify-center items-center bs-full is-full bg-backgroundPaper'>
          <Link
            href={'/'}
            className='absolute block-start-5 sm:block-start-[25px] inline-start-6 sm:inline-start-[25px]'
          >
            <Logo />
          </Link>
          <StepperWrapper className='p-5 sm:p-8 is-[700px]'>
            <Stepper className='mbe-12 mbs-16 sm:mbs-0' activeStep={activeStep}>
              {steps.map((step, index) => {
                return (
                  <Step key={index} onClick={() => setActiveStep(index)}>
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label cursor-pointer'>
                        <Typography className='step-number' color='text.primary'>{`0${index + 1}`}</Typography>
                        <div>
                          <Typography className='step-title' color='text.primary'>
                            {step.title}
                          </Typography>
                          <Typography className='step-subtitle' color='text.primary'>
                            {step.subtitle}
                          </Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            {getStepContent(activeStep, handleNext, handlePrev, methods.handleSubmit(onSubmit))}
          </StepperWrapper>
        </div>
      </div>
    </FormProvider>
  )
}

export default RegisterMultiSteps
