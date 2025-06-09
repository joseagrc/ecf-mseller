// Component Imports
import ChangePassword from '@views/pages/auth/ChangePassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const VerifyAccount = async () => {
  // Vars
  const mode = await getServerMode()

  return <ChangePassword mode={mode} />
}

export default VerifyAccount
