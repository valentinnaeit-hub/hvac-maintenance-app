'use client'

import { ChevronRight } from 'lucide-react'
import { cn, formatDate, isTaskPastDue, isTaskUpcoming } from '@/lib/utils'

interface TaskCardProps {
  task: {
    id: string
    denumire: string
    data: string | Date
    efectuat: boolean
  }
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isPastDue = isTaskPastDue(task.data, task.efectuat)
  const isUpcoming = isTaskUpcoming(task.data)

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between',
        'hover:opacity-80',
        task.efectuat && 'bg-muted text-muted-foreground line-through',
        !task.efectuat && isPastDue && 'bg-red-100',
        !task.efectuat && isUpcoming && !isPastDue && 'bg-green-100'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{task.denumire}</span>
          {task.efectuat && (
            <span className="text-xs bg-muted-foreground/20 px-2 py-0.5 rounded">
              Efectuat
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatDate(task.data)}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
    </button>
  )
}
