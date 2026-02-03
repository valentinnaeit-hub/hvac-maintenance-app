'use client'

import { TaskCard } from './TaskCard'

interface Task {
  id: string
  denumire: string
  data: string | Date
  efectuat: boolean
}

interface TaskListProps {
  tasks: Task[]
  onSelectTask: (id: string) => void
}

export function TaskList({ tasks, onSelectTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Niciun task</p>
      </div>
    )
  }

  // Sort: incomplete first (sorted by date), then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.efectuat !== b.efectuat) {
      return a.efectuat ? 1 : -1
    }
    return new Date(a.data).getTime() - new Date(b.data).getTime()
  })

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task.id)} />
      ))}
    </div>
  )
}
