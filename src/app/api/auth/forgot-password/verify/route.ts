import { NextResponse } from 'next/server'

import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider'

import { calculateSecretHash } from '@/utils/calculateSecretHash'

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json()

    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })

    const secretHash = calculateSecretHash(email)
    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash
    })

    await client.send(command)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
