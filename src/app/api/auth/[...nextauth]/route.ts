import NextAuth from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
      issuer: process.env.COGNITO_ISSUER || '',
      authorization: {
        params: {
          scope: 'openid email profile aws.cognito.signin.user.admin',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: any; account: any; profile?: any }) {
      console.log('JWT Callback - Account:', account)
      console.log('JWT Callback - profile:', profile)

      if (account && profile) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.userProfile = {
          givenName: profile.given_name,
          familyName: profile.family_name,
          email: profile.email,
          rnc: profile['custom:rnc'],
          businessName: profile['custom:businessName'],
          plan: profile['custom:plan']
        }
      }

      return token
    },
    async session({ session, token }: any) {
      console.log('Session Callback - Token:', token)
      session.accessToken = token.accessToken
      session.user = {
        ...session.user,
        ...token.userProfile
      }

      return session
    }
  },
  events: {
    signIn: async (message: any) => {
      console.log('NextAuth SignIn Event:', message)
    }
  }
})

export { handler as GET, handler as POST }
