import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'

function calculateSecretHash(username: string): string {
  const message = username + process.env.COGNITO_CLIENT_ID
  const hash = crypto.createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET!).update(message).digest('base64')

  return hash
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION
    })

    const secretHash = calculateSecretHash(email)

    await client.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        ConfirmationCode: code,
        SecretHash: secretHash
      })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
