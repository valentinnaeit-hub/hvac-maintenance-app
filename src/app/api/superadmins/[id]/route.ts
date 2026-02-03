import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current user
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Neautentificat' },
        { status: 401 }
      )
    }

    // Check if trying to delete self
    if (session.userId === id) {
      return NextResponse.json(
        { error: 'Nu poti sterge propriul cont' },
        { status: 400 }
      )
    }

    // Check if this is the last superadmin
    const count = await prisma.superAdmin.count()
    if (count <= 1) {
      return NextResponse.json(
        { error: 'Nu poti sterge ultimul administrator' },
        { status: 400 }
      )
    }

    await prisma.superAdmin.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting superadmin:', error)
    return NextResponse.json(
      { error: 'Eroare la stergerea administratorului' },
      { status: 500 }
    )
  }
}
