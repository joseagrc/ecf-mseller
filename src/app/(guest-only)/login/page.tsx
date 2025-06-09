// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/pages/auth/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Login | eCF MSeller',
  description: 'Login to your account | Tu plataforma de Facturación Electrónica  DGII República Dominicana'
}

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
