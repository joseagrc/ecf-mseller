'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import { default as StepperMui } from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classNames from 'classnames'
import { toast } from 'react-toastify'

// Component Imports
import StepperCustomDot from '@components/stepper-dot'
import StepperWrapper from '@core/styles/stepper'
import AddApiKeyForm from '../api-keys/list/AddApiKeyForm'
import AddCertificate from '../certificate/add/AddCertificate'
import { CodeExamples } from './CodeExamples'

// Vars

const Stepper = () => {
  // States
  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem('activeStep')

    return savedStep ? parseInt(savedStep, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem('activeStep', activeStep.toString())
  }, [activeStep])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === steps.length - 1) {
      toast.success('Completed All Steps!!')
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const steps = [
    {
      title: 'Cargar su certificado digital',
      subtitle: 'Este archivo es necesario para firmar los documentos',
      description: (
        <div>
          <AddCertificate callback={handleNext} />
        </div>
      )
    },
    {
      title: 'Crear una API Key',
      subtitle: 'Api Key es necesaria para realizar establecer la conexión con nuestro servicio vía API',
      description: <AddApiKeyForm callback={handleNext} />
    },
    {
      title: 'Probar conexión!',
      subtitle: 'Realice una prueba de conexión para verificar que todo está funcionando correctamente',
      description: <CodeExamples />
    }
  ]

  return (
    <Card>
      <CardHeader title='Siga los siguientes pasos para iniciar las pruebas y certificación' />
      <CardContent>
        <StepperWrapper>
          <StepperMui activeStep={activeStep} orientation='vertical'>
            {steps.map((step, index) => (
              <Step key={index} className={classNames({ active: activeStep === index })}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
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
                <StepContent>
                  {step.description}
                  <div className='flex gap-4 mt-4'>
                    <Button variant='contained' onClick={handleNext} size='small'>
                      {index === steps.length - 1 ? 'Completado' : 'Siguiente'}
                    </Button>
                    <Button
                      size='small'
                      color='secondary'
                      variant='outlined'
                      onClick={handleBack}
                      disabled={index === 0}
                    >
                      Atrás
                    </Button>
                  </div>
                </StepContent>
              </Step>
            ))}
          </StepperMui>
        </StepperWrapper>
        {activeStep === steps.length && (
          <div className='mt-2'>
            <Typography color='text.primary'>All steps are completed!</Typography>
            <Button variant='contained' onClick={handleReset} size='small' className='mt-2'>
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Stepper
