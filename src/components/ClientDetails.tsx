'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TaskList } from './TaskList'

interface Task {
  id: string
  denumire: string
  data: string | Date
  efectuat: boolean
}

interface ClientDetailsProps {
  client: {
    id: string
    numePrenume: string
    telefon: string
    zona: string
    adresa: string
    serieEchipament: string
    codISCIR: string
    modelEchipament: string
    tasks: Task[]
  } | null
  onAddTask: () => void
  onSelectTask: (taskId: string) => void
}

export function ClientDetails({
  client,
  onAddTask,
  onSelectTask,
}: ClientDetailsProps) {
  if (!client) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Selecteaza un client pentru a vedea detaliile</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">{client.numePrenume}</h2>

        <div className="mt-4 space-y-3">
          <DetailRow label="Nr. telefon" value={client.telefon} />
          <DetailRow label="Zona" value={client.zona} />
          <DetailRow label="Adresa" value={client.adresa} />
          <DetailRow label="Serie echipament" value={client.serieEchipament} />
          <DetailRow label="Cod ISCIR" value={client.codISCIR} />
          <DetailRow label="Model Echipament" value={client.modelEchipament} />
        </div>
      </div>

      <Separator />

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Task-uri</h3>
          <Button size="sm" onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-1" />
            Adauga
          </Button>
        </div>

        <TaskList tasks={client.tasks} onSelectTask={onSelectTask} />
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm font-medium">{value || '-'}</span>
    </div>
  )
}
