'use client'

import { ChevronRight, EyeOff } from 'lucide-react'
import { cn, formatDate, isTaskPastDue, isTaskApproaching } from '@/lib/utils'

interface ListItem {
  id: string
  type: 'task' | 'client'
  denumire: string | null
  data: string | Date | null
  client: {
    id: string
    numePrenume: string
    ascuns?: boolean
  }
}

interface ClientCardProps {
  item: ListItem
  isSelected: boolean
  onClick: () => void
}

export function ClientCard({ item, isSelected, onClick }: ClientCardProps) {
  const hasTask = item.type === 'task' && item.data !== null
  const isPastDue = hasTask && isTaskPastDue(item.data!, false)
  const isApproaching = hasTask && !isPastDue && isTaskApproaching(item.data!)
  const isHidden = item.client.ascuns === true

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-colors',
        'hover:bg-accent/50',
        isSelected && 'ring-2 ring-primary',
        isHidden && 'opacity-50',
        hasTask && isPastDue && 'border-red-400 bg-red-50',
        hasTask && isApproaching && 'border-orange-400 bg-orange-50',
        hasTask && !isPastDue && !isApproaching && 'border-green-500 bg-green-50',
        !hasTask && 'border-border bg-background'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate flex items-center gap-1">
            {isHidden && <EyeOff className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
            {item.client.numePrenume}
          </h3>
          {hasTask ? (
            <div className="mt-1 text-sm text-muted-foreground">
              <span>{item.denumire}</span>
              <span className="mx-2">-</span>
              <span>{formatDate(item.data!)}</span>
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
