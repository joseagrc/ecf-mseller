import { NextResponse } from 'next/server'

import { CognitoIdentityProviderClient, ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider'

import { calculateSecretHash } from '@/utils/calculateSecretHash'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })

    const secretHash = calculateSecretHash(email)

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: secretHash
    })

    await client.send(command)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.log(error)

    
return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
