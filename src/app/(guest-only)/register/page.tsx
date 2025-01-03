// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Register from '@views/pages/auth/register-multi-steps'

// Server Action Imports
//import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crear una cuenta nueva para el envío de eCF DGII'
}

const RegisterPage = () => {
  // Vars
  //const mode = getServerMode()

  return <Register />
}

export default RegisterPage
