'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import { toast } from 'react-toastify'

import { Grid, Link, styled, type BoxProps } from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import axiosClient from '@/utils/axiosClient'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports

type FileProp = {
  name: string
  type: string
  size: number
}

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

interface AddCertificateProps {
  callback?: () => void
}
const AddCertificate = (props: AddCertificateProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [expirationDate, setExpirationDate] = useState<Date | null | undefined>(null)

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/x-pkcs12': ['.p12']
    },
    onDrop: (acceptedFiles: File[], rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('Solo se permiten archivos .p12')

        return
      }

      // Only keep the latest file
      setFiles([acceptedFiles[0]])
      setError('')
    }
  })

  const renderFilePreview = () => {
    return <i className='mdi-certificate' style={{ fontSize: '20px' }} />
  }

  const handleRemoveFile = () => {
    setFiles([])
    setError('')
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async () => {
    if (!files[0] || !password) return

    setLoading(true)
    try {
      const base64 = await convertToBase64(files[0])

      const formattedDate = expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : null

      await axiosClient.post('/api/certificate', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          certificatePassword: password,
          expirationDate: formattedDate,
          certificate: {
            content: base64,
            filename: files[0].name
          }
        }
      })

      toast.success('Certificado agregado exitosamente')
      handleRemoveFile()
      setPassword('')
      setExpirationDate(null)

      if (props.callback) props.callback()
    } catch (err: any) {
      setError(err?.message)
      toast.error('Error al agregar el certificado')
    } finally {
      setLoading(false)
    }
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview()}</div>
        <Grid container spacing={4}>
          <Grid item sm={12}>
            <Typography className='file-name font-medium' color='text.primary'>
              {file.name}
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              type='password'
              label='Contraseña del certificado'
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              margin='normal'
              size='small'
              error={password.length === 0}
              helperText={password.length === 0 ? 'La contraseña es requerida' : ''}
            />
          </Grid>
          <Grid item>
            <AppReactDatepicker
              selected={expirationDate}
              placeholderText='DD-MM-YYYY'
              dateFormat={'dd-MM-yyyy'}
              onChange={(date: Date | null) => setExpirationDate(date)}
              customInput={<TextField margin='normal' size='small' fullWidth label='Fecha de vencimiento' />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' color='text.secondary'>
              Nota: La fecha de vencimiento es opcional, solo se utilizará para notificar a los clientes de cuando se
              aproxima el vencimiento del certificado.
            </Typography>
          </Grid>
        </Grid>
      </div>
      <IconButton onClick={() => handleRemoveFile()}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <>
      <Dropzone>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='flex items-center flex-col gap-2 text-center'>
            <CustomAvatar variant='rounded' skin='light' color='secondary'>
              <i className='ri-upload-2-line' />
            </CustomAvatar>
            <Typography variant='h4'>Arrastre su certificado .p12 aquí</Typography>
            <Typography color='text.disabled'>ó</Typography>
            <Button variant='outlined' size='small'>
              Buscar Certificado
            </Button>
          </div>
        </div>
        {files.length ? (
          <>
            <List>{fileList}</List>
            <div className='buttons'>
              <Button variant='contained' onClick={handleSubmit} disabled={!password || loading}>
                {loading ? 'Procesando...' : 'Subir Certificado'}
              </Button>
            </div>
          </>
        ) : null}
        {error && (
          <Typography color='error' variant='body2'>
            {error}
          </Typography>
        )}
      </Dropzone>
      <Typography variant='body2' color='text.secondary' sx={{ mt: 4 }}>
        Nota: Su certificado digital se alojará en un almacenamiento seguro e encriptado y no se compartirá con
        terceros, al igual que la contraseña de su certificado digital será guardada utilizando el mecanismo de
        inscripción de la plataforma.{' '}
        <Link href='https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html' target='_blank'>
          Leer Más
        </Link>
      </Typography>
    </>
  )
}

export default AddCertificate
