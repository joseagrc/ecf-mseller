export const jscode = (
  email: string,
  password: string,
  eNCF: string,
  rncEmisor: string,
  razonSocialEmisor: string,
  direccionEmisor: string,
  fechaEmision: string,
  apiKey: string
) => `
const makeApiRequest = async () => {
  const host = 'https://ecf.api.mseller.app';
  const loginUrl = \`\${host}/customer/authentication\`;
  const apiUrl = \`\${host}/documentos-ecf\`;

  const loginData = {
    email: '${email}',
    password: '${password}'
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
        'x-api-key': '${apiKey}'
      },
      body: JSON.stringify({
        "ECF": {
          "Encabezado": {
            "Version": "1.0",
            "IdDoc": {
              "TipoeCF": "31",
              "eNCF": "${eNCF}",
              "FechaVencimientoSecuencia": "31-12-2026",
              "IndicadorEnvioDiferido": "1",
              "IndicadorMontoGravado": "0",
              "TipoIngresos": "05",
              "TipoPago": "2",
              "FechaLimitePago": "07-08-2026",
              "TotalPaginas": 1
            },
            "Emisor": {
              "RNCEmisor": "${rncEmisor}",
              "RazonSocialEmisor": "${razonSocialEmisor}",
              "DireccionEmisor": "${direccionEmisor}",
              "FechaEmision": "${fechaEmision}"
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
          "FechaHoraFirma": ""
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
};`
