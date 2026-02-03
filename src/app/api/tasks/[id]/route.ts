import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateTaskSchema } from '@/lib/validations/task'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        attachments: true,
        client: true,
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task-ul nu a fost gasit' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Eroare la incarcarea task-ului' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
      include: {
        attachments: true,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Eroare la actualizarea task-ului' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete associated files first
    const task = await prisma.task.findUnique({
      where: { id },
      include: { attachments: true },
    })

    if (task) {
      // In a production app, we'd delete the actual files here
      // For now, just delete the database records (cascade will handle attachments)
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Eroare la stergerea task-ului' },
      { status: 500 }
    )
  }
}
