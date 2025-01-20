'use client'
import { useEffect, useState } from 'react'

import { LoadingButton } from '@mui/lab'
import type { SelectChangeEvent } from '@mui/material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { Prism } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'react-toastify'

import type { AppDispatch, RootState } from '@/redux-store'
import { getApiKeys } from '@/redux-store/slices/apiKeySlice'
import axiosClient from '@/utils/axiosClient'
import { environments } from '@/utils/environments'
import { bash } from './template/bash'
import { ccode } from './template/ccode'
import { jscode } from './template/jscode'

const SyntaxHighlighter = Prism as any

interface MakeApiRequestProps {
  rncEmisor: string
  razonSocialEmisor: string
  direccionEmisor: string
  fechaEmision: string
  apiKey: string
  email: string
  password: string
  eNCF: string
  environment: string
}
const makeApiRequest = async ({
  rncEmisor,
  razonSocialEmisor,
  direccionEmisor,
  fechaEmision,
  apiKey,
  eNCF,
  environment
}: MakeApiRequestProps) => {
  const host = '/api/communication'

  try {
    const payload = {
      ECF: {
        Encabezado: {
          Version: '1.0',
          IdDoc: {
            TipoeCF: '31',
            eNCF: eNCF,
            FechaVencimientoSecuencia: '31-12-2025',
            IndicadorEnvioDiferido: '1',
            IndicadorMontoGravado: '0',
            TipoIngresos: '05',
            TipoPago: '2',
            FechaLimitePago: '07-08-2026',
            TotalPaginas: 1
          },
          Emisor: {
            RNCEmisor: rncEmisor,
            RazonSocialEmisor: razonSocialEmisor,
            DireccionEmisor: direccionEmisor,
            FechaEmision: fechaEmision
          },
          Comprador: {
            RNCComprador: '101023122',
            RazonSocialComprador: 'Cliente Prueba SRL'
          },
          Totales: {
            MontoGravadoTotal: 540.0,
            MontoGravadoI1: 540.0,
            MontoExento: 0,
            ITBIS1: 18,
            TotalITBIS: 97.2,
            TotalITBIS1: 97.2,
            MontoTotal: 637.2,
            MontoNoFacturable: 0
          }
        },
        DetallesItems: {
          Item: {
            NumeroLinea: '1',
            IndicadorFacturacion: '1',
            NombreItem: 'Producto 1',
            IndicadorBienoServicio: '1',
            CantidadItem: 24,
            UnidadMedida: '43',
            PrecioUnitarioItem: 25.0,
            DescuentoMonto: 60.0,
            TablaSubDescuento: {
              SubDescuento: {
                TipoSubDescuento: '%',
                SubDescuentoPorcentaje: 10.0,
                MontoSubDescuento: 60.0
              }
            },
            MontoItem: 540.0
          }
        },
        Paginacion: {
          Pagina: {
            PaginaNo: 1,
            NoLineaDesde: 1,
            NoLineaHasta: 1,
            SubtotalMontoGravadoPagina: 540.0,
            SubtotalMontoGravado1Pagina: 540.0,
            SubtotalExentoPagina: 0,
            SubtotalItbisPagina: 97.2,
            SubtotalItbis1Pagina: 97.2,
            MontoSubtotalPagina: 637.2,
            SubtotalMontoNoFacturablePagina: 0
          }
        },
        FechaHoraFirma: '17-01-2025 05:07:00' //getCurrentFormattedDateTime()
      }
    }

    // Realizar la solicitud POST a la API deseada
    const apiResponse = await axiosClient.post(host, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Reemplazar con la x-api-key correspondiente
        'x-env-name': environment
      }
    })

    if (apiResponse.status === 401) {
      throw new Error('Error al iniciar sesión')
    }

    if (apiResponse.status === 403) {
      throw new Error('Api Key no válida ó incorrecta, por favor verifique la Api Key')
    }

    if (apiResponse.status !== 200) {
      const data = await apiResponse.data

      throw new Error(data.message || 'Error en la solicitud a la API')
    }

    const apiResult = apiResponse.data

    console.log('Respuesta de la API:', apiResult)
    toast.success('eCF enviado correctamente')

    return apiResult
  } catch (error: any) {
    console.error('Error:', error)

    if (error?.response?.data?.message.includes('Invalid password?')) {
      toast.error('La clave del certificado es inválida')
    } else if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message || 'Error al realizar la solicitud a la API')
    } else {
      toast.error(error?.message || 'Error al realizar la solicitud a la API')
    }
  }
}

