import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/db'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task-ul nu a fost gasit' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Niciun fisier furnizat' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fisierul este prea mare (max 10MB)' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const fileId = crypto.randomUUID()
    const ext = path.extname(file.name)
    const storageName = `${fileId}${ext}`
    const storagePath = path.join(UPLOAD_DIR, storageName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(storagePath, buffer)

    // Save metadata to database
    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        storagePath: storageName,
      },
    })

    return NextResponse.json({
      id: attachment.id,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading attachment:', error)
    return NextResponse.json(
      { error: 'Eroare la incarcarea fisierului' },
      { status: 500 }
    )
  }
}
