// Third-party Imports
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth' // Import authOptions to use in getServerSession

import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children }: ChildrenType) {
  const session = (await getServerSession(authOptions)) as any // Pass authOptions to getServerSession

  return <>{session ? children : <AuthRedirect />}</>
}
