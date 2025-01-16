import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export async function GET(request: Request) {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const params = url.searchParams.toString()
    const file = url.searchParams.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 })
    }

    const path = `/TesteCF/customer/documents?${params}`

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
