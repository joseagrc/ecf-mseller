import { NextResponse } from 'next/server'

import { getVerificationToken, removeVerificationToken } from '@/libs/token-store'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    const stored = getVerificationToken(email)

    if (stored !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    removeVerificationToken(email)

    // Mark user as verified in your user store here

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
