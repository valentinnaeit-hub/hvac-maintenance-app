import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'
import { loginSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Date de autentificare invalide' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.superAdmin.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email sau parola incorecta' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email sau parola incorecta' },
        { status: 401 }
      )
    }

    await createSession(user.id, user.email)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Eroare interna a serverului' },
      { status: 500 }
    )
  }
}
