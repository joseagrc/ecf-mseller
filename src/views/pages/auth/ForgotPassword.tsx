'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'

// MUI Imports
import { useRouter } from 'next/navigation'

import { Alert, LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import * as yup from 'yup'

import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

const schema = yup
  .object({
    email: yup.string().email('Por favor ingrese un email válido').required('El email es requerido')
  })
  .required()

type ForgotPasswordForm = yup.InferType<typeof schema>

const ForgotPasswordV2 = ({ mode }: { mode: Mode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true)
      setError('')

      await axios.post('/api/auth/forgot-password', {
        email: data.email
      })

      setSuccess(true)
      toast.success('Código de seguridad enviado a su email')
      router.push(`/change-password?email=${data.email}`)
    } catch (err) {
      setError('No se pudo enviar el correo. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-forgot-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-forgot-password-light-border.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { settings } = useSettings()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href={'/'} className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Olvidó su contraseña 🔒</Typography>
            <Typography className='mbs-1'>
              Ingrese su email y le enviaremos las instrucciones para restablecer su contraseña
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              <TextField
                fullWidth
                label='Email'
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />

              <LoadingButton fullWidth type='submit' variant='contained' loading={isLoading}>
                Enviar enlace
              </LoadingButton>

              {error && <Alert severity='error'>{error}</Alert>}

              {success && <Alert severity='success'>Instrucciones enviadas a su email</Alert>}
            </div>
          </form>

          <Typography className='text-center'>
            <Link href='/login'>
              <span>Volver al login</span>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordV2
