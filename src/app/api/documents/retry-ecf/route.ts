import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export async function POST(req: NextRequest) {
  try {
    // Get session and check authorization
    const session = await getServerSession(authOptions)

    if (!session || !session.idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const url = new URL(req.url)
    const env = url.searchParams.get('environment')
    const path = `/${env}/customer/retry-ecf/${data.ecf}`

    console.log('FULL PATH', process.env.AWS_API_GATEWAY_URL + path)
    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.idToken}`
      },
      body: JSON.stringify({}) //Send an empty body
    })

    if (!response.ok) {
      const result = await response.json()

      return NextResponse.json({ ...result }, { status: response.status })
    }

    const result = await response.json()

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error Retrying sending a document: ', error && typeof error === 'object' && 'message' in error ? (error as any).message : error)

    return NextResponse.json({ error }, { status: 500 })
  }
}
