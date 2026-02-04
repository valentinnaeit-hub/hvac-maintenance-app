'use client'

import { ArrowLeft, Plus, Trash2, EyeOff, Eye } from 'lucide-react'
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
    ascuns?: boolean
    tasks: Task[]
  } | null
  onAddTask: () => void
  onSelectTask: (taskId: string) => void
  onBack?: () => void
  onDelete?: () => void
  onToggleHide?: () => void
}

export function ClientDetails({
  client,
  onAddTask,
  onSelectTask,
  onBack,
  onDelete,
  onToggleHide,
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
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg md:text-xl font-bold truncate flex-1">{client.numePrenume}</h2>
          {onToggleHide && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={onToggleHide}
              title={client.ascuns ? 'Afiseaza client' : 'Ascunde client'}
            >
              {client.ascuns ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm('Esti sigur ca vrei sa stergi acest client? Aceasta actiune este ireversibila.')) {
                  onDelete()
                }
              }}
              title="Sterge client"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <DetailRow label="Nr. telefon" value={client.telefon} href={`tel:${client.telefon}`} />
          <DetailRow label="Zona" value={client.zona} />
          <DetailRow label="Adresa" value={client.adresa} />
          <DetailRow label="Serie echipament" value={client.serieEchipament} />
          <DetailRow label="Cod ISCIR" value={client.codISCIR} />
          <DetailRow label="Model Echipament" value={client.modelEchipament} />
        </div>
      </div>

      <Separator />

      <div className="flex-1 p-4 md:p-6 overflow-auto">
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

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-2">
      <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
      {href && value ? (
        <a href={href} className="sm:col-span-2 text-sm font-medium text-primary underline">
          {value}
        </a>
      ) : (
        <span className="sm:col-span-2 text-sm font-medium">{value || '-'}</span>
      )}
    </div>
  )
}