interface FormValues {
  email: string
  password: string
  eNCF: string
  rncEmisor: string
  razonSocialEmisor: string
  direccionEmisor: string
  fechaEmision: string
  apiKey: string
  environment: string
}

export const CodeExamples = () => {
  const [value, setValue] = useState(0)
  const session = useSession() as any

  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    eNCF: '',
    rncEmisor: '',
    razonSocialEmisor: '',
    direccionEmisor: '',
    fechaEmision: '',
    apiKey: '',
    environment: 'TesteCF'
  })

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const getTodayDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}-${month}-${year}`
  }

  //const [eNCF, setENCF] = useState('E310435300215')
  const generateRandomENCF = () => {
    const prefix = 'E31'
    const randomNumbers = Math.random().toString().slice(2, 12)

    return `${prefix}${randomNumbers}`
  }

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [apiRequested, setApiRequested] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const apiKeyStore = useSelector((state: RootState) => state.apiKeyReducer)

  useEffect(() => {
    if (apiKeyStore.apiKeys.length === 0 && !apiRequested) {
      dispatch(getApiKeys())
      setApiRequested(true)
    } else {
      if (apiKeyStore?.apiKeys?.[0]?.value) {
        setFormValues(prev => ({
          ...prev,
          apiKey: apiKeyStore?.apiKeys?.[0]?.value
        }))
      }
    }
  }, [apiKeyStore, dispatch])

  useEffect(() => {
    if (session.data) {
      setFormValues(prev => ({
        ...prev,
        rncEmisor: session.data?.user.rnc || '130359334',
        razonSocialEmisor: session.data?.user.businessName || 'Tu Negocio',
        email: session.data?.user?.email || 'Tu correo electrónico',
        direccionEmisor: session.data?.direccion || 'DireccionEmisor1',
        fechaEmision: getTodayDate(),
        eNCF: generateRandomENCF()
      }))
    }
  }, [session.data])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await makeApiRequest({
        rncEmisor: formValues.rncEmisor,
        razonSocialEmisor: formValues.razonSocialEmisor,
        direccionEmisor: formValues.direccionEmisor,
        fechaEmision: formValues.fechaEmision,
        apiKey: formValues.apiKey,
        email: formValues.email,
        password: formValues.password,
        eNCF: formValues.eNCF,
        environment: formValues.environment
      })

      console.log('Result:', result)
      setResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const [expanded, setExpanded] = useState<boolean>(false)

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Box>
          <Typography variant='h5'> Entornos </Typography>
          <Typography variant='caption' sx={{ pt: 2 }}>
            Utilice uno de estos entornos, estos entornos son los mismos que deben ser colocados durante la
            certificación{' '}
          </Typography>
        </Box>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant='h6' sx={{ pt: 2 }}>
              {' '}
              Prueba{' '}
            </Typography>
            <code>https://ecf.api.mseller.app/TesteCF</code>
            <Typography variant='h6' sx={{ pt: 2 }}>
              {' '}
              Certificación{' '}
            </Typography>
            <code>https://ecf.api.mseller.app/CerteCF</code>
            <Typography variant='h6' sx={{ pt: 2 }}>
              {' '}
              Producción{' '}
            </Typography>
            <code>https://ecf.api.mseller.app/eCF</code>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant='h6' sx={{ pt: 2 }}>
              Envío de todos los documentos eCF | POST
            </Typography>
            <Typography variant='caption' sx={{ pt: 2 }}>
              Puede enviar los documentos eCF a través de este recurso incluyendo E32 menores o mayores a 250K
            </Typography>
            <code>host/{`{entorno}`}/documentos-ecf</code>
            <Typography variant='h6' sx={{ pt: 2 }}>
              Consultar comprobante | GET
            </Typography>
            <code>
              host/{`{entorno}`}/documentos-ecf?ecf={'{No. comprobante electrónico}'}
            </code>
          </Box>
        </Grid>
      </Grid>
      <Tabs value={value} onChange={handleChange} aria-label='code examples'>
        <Tab label='JavaScript' />
        <Tab label='C#' />
        <Tab label='cURL' />
      </Tabs>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label='RNC Emisor'
              value={formValues.rncEmisor}
              onChange={handleInputChange('rncEmisor')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Razon Social Emisor'
              value={formValues.razonSocialEmisor}
              onChange={handleInputChange('razonSocialEmisor')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Direccion Emisor'
              value={formValues.direccionEmisor}
              onChange={handleInputChange('direccionEmisor')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Fecha Emision'
              value={formValues.fechaEmision}
              onChange={handleInputChange('fechaEmision')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='API Key'
              value={formValues.apiKey}
              disabled={apiKeyStore.isLoading}
              onChange={handleInputChange('apiKey')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Email'
              value={formValues.email}
              onChange={handleInputChange('email')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Password'
              type='password'
              value={formValues.password}
              onChange={handleInputChange('password')}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='eNCF'
              value={formValues.eNCF}
              onChange={handleInputChange('eNCF')}
              fullWidth
              margin='normal'
            />
          </Grid>
        </Grid>
      </Box>
      {value === 0 && (
        <Box sx={{ p: 3 }}>
          <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            {expanded && (
              <AccordionDetails>
                <SyntaxHighlighter language='javascript' style={materialDark}>
                  {jscode(
                    formValues.email,
                    formValues.password,
                    formValues.eNCF,
                    formValues.rncEmisor,
                    formValues.razonSocialEmisor,
                    formValues.direccionEmisor,
                    formValues.fechaEmision,
                    formValues.apiKey
                  )}
                </SyntaxHighlighter>
              </AccordionDetails>
            )}
          </Accordion>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 3 }}>
          <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            {expanded && (
              <AccordionDetails>
                <SyntaxHighlighter language='csharp' style={materialDark}>
                  {ccode(
                    formValues.email,
                    formValues.password,
                    formValues.eNCF,
                    formValues.rncEmisor,
                    formValues.razonSocialEmisor,
                    formValues.direccionEmisor,
                    formValues.fechaEmision,
                    formValues.apiKey
                  )}
                </SyntaxHighlighter>
              </AccordionDetails>
            )}
          </Accordion>
        </Box>
      )}
      {value === 2 && (
        <Box sx={{ p: 3 }}>
          <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            {expanded && (
              <AccordionDetails>
                <SyntaxHighlighter language='bash' style={materialDark}>
                  {bash(
                    formValues.email,
                    formValues.password,
                    formValues.eNCF,
                    formValues.rncEmisor,
                    formValues.razonSocialEmisor,
                    formValues.direccionEmisor,
                    formValues.fechaEmision,
                    formValues.apiKey
                  )}
                </SyntaxHighlighter>
              </AccordionDetails>
            )}
          </Accordion>
        </Box>
      )}
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Entorno</InputLabel>
            <Select
              value={formValues.environment}
              onChange={(event: SelectChangeEvent<string>) => {
                setFormValues(prev => ({
                  ...prev,
                  environment: event.target.value
                }))
              }}
              label='Entorno'
            >
              {environments.map(env => (
                <MenuItem key={env.value} value={env.value}>
                  {env.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LoadingButton
            variant='contained'
            onClick={handleTestConnection}
            disabled={loading}
            loading={loading || apiKeyStore.isLoading}
            fullWidth
            sx={{ height: '56px' }}
          >
            {loading ? 'Enviando eCF...' : 'Enviar eCF de prueba'}
          </LoadingButton>
        </Grid>
        <Stack spacing={2} direction='row' justifyContent='center' style={{ margin: '20px' }}>
          {loading && <CircularProgress size={24} />}
        </Stack>
      </Grid>
      {response && (
        <SyntaxHighlighter language='json' style={materialDark}>
          {response}
        </SyntaxHighlighter>
      )}
    </Box>
  )
}
