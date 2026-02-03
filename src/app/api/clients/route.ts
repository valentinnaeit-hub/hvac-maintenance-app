import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { clientSchema } from '@/lib/validations/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const clients = await prisma.client.findMany({
      where: search
        ? {
            OR: [
              { numePrenume: { contains: search, mode: 'insensitive' } },
              { telefon: { contains: search, mode: 'insensitive' } },
              { zona: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        tasks: {
          where: {
            efectuat: false,
          },
          orderBy: {
            data: 'asc',
          },
          take: 1,
        },
      },
    })

    // Sort clients: those with upcoming incomplete tasks first, then by next task date
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const sortedClients = clients.sort((a, b) => {
      const aNextTask = a.tasks[0]
      const bNextTask = b.tasks[0]

      // Clients with tasks come before clients without
      if (aNextTask && !bNextTask) return -1
      if (!aNextTask && bNextTask) return 1

      // If both have no tasks, sort by name
      if (!aNextTask && !bNextTask) {
        return a.numePrenume.localeCompare(b.numePrenume)
      }

      // Both have tasks - sort by task date
      const aDate = new Date(aNextTask.data)
      const bDate = new Date(bNextTask.data)

      // Past due tasks come first
      const aIsPastDue = aDate < now
      const bIsPastDue = bDate < now

      if (aIsPastDue && !bIsPastDue) return -1
      if (!aIsPastDue && bIsPastDue) return 1

      // Then sort by date
      return aDate.getTime() - bDate.getTime()
    })

    // Map to include nextTask info
    const clientsWithNextTask = sortedClients.map((client) => ({
      id: client.id,
      numePrenume: client.numePrenume,
      telefon: client.telefon,
      zona: client.zona,
      adresa: client.adresa,
      serieEchipament: client.serieEchipament,
      codISCIR: client.codISCIR,
      modelEchipament: client.modelEchipament,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      nextTask: client.tasks[0]
        ? {
            id: client.tasks[0].id,
            denumire: client.tasks[0].denumire,
            data: client.tasks[0].data,
          }
        : null,
    }))

    return NextResponse.json(clientsWithNextTask)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Eroare la incarcarea clientilor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = clientSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: parsed.data,
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Eroare la crearea clientului' },
      { status: 500 }
    )
  }
}
