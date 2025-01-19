import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { jwtDecode } from 'jwt-decode' // Import jwt-decode library
import type { NextAuthOptions, Profile as NextAuthProfile } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import CredentialProvider from 'next-auth/providers/credentials'

import { calculateSecretHash } from '@/utils/calculateSecretHash'

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

export interface CognitoJwtPayload {
  sub: string
  'cognito:groups'?: string[]
  iss: string
  'cognito:username': string
  'custom:secretId'?: string
  origin_jti: string
  aud: string
  'custom:rnc'?: string
  'custom:plan'?: string
  'custom:businessName'?: string
  event_id: string
  token_use: string
  auth_time: number
  exp: number
  iat: number
  jti: string
  email: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
  name?: string
}

export interface Profile extends NextAuthProfile {
  'custom:rnc'?: string
  'custom:businessName'?: string
  'custom:plan'?: string
}

const authenticateUser = async (email: string, password: string) => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
  })

  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: calculateSecretHash(email)
    }
  }

  try {
    const command = new InitiateAuthCommand(params)
    const response = await client.send(command)

    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken
    }
  } catch (error) {
    throw new Error('Authentication failed')
  }
}

export const getUserAttributes = async (accessToken: string): Promise<Record<string, string>> => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION
  })

  const command = new GetUserCommand({
    AccessToken: accessToken
  })

  try {
    const response = await client.send(command)

    return (
      response.UserAttributes?.reduce(
        (acc, attr) => {
          if (attr.Name && attr.Value) {
            acc[attr.Name] = attr.Value
          }

          return acc
        },
        {} as Record<string, string>
      ) || {}
    )
  } catch (error) {
    console.error('Error getting user attributes:', error)
    throw error
  }
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
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          scope: 'openid email profile',
          response_type: 'code'
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
  try {
    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION
    })
    const decodedInfo = getUserFromToken(token, token.email || '')
    const hash = calculateSecretHash(decodedInfo.userProfile.username || '')

    const params = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: token.refreshToken,
        SECRET_HASH: hash
      }
    }

    const command = new InitiateAuthCommand(params)
    const response = await client.send(command)

    const refreshedTokens = await response.AuthenticationResult

    if (response?.['$metadata'].httpStatusCode === 401) {
      console.error('BadRequest or Unauthorized error:', refreshedTokens)

      return {
        ...token,
        error: 'RefreshAccessTokenError',
        accessToken: null,
        accessTokenExpires: 0,
        idToken: null,
        refreshToken: null,
        userProfile: null
      }
    }

    if (response?.['$metadata']?.httpStatusCode !== 200) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens?.AccessToken,
      accessTokenExpires: Date.now() + (refreshedTokens?.ExpiresIn || 1) * 1000,
      idToken: refreshedTokens?.IdToken ?? token.idToken,
      refreshToken: token.refreshToken,
      userProfile: token.userProfile // ** Retain userProfile information
    }
  } catch (error) {
    console.error('Error refreshing access token', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',

      errorMessage: error || 'The server did not understand the operation that was requested.'
    }
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
  const decodedToken = jwtDecode(authResult.idToken) as CognitoJwtPayload

  return {
    id: email || '',
    email: email,
    expires: decodedToken.exp,
    name: decodedToken?.given_name + ' ' + decodedToken?.family_name || email,
    accessToken: authResult.accessToken,
    idToken: authResult.idToken,
    refreshToken: authResult.refreshToken,
    userProfile: {
      username: decodedToken['cognito:username'],
      givenName: decodedToken?.given_name,
      familyName: decodedToken?.family_name,
      email: decodedToken?.email,
      rnc: decodedToken['custom:rnc'] || '',
      businessName: decodedToken['custom:businessName'],
      plan: decodedToken['custom:plan'],
      verified: decodedToken.email_verified
    }
  }
}
