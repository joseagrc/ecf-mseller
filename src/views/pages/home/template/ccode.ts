export const ccode = (
  email: string,
  password: string,
  eNCF: string,
  rncEmisor: string,
  razonSocialEmisor: string,
  direccionEmisor: string,
  fechaEmision: string,
  apiKey: string
) => `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ApiClient
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task MakeApiRequest()
    {
        var environment = "TesteCF"; // Cambiar a "TesteCF" o "CerteCF" ó "eCF"
        var host = $"https://ecf.api.mseller.app/{environment}";
        var loginUrl = $"{host}/customer/authentication";
        var apiUrl = $"{host}/documentos-ecf";

        var loginData = new
        {
            email = "${email}",
            password = "${password}"
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
            client.DefaultRequestHeaders.Add("x-api-key", "${apiKey}");

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
                            eNCF = "${eNCF}",
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
                            RNCEmisor = "${rncEmisor}",
                            RazonSocialEmisor = "${razonSocialEmisor}",
                            DireccionEmisor = "${direccionEmisor}",
                            FechaEmision = "${fechaEmision}"
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
}`
