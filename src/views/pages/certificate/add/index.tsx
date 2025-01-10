'use client'

// React Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// Third-party Imports

// Component Imports

// Styled Component Imports
import AddCertificate from './AddCertificate'

// Styled Dropzone Component

const CertificateLayout = () => {
  return (
    <div>
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

          <AddCertificate />
        </CardContent>
      </Card>
    </div>
  )
}

export default CertificateLayout
