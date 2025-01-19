import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions, refreshAccessToken } from '@/libs/auth'

export async function POST(req: NextRequest) {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const apiKey = (await req.headers.get('x-api-key')) as string
    const path = `/TesteCF/documentos-ecf`

    //for new session after upload the certificate the secretId get attached to the access token, in order to stablish the communication
    // we need to refresh the access token and perform the request, custom:secretId should be available in the new token
    const newToken = await refreshAccessToken(session)

    if (newToken.error) {
      return NextResponse.json({ error: newToken.error }, { status: 401 })
    }

    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken.idToken}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const result = await response.json()

      return NextResponse.json({ ...result }, { status: response.status })
    }

    const result = await response.json()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error sending eCF:', error)

    return NextResponse.json({ error }, { status: 500 })
  }
}
