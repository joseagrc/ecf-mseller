import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const path = '/TesteCF/customer/signup'
    const response = await fetch((process.env.AWS_API_GATEWAY_URL + path) as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error adding user:', error)
    return NextResponse.json({ error: 'Error adding user' }, { status: 500 })
  }
}
