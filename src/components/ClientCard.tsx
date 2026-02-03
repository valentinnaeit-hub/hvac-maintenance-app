'use client'

import { ChevronRight } from 'lucide-react'
import { cn, formatDate, isTaskPastDue, isTaskUpcoming } from '@/lib/utils'

interface ClientCardProps {
  client: {
    id: string
    numePrenume: string
    nextTask: {
      id: string
      denumire: string
      data: string | Date
    } | null
  }
  isSelected: boolean
  onClick: () => void
}

export function ClientCard({ client, isSelected, onClick }: ClientCardProps) {
  const hasTask = !!client.nextTask
  const isPastDue = hasTask && isTaskPastDue(client.nextTask!.data, false)
  const isUpcoming = hasTask && isTaskUpcoming(client.nextTask!.data)

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-colors',
        'hover:bg-accent/50',
        isSelected && 'ring-2 ring-primary',
        isPastDue && 'border-red-400 bg-red-50',
        isUpcoming && !isPastDue && 'border-green-500 bg-green-50',
        !hasTask && 'border-border bg-background'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{client.numePrenume}</h3>
          {client.nextTask ? (
            <div className="mt-1 text-sm text-muted-foreground">
              <span>{client.nextTask.denumire}</span>
              <span className="mx-2">-</span>
              <span>{formatDate(client.nextTask.data)}</span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Niciun task programat
            </p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
      </div>
    </button>
  )
}
