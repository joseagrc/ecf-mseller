import { type NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import { ApiKeyInputType } from '@/types/ApiKeyTypes'

export async function GET() {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const path = '/TesteCF/customer/apikeys'

    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.idToken}`
      }
    })

    if (!response.ok) {
      const result = await response.json()

      return NextResponse.json({ ...result }, { status: response.status })
    }

    const result = await response.json()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error adding apikeys:', error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = (await req.json()) as ApiKeyInputType
    const path = `/${data.stage}/customer/apikey`

    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.idToken}`
      },
      body: JSON.stringify({
        action: 'create',
        description: data.description
      })
    })

    if (!response.ok) {
      const result = await response.json()

      return NextResponse.json({ ...result }, { status: response.status })
    }

    const result = await response.json()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error adding apikeys:', error)

    return NextResponse.json({ error }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest) {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const path = '/TesteCF/customer/apikey'

    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.idToken}`
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
    console.error('Error deleting apikeys:', error)

    return NextResponse.json({ error }, { status: 500 })
  }
}
