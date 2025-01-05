'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import type { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

// Styled Dropzone Component
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

const AddCertificate = () => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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

      const response = await fetch('/api/add-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          certificatePassword: password,
          certificate: {
            content: base64,
            filename: files[0].name
          }
        })
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      toast.success('Certificado agregado exitosamente')
      handleRemoveFile()
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
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
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
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile()}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <Dropzone>
      <Card>
        <CardHeader title='Cargar Certificado' sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }} />
        <CardContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            Si no posee un certificado digital válido, puede solicitarlo en línea a través de{' '}
            <Link
              href='https://www.camarasantodomingo.do/solicitudes/FormularioWeb/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Cámara de Comercio de Santo Domingo
            </Link>
          </Typography>

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
                <Button color='error' variant='outlined'>
                  Remove All
                </Button>
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
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default AddCertificate
