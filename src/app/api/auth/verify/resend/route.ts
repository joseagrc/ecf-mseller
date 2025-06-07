import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { sendMail } from '@/libs/email'
import { setVerificationToken } from '@/libs/token-store'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const code = crypto.randomInt(100000, 999999).toString()

    setVerificationToken(email, code)

    await sendMail({
      to: email,
      subject: 'Verification code',
      text: `Your verification code is ${code}`
    })

    return NextResponse.json({ message: 'Verification code resent successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resend verification code' }, { status: 400 })
  }
}
