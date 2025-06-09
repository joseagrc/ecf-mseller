// Component Imports
import VerifyAccountView from '@views/pages/auth/VerifyAccount'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const VerifyAccount = async () => {
  // Vars
  const mode = await getServerMode()

  return <VerifyAccountView mode={mode} />
}

export default VerifyAccount
