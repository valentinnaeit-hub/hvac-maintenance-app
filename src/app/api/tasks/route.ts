import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const showHidden = searchParams.get('showHidden') === 'true'

    const hiddenFilter = showHidden ? {} : { ascuns: false }

    const searchFilter = search
      ? {
          OR: [
            { denumire: { contains: search, mode: 'insensitive' as const } },
            {
              client: {
                numePrenume: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              client: {
                telefon: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              client: {
                zona: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {}

    const clientSearchFilter = search
      ? {
          OR: [
            { numePrenume: { contains: search, mode: 'insensitive' as const } },
            { telefon: { contains: search, mode: 'insensitive' as const } },
            { zona: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // 1. Fetch all incomplete tasks with client info, sorted by date
    const tasks = await prisma.task.findMany({
      where: {
        efectuat: false,
        client: hiddenFilter,
        ...searchFilter,
      },
      include: {
        client: {
          select: {
            id: true,
            numePrenume: true,
            ascuns: true,
          },
        },
      },
      orderBy: {
        data: 'asc',
      },
    })

    // 2. Fetch clients that have NO incomplete tasks (with search filter on client fields)
    const clientsWithoutTasks = await prisma.client.findMany({
      where: {
        tasks: {
          none: { efectuat: false },
        },
        ...hiddenFilter,
        ...clientSearchFilter,
      },
      select: {
        id: true,
        numePrenume: true,
        ascuns: true,
      },
      orderBy: {
        numePrenume: 'asc',
      },
    })

    // 3. Build unified list: task items first, then client-only items
    const taskItems = tasks.map((t) => ({
      id: t.id,
      type: 'task' as const,
      denumire: t.denumire,
      data: t.data,
      client: t.client,
    }))

    const clientItems = clientsWithoutTasks.map((c) => ({
      id: c.id,
      type: 'client' as const,
      denumire: null,
      data: null,
      client: { id: c.id, numePrenume: c.numePrenume, ascuns: c.ascuns },
    }))

    return NextResponse.json([...taskItems, ...clientItems])
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Eroare la incarcarea task-urilor' },
      { status: 500 }
    )
  }
}
