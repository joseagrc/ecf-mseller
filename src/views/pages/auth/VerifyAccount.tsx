'use client'

// Next Imports
import { useEffect } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// MUI Imports
import router from 'next/router'

import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Type Imports
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import * as yup from 'yup'

import type { Mode } from '@core/types'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Form Imports

const verifySchema = yup.object({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  code: yup.string().min(6, 'Código debe tener al menos 6 caracteres').required('Código es requerido')
})

type VerifyFormData = yup.InferType<typeof verifySchema>

const VerifyAccount = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const searchParams = useSearchParams()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<VerifyFormData>({
    resolver: yupResolver(verifySchema)
  })

  useEffect(() => {
    const email = searchParams.get('email')
    const code = searchParams.get('code')

    if (email) setValue('email', email)

    if (code) setValue('code', code)
  }, [searchParams, setValue])

  const onSubmit = async (data: VerifyFormData) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Cuenta verificada exitosamente')
        router.push('/login')
      } else {
        const data = await response.json()

        toast.error(data.error)
      }
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href={'/'} className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>Código de verificación</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              Digite el código de verificación que le enviamos a su correo electrónico.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <TextField
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                label='Correo electrónico'
                disabled={isSubmitting}
              />
              <TextField
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
                fullWidth
                label='Código de Verificación'
                disabled={isSubmitting}
              />
              <LoadingButton
                fullWidth
                variant='contained'
                type='submit'
                loading={isSubmitting}
                loadingPosition='center'
              >
                {isSubmitting ? 'Verificando...' : 'Verificar'}
              </LoadingButton>
              <Typography className='flex justify-center items-center' color='primary'>
                <Link href={'/'} className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>Ir al inicio de sesión</span>
                </Link>
              </Typography>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default VerifyAccount
