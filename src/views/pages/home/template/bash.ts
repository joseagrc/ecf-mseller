export const bash = (
  email: string,
  password: string,
  eNCF: string,
  rncEmisor: string,
  razonSocialEmisor: string,
  direccionEmisor: string,
  fechaEmision: string,
  apiKey: string
) => `host="https://ecf.api.mseller.app"
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

api_response=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer \${id_token}" -H "x-api-key: ${apiKey}" -d "\${api_data}" "\${api_url}")

echo "Respuesta de la API: \${api_response}"`
