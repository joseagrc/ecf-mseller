import { NextResponse } from 'next/server'

import { getPasswordResetToken, removePasswordResetToken } from '@/libs/token-store'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    const stored = getPasswordResetToken(email)

    if (stored !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    removePasswordResetToken(email)

    // Here you should update the user password in your user store

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
