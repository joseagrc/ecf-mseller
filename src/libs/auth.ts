import type { NextAuthOptions, Profile as NextAuthProfile } from 'next-auth'
import NextAuth from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import CredentialProvider from 'next-auth/providers/credentials'

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
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return data
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
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

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login',
    error: '/error',
    verifyRequest: '/auth/verify'
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
    async jwt({ token, user, account }: any) {
      if (process.env.NODE_ENV === 'development') {
        console.log(token)
      }

      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.name = user.name
      }

      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = Date.now() + account.expires_in * 1000
        token.refreshTokenExpires = Date.now() + 30 * 24 * 60 * 60 * 1000 // ** 30 days
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.name = token.name
      }

      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.refreshToken = token.refreshToken as string
      session.user = {
        ...session.user,
        ...(token.userProfile || {})
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

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.COGNITO_ISSUER}/oauth2/token`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.COGNITO_CLIENT_ID!,
        client_secret: process.env.COGNITO_CLIENT_SECRET!
      })
    })

    console.log('response response response response ', response)

    const refreshedTokens = await response.json()

    console.log('response.status response.status response.status response.status ', response.status)

    if (response.status === 401) {
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

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      idToken: refreshedTokens.id_token ?? token.idToken,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
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

export default NextAuth(authOptions)
