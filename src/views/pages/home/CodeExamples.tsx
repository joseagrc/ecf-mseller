import { useEffect, useState } from 'react'

import { LoadingButton } from '@mui/lab'
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Stack, Typography } from '@mui/material'
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
}
const makeApiRequest = async ({
  rncEmisor,
  razonSocialEmisor,
  direccionEmisor,
  fechaEmision,
  apiKey,
  eNCF
}: MakeApiRequestProps) => {
  const host = '/api/communication'

  try {
    // Realizar la solicitud POST a la API deseada
    const apiResponse = await fetch(host, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey // Reemplazar con la x-api-key correspondiente
      },
      body: JSON.stringify({
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
      })
    })

    if (apiResponse.status === 401) {
      throw new Error('Error al iniciar sesión')
    }

    if (apiResponse.status === 403) {
      throw new Error('Api Key no válida ó incorrecta, por favor verifique la Api Key')
    }

    if (!apiResponse.ok) {
      const data = await apiResponse.json()

      throw new Error(data.message || 'Error en la solicitud a la API')
    }

    const apiResult = await apiResponse.json()

    console.log('Respuesta de la API:', apiResult)
    toast.success('eCF enviado correctamente')

    return apiResult
  } catch (error: any) {
    console.error('Error:', error)
    toast.error(error?.message || 'Error al realizar la solicitud a la API')
  }
}

export const CodeExamples = () => {
  const [value, setValue] = useState(0)
  const session = useSession() as any

  const [rncEmisor, setRncEmisor] = useState('12345678')
  const [razonSocialEmisor, setRazonSocialEmisor] = useState('Tu Negocio')
  const [direccionEmisor, setDireccionEmisor] = useState('DireccionEmisor1')

  const getTodayDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}-${month}-${year}`
  }
  const [fechaEmision, setFechaEmision] = useState(getTodayDate())
  const [apiKey, setApiKey] = useState('your-api-key')
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('')

  //const [eNCF, setENCF] = useState('E310435300215')
  const generateRandomENCF = () => {
    const prefix = 'E31'
    const randomNumbers = Math.random().toString().slice(2, 12)

    return `${prefix}${randomNumbers}`
  }

  const [eNCF, setENCF] = useState(generateRandomENCF())

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const apiKeyStore = useSelector((state: RootState) => state.apiKeyReducer)

  useEffect(() => {
    if (apiKeyStore.apiKeys.length === 0) {
      dispatch(getApiKeys())
    } else {
      setApiKey(apiKeyStore?.apiKeys?.[0]?.value)
    }
  }, [apiKeyStore, dispatch])

  useEffect(() => {
    if (session.data) {
      setRncEmisor(session.data?.user.rnc || '130359334')
      setRazonSocialEmisor(session.data?.user.businessName || 'Tu Negocio')
      setEmail(session.data?.user?.email || 'Tu correo electrónico')
      setDireccionEmisor(session.data?.direccion || 'DireccionEmisor1')
    }
  }, [session.data])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await makeApiRequest({
        rncEmisor,
        razonSocialEmisor,
        direccionEmisor,
        fechaEmision,
        apiKey,
        email,
        password,
        eNCF
      })

      console.log('Result:', result)
      setResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant='h5'> Entornos </Typography>
        <Typography variant='caption' sx={{ pt: 2 }}>
          Utilice uno de estos entornos, estos entornos son los mismos que deben ser colocados durante la certificación{' '}
        </Typography>
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
              value={rncEmisor}
              onChange={e => setRncEmisor(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Razon Social Emisor'
              value={razonSocialEmisor}
              onChange={e => setRazonSocialEmisor(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Direccion Emisor'
              value={direccionEmisor}
              onChange={e => setDireccionEmisor(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Fecha Emision'
              value={fechaEmision}
              onChange={e => setFechaEmision(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='API Key'
              value={apiKey}
              disabled={apiKeyStore.isLoading}
              onChange={e => setApiKey(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='Email' value={email} onChange={e => setEmail(e.target.value)} fullWidth margin='normal' />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label='eNCF' value={eNCF} onChange={e => setENCF(e.target.value)} fullWidth margin='normal' />
          </Grid>
        </Grid>
      </Box>
      {value === 0 && (
        <Box sx={{ p: 3 }}>
          <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SyntaxHighlighter language='javascript' style={materialDark}>
                {jscode(email, password, eNCF, rncEmisor, razonSocialEmisor, direccionEmisor, fechaEmision, apiKey)}
              </SyntaxHighlighter>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 3 }}>
          <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SyntaxHighlighter language='csharp' style={materialDark}>
                {ccode}
              </SyntaxHighlighter>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      {value === 2 && (
        <Box sx={{ p: 3 }}>
          <Accordion defaultExpanded={false}>
            <AccordionSummary
              expandIcon={<i className='ri-arrow-up-s-line' />}
              aria-controls='code-content'
              id='code-header'
            >
              <Typography>Ver código de ejemplo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SyntaxHighlighter language='bash' style={materialDark}>
                {bash(email, password, eNCF, rncEmisor, razonSocialEmisor, direccionEmisor, fechaEmision, apiKey)}
              </SyntaxHighlighter>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      <Stack spacing={2} direction='row' justifyContent='center' style={{ margin: '20px' }}>
        <LoadingButton
          variant='contained'
          onClick={handleTestConnection}
          disabled={loading}
          loading={loading || apiKeyStore.isLoading}
        >
          {loading ? 'Enviando eCF...' : 'Enviar eCF de prueba'}
        </LoadingButton>
      </Stack>

      {loading && <CircularProgress size={24} />}

      {response && (
        <SyntaxHighlighter language='json' style={materialDark}>
          {response}
        </SyntaxHighlighter>
      )}
    </Box>
  )
}
