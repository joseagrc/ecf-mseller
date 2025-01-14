// Component Imports
import ChangePassword from '@views/pages/auth/ChangePassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const VerifyAccount = () => {
  // Vars
  const mode = getServerMode()

  return <ChangePassword mode={mode} />
}

export default VerifyAccount
