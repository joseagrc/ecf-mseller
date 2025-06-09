import type { NextAuthOptions, Profile as NextAuthProfile } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

// Authentication can be implemented against any service. The helper below
// performs a POST request to `AUTH_API_URL` which should validate the
// credentials and return user tokens.
const authenticateUser = async (email: string, password: string) => {
  const response = await fetch(`${process.env.AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    throw new Error('Authentication failed')
  }

  return response.json()
}

export interface UserProfile {
  givenName: string
  familyName: string
  email: string
  rnc: string
  businessName: string
  plan: string
  verified: boolean
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    idToken?: string
    refreshToken?: string
  }
}


export interface Profile extends NextAuthProfile {
  'custom:rnc'?: string
  'custom:businessName'?: string
  'custom:plan'?: string
}

// Placeholder helper when no external user store is available. Adjust this
// function to integrate with your own user management system.
export const getUserAttributes = async (): Promise<Record<string, string>> => {
  return {}
}

export const authOptions: NextAuthOptions = {
  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password } = credentials as { email: string; password: string }

        try {
          const authResult = await authenticateUser(email, password)

          if (!authResult.idToken) {
            throw new Error('Invalid ID token')
          }

          return getUserFromToken(authResult, email)
        } catch (error) {
          throw new Error('Invalid credentials')
        }
      }
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 1 * 60 * 60, // ** 1 hour
    updateAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async signIn({ user, account }) {
      if (account?.error === 'PasswordResetRequiredException') {
        return `/auth/verify?email=${encodeURIComponent(user.email ?? '')}`
      }

      return true
    },
    async jwt({ token, user, session }: any) {
      if (process.env.NODE_ENV === 'development') {
        console.log('TOKEN VALUE', { token, user, session })
      }

      if (user) {
        token.name = user.name // Ensure name is set from user
      }

      //account is define when user is logged in one time
      if (user) {
        token.accessToken = user.accessToken
        token.idToken = user.idToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = Date.now() + user.expires * 1000
        token.refreshTokenExpires = Date.now() + 30 * 24 * 60 * 60 * 1000 // ** 30 days

        // Decode idToken to get user information
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)

      //return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name // Ensure name is set from token
      }

      const decodedInfo = getUserFromToken(token, session?.user?.email || '')

      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.refreshToken = token.refreshToken as string
      session.user = {
        ...session.user,
        ...decodedInfo.userProfile
      }

      
return session
    }
  },
  events: {
    signIn: async message => {
      console.log('NextAuth SignIn Event:', message)
    }
  }
}

export async function refreshAccessToken(token: any) {
  // In a custom authentication system you should refresh the session here.
  // This stub simply extends the expiry time.
  return {
    ...token,
    accessTokenExpires: Date.now() + 60 * 60 * 1000
  }
}

interface AuthUser {
  id: string
  email?: string
  expires: number
  name?: string
  accessToken: string | undefined
  idToken: string | undefined
  refreshToken: string | undefined
  userProfile: {
    username?: string
    givenName?: string
    familyName?: string
    email?: string
    rnc: string
    businessName?: string
    plan?: string
    verified?: boolean
  }
}

const getUserFromToken = (authResult: any, email?: string): AuthUser => {
  const decodedToken: any = authResult

  return {
    id: email || '',
    email: email,
    expires: decodedToken.expires || Math.floor(Date.now() / 1000) + 60 * 60,
    name: decodedToken?.givenName ? `${decodedToken.givenName} ${decodedToken.familyName}` : email,
    accessToken: authResult.accessToken,
    idToken: authResult.idToken,
    refreshToken: authResult.refreshToken,
    userProfile: {
      username: decodedToken.username || email,
      givenName: decodedToken.givenName,
      familyName: decodedToken.familyName,
      email: decodedToken.email || email,
      rnc: decodedToken.rnc || '',
      businessName: decodedToken.businessName,
      plan: decodedToken.plan,
      verified: decodedToken.verified
    }
  }
}
