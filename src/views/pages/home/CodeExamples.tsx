/**
 * Componente para realizar una solicitud POST a una API utilizando FETCH.
 *
 * Pasos para realizar la solicitud:
 * 1. Iniciar sesión en el sistema utilizando el recurso {{amazon_ws}}/customer/authentication.
 *    - El cuerpo de la solicitud debe contener:
 *      {
 *        "email": "",
 *        "password": ""
 *      }
 * 2. Utilizar el idToken retornado por la API (NO el accessToken).
 * 3. Realizar la solicitud POST a la API deseada adjuntando el token de autorización y la x-api-key en el encabezado.
 */
import { useEffect, useState } from 'react'

import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import { useSession } from 'next-auth/react'
import { Prism } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
  email,
  password,
  eNCF
}: MakeApiRequestProps) => {
  const host = 'https://j8modo6at8.execute-api.us-east-1.amazonaws.com/TesteCF' //'https://ecf.api.mseller.app' // Reemplazar con la URL del entorno
  const loginUrl = `${host}/customer/authentication`
  const apiUrl = `${host}/documentos-ecf`

  // Datos de inicio de sesión
  const loginData = {
    email: email,
    password: password
  }

  try {
    // Iniciar sesión y obtener el idToken
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    if (!loginResponse.ok) {
      throw new Error('Error al iniciar sesión')
    }

    const loginResult = await loginResponse.json()
    const idToken = loginResult.idToken

    // Realizar la solicitud POST a la API deseada
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        'x-api-key': apiKey // Reemplazar con la x-api-key correspondiente
      },
      body: JSON.stringify({
        ECF: {
          Encabezado: {
            Version: '1.0',
            IdDoc: {
              TipoeCF: '31',
              eNCF: eNCF,
              FechaVencimientoSecuencia: '31-12-2026',
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
          FechaHoraFirma: '15-07-2023 05:07:00'
        }
      })
    })

    if (!apiResponse.ok) {
      throw new Error('Error en la solicitud a la API')
    }

    const apiResult = await apiResponse.json()

    console.log('Respuesta de la API:', apiResult)
  } catch (error) {
    console.error('Error:', error)
  }
}

