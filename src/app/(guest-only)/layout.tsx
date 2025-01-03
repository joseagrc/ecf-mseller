// Type Imports
import type { ChildrenType } from '@core/types'
import { getSystemMode } from '@core/utils/serverHelpers'

// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'
import Providers from '@/components/Providers'
import BlankLayout from '@/@layouts/BlankLayout'

const Layout = ({ children }: ChildrenType) => {
  const systemMode = getSystemMode()

  return (
    <Providers direction={'ltr'}>
      <BlankLayout systemMode={systemMode}>
        <GuestOnlyRoute>{children}</GuestOnlyRoute>
      </BlankLayout>
    </Providers>
  )
}

export default Layout
