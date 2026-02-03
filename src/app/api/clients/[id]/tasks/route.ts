import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createTaskApiSchema } from '@/lib/validations/task'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params
    const body = await request.json()
    const parsed = createTaskApiSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Clientul nu a fost gasit' },
        { status: 404 }
      )
    }

    const task = await prisma.task.create({
      data: {
        clientId,
        denumire: parsed.data.denumire,
        data: parsed.data.data,
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Eroare la crearea task-ului' },
      { status: 500 }
    )
  }
}
