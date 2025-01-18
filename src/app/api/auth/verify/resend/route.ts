import { NextResponse } from 'next/server'

import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'

import { calculateSecretHash } from '@/utils/calculateSecretHash'

export async function POST(request: Request) {
  try {
    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })

    const { email } = await request.json()
    const secretHash = calculateSecretHash(email)
    const command = new ResendConfirmationCodeCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      SecretHash: secretHash
    })

    await client.send(command)

    return NextResponse.json({ message: 'Verification code resent successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resend verification code' }, { status: 400 })
  }
}
