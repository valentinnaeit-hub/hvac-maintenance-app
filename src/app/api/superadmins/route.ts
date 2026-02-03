import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { createSuperadminSchema } from '@/lib/validations/superadmin'

export async function GET() {
  try {
    const superadmins = await prisma.superAdmin.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(superadmins)
  } catch (error) {
    console.error('Error fetching superadmins:', error)
    return NextResponse.json(
      { error: 'Eroare la incarcarea administratorilor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createSuperadminSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // Check if email already exists
    const existing = await prisma.superAdmin.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Aceasta adresa de email este deja utilizata' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const superadmin = await prisma.superAdmin.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(superadmin, { status: 201 })
  } catch (error) {
    console.error('Error creating superadmin:', error)
    return NextResponse.json(
      { error: 'Eroare la crearea administratorului' },
      { status: 500 }
    )
  }
}
