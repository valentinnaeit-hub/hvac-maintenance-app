import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/db'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const attachment = await prisma.attachment.findUnique({
      where: { id },
    })

    if (!attachment) {
      return NextResponse.json(
        { error: 'Atasamentul nu a fost gasit' },
        { status: 404 }
      )
    }

    const filePath = path.join(UPLOAD_DIR, attachment.storagePath)

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Fisierul nu a fost gasit' },
        { status: 404 }
      )
    }

    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': attachment.mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(attachment.originalName)}"`,
        'Content-Length': attachment.size.toString(),
      },
    })
  } catch (error) {
    console.error('Error serving attachment:', error)
    return NextResponse.json(
      { error: 'Eroare la descarcarea fisierului' },
      { status: 500 }
    )
  }
}