export const CodeExamples = () => {
  const [value, setValue] = useState(0)
  const session = useSession() as any

  const [rncEmisor, setRncEmisor] = useState('12345678')
  const [razonSocialEmisor, setRazonSocialEmisor] = useState('Tu Negocio')
  const [direccionEmisor, setDireccionEmisor] = useState('DireccionEmisor1')
  const [fechaEmision, setFechaEmision] = useState('16-12-2024')
  const [apiKey, setApiKey] = useState('your-api-key')
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('')
  const [eNCF, setENCF] = useState('E310435300215')

  useEffect(() => {
    if (session.data) {
      setRncEmisor(session.data?.user.rnc || '130359334')
      setRazonSocialEmisor(session.data?.razonSocial || 'Tu Negocio')
      setEmail(session.data?.user?.email || 'Tu correo electrónico')
      setDireccionEmisor(session.data?.direccion || 'DireccionEmisor1')
    }
  }, [session.data])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant='contained'
        onClick={() =>
          makeApiRequest({ rncEmisor, razonSocialEmisor, direccionEmisor, fechaEmision, apiKey, email, password, eNCF })
        }
      >
        Probar conexión
      </Button>
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
          <SyntaxHighlighter language='javascript' style={materialDark}>
            {`const makeApiRequest = async (rncEmisor, razonSocialEmisor, direccionEmisor, fechaEmision, apiKey, email, password, eNCF) => {
  const host = 'https://ecf.api.mseller.app';
  const loginUrl = \`\${host}/customer/authentication\`;
  const apiUrl = \`\${host}/documentos-ecf\`;

  const loginData = {
    email: email,
    password: password
  };

  try {
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (!loginResponse.ok) {
      throw new Error('Error al iniciar sesión');
    }

    const loginResult = await loginResponse.json();
    const idToken = loginResult.idToken;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${idToken}\`,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        "ECF": {
          "Encabezado": {
            "Version": "1.0",
            "IdDoc": {
              "TipoeCF": "31",
              "eNCF": eNCF,
              "FechaVencimientoSecuencia": "31-12-2026",
              "IndicadorEnvioDiferido": "1",
              "IndicadorMontoGravado": "0",
              "TipoIngresos": "05",
              "TipoPago": "2",
              "FechaLimitePago": "07-08-2026",
              "TotalPaginas": 1
            },
            "Emisor": {
              "RNCEmisor": rncEmisor,
              "RazonSocialEmisor": razonSocialEmisor,
              "DireccionEmisor": direccionEmisor,
              "FechaEmision": fechaEmision
            },
            "Comprador": {
              "RNCComprador": "101023122",
              "RazonSocialComprador": "Cliente Prueba SRL"
            },
            "Totales": {
              "MontoGravadoTotal": 540.0,
              "MontoGravadoI1": 540.0,
              "MontoExento": 0,
              "ITBIS1": 18,
              "TotalITBIS": 97.20,
              "TotalITBIS1": 97.20,
              "MontoTotal": 637.20,
              "MontoNoFacturable": 0
            }
          },
          "DetallesItems": {
            "Item": {
              "NumeroLinea": "1",
              "IndicadorFacturacion": "1",
              "NombreItem": "Producto 1",
              "IndicadorBienoServicio": "1",
              "CantidadItem": 24,
              "UnidadMedida": "43",
              "PrecioUnitarioItem": 25.0,
              "DescuentoMonto": 60.0,
              "TablaSubDescuento": {
                "SubDescuento": {
                  "TipoSubDescuento": "%",
                  "SubDescuentoPorcentaje": 10.0,
                  "MontoSubDescuento": 60.0
                }
              },
              "MontoItem": 540.0
            }
          },
          "Paginacion": {
            "Pagina": {
              "PaginaNo": 1,
              "NoLineaDesde": 1,
              "NoLineaHasta": 1,
              "SubtotalMontoGravadoPagina": 540.0,
              "SubtotalMontoGravado1Pagina": 540.0,
              "SubtotalExentoPagina": 0,
              "SubtotalItbisPagina": 97.20,
              "SubtotalItbis1Pagina": 97.20,
              "MontoSubtotalPagina": 637.2,
              "SubtotalMontoNoFacturablePagina": 0
            }
          },
          "FechaHoraFirma": "15-07-2023 05:07:00"
        }
      })
    });

    if (!apiResponse.ok) {
      throw new Error('Error en la solicitud a la API');
    }

    const apiResult = await apiResponse.json();
    console.log('Respuesta de la API:', apiResult);
  } catch (error) {
    console.error('Error:', error);
  }
};`}
          </SyntaxHighlighter>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 3 }}>
          <SyntaxHighlighter language='csharp' style={materialDark}>
            {`using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ApiClient
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task MakeApiRequest(string rncEmisor, string razonSocialEmisor, string direccionEmisor, string fechaEmision, string apiKey, string email, string password, string eNCF)
    {
        var host = "https://ecf.api.mseller.app";
        var loginUrl = $"{host}/customer/authentication";
        var apiUrl = $"{host}/documentos-ecf";

        var loginData = new
        {
            email = email,
            password = password
        };

        try
        {
            var loginContent = new StringContent(JsonConvert.SerializeObject(loginData), Encoding.UTF8, "application/json");
            var loginResponse = await client.PostAsync(loginUrl, loginContent);

            if (!loginResponse.IsSuccessStatusCode)
            {
                throw new Exception("Error al iniciar sesión");
            }

            var loginResult = JsonConvert.DeserializeObject<dynamic>(await loginResponse.Content.ReadAsStringAsync());
            var idToken = loginResult.idToken;

            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", idToken);
            client.DefaultRequestHeaders.Add("x-api-key", apiKey);

            var apiContent = new StringContent(JsonConvert.SerializeObject(new
            {
                ECF = new
                {
                    Encabezado = new
                    {
                        Version = "1.0",
                        IdDoc = new
                        {
                            TipoeCF = "31",
                            eNCF = eNCF,
                            FechaVencimientoSecuencia = "31-12-2026",
                            IndicadorEnvioDiferido = "1",
                            IndicadorMontoGravado = "0",
                            TipoIngresos = "05",
                            TipoPago = "2",
                            FechaLimitePago = "07-08-2026",
                            TotalPaginas = 1
                        },
                        Emisor = new
                        {
                            RNCEmisor = rncEmisor,
                            RazonSocialEmisor = razonSocialEmisor,
                            DireccionEmisor = direccionEmisor,
                            FechaEmision = fechaEmision
                        },
                        Comprador = new
                        {
                            RNCComprador = "101023122",
                            RazonSocialComprador = "Cliente Prueba SRL"
                        },
                        Totales = new
                        {
                            MontoGravadoTotal = 540.0,
                            MontoGravadoI1 = 540.0,
                            MontoExento = 0,
                            ITBIS1 = 18,
                            TotalITBIS = 97.20,
                            TotalITBIS1 = 97.20,
                            MontoTotal = 637.20,
                            MontoNoFacturable = 0
                        }
                    },
                    DetallesItems = new
                    {
                        Item = new
                        {
                            NumeroLinea = "1",
                            IndicadorFacturacion = "1",
                            NombreItem = "Producto 1",
                            IndicadorBienoServicio = "1",
                            CantidadItem = 24,
                            UnidadMedida = "43",
                            PrecioUnitarioItem = 25.0,
                            DescuentoMonto = 60.0,
                            TablaSubDescuento = new
                            {
                                SubDescuento = new
                                {
                                    TipoSubDescuento = "%",
                                    SubDescuentoPorcentaje = 10.0,
                                    MontoSubDescuento = 60.0
                                }
                            },
                            MontoItem = 540.0
                        }
                    },
                    Paginacion = new
                    {
                        Pagina = new
                        {
                            PaginaNo = 1,
                            NoLineaDesde = 1,
                            NoLineaHasta = 1,
                            SubtotalMontoGravadoPagina = 540.0,
                            SubtotalMontoGravado1Pagina = 540.0,
                            SubtotalExentoPagina = 0,
                            SubtotalItbisPagina = 97.20,
                            SubtotalItbis1Pagina = 97.20,
                            MontoSubtotalPagina = 637.2,
                            SubtotalMontoNoFacturablePagina = 0
                        }
                    },
                    FechaHoraFirma = "15-07-2023 05:07:00"
                }
            }), Encoding.UTF8, "application/json");
            var apiResponse = await client.PostAsync(apiUrl, apiContent);

            if (!apiResponse.IsSuccessStatusCode)
            {
                throw new Exception("Error en la solicitud a la API");
            }

            var apiResult = JsonConvert.DeserializeObject<dynamic>(await apiResponse.Content.ReadAsStringAsync());
            Console.WriteLine("Respuesta de la API: " + apiResult);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}`}
          </SyntaxHighlighter>
        </Box>
      )}
      {value === 2 && (
        <Box sx={{ p: 3 }}>
          <SyntaxHighlighter language='bash' style={materialDark}>
            {`host="https://ecf.api.mseller.app"
login_url="\${host}/customer/authentication"
api_url="\${host}/documentos-ecf"

login_data='{
  "email": "'${email}'",
  "password": "'${password}'"
}'

login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "\${login_data}" "\${login_url}")
id_token=$(echo \${login_response} | jq -r '.idToken')

api_data='{
  "ECF": {
    "Encabezado": {
      "Version": "1.0",
      "IdDoc": {
        "TipoeCF": "31",
        "eNCF": "'${eNCF}'",
        "FechaVencimientoSecuencia": "31-12-2026",
        "IndicadorEnvioDiferido": "1",
        "IndicadorMontoGravado": "0",
        "TipoIngresos": "05",
        "TipoPago": "2",
        "FechaLimitePago": "07-08-2026",
        "TotalPaginas": 1
      },
      "Emisor": {
        "RNCEmisor": "'${rncEmisor}'",
        "RazonSocialEmisor": "'${razonSocialEmisor}'",
        "DireccionEmisor": "'${direccionEmisor}'",
        "FechaEmision": "'${fechaEmision}'"
      },
      "Comprador": {
        "RNCComprador": "101023122",
        "RazonSocialComprador": "Cliente Prueba SRL"
      },
      "Totales": {
        "MontoGravadoTotal": 540.0,
        "MontoGravadoI1": 540.0,
        "MontoExento": 0,
        "ITBIS1": 18,
        "TotalITBIS": 97.20,
        "TotalITBIS1": 97.20,
        "MontoTotal": 637.20,
        "MontoNoFacturable": 0
      }
    },
    "DetallesItems": {
      "Item": {
        "NumeroLinea": "1",
        "IndicadorFacturacion": "1",
        "NombreItem": "Producto 1",
        "IndicadorBienoServicio": "1",
        "CantidadItem": 24,
        "UnidadMedida": "43",
        "PrecioUnitarioItem": 25.0,
        "DescuentoMonto": 60.0,
        "TablaSubDescuento": {
          "SubDescuento": {
            "TipoSubDescuento": "%",
            "SubDescuentoPorcentaje": 10.0,
            "MontoSubDescuento": 60.0
          }
        },
        "MontoItem": 540.0
      }
    },
    "Paginacion": {
      "Pagina": {
        "PaginaNo": 1,
        "NoLineaDesde": 1,
        "NoLineaHasta": 1,
        "SubtotalMontoGravadoPagina": 540.0,
        "SubtotalMontoGravado1Pagina": 540.0,
        "SubtotalExentoPagina": 0,
        "SubtotalItbisPagina": 97.20,
        "SubtotalItbis1Pagina": 97.20,
        "MontoSubtotalPagina": 637.2,
        "SubtotalMontoNoFacturablePagina": 0
      }
    },
    "FechaHoraFirma": "15-07-2023 05:07:00"
  }
}'

api_response=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer \${id_token}" -H "x-api-key: \${apiKey}" -d "\${api_data}" "\${api_url}")

echo "Respuesta de la API: \${api_response}"`}
          </SyntaxHighlighter>
        </Box>
      )}
    </Box>
  )
}
