import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { sendMail } from '@/libs/email'
import { setPasswordResetToken } from '@/libs/token-store'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const code = crypto.randomInt(100000, 999999).toString()

    setPasswordResetToken(email, code)

    await sendMail({
      to: email,
      subject: 'Password recovery',
      text: `Your verification code is ${code}`
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.log(error)

    
return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
