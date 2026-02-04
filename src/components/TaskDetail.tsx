'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Trash2, CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { AttachmentUpload } from './AttachmentUpload'
import { AttachmentList } from './AttachmentList'
import { cn } from '@/lib/utils'

interface Attachment {
  id: string
  originalName: string
  mimeType: string
  size: number
}

interface Task {
  id: string
  denumire: string
  data: string
  efectuat: boolean
  inGarantie: boolean
  duritateApa: string
  defectiune: string
  remedieri: string
  pieseInlocuite: string
  alteComentarii: string
  attachments: Attachment[]
}

interface TaskDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onUpdate: () => void
  onDelete: () => void
}

export function TaskDetail({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
}: TaskDetailProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [denumire, setDenumire] = useState(task.denumire)
  const [date, setDate] = useState<Date>(new Date(task.data))
  const [efectuat, setEfectuat] = useState(task.efectuat)
  const [inGarantie, setInGarantie] = useState(task.inGarantie)
  const [duritateApa, setDuritateApa] = useState(task.duritateApa)
  const [defectiune, setDefectiune] = useState(task.defectiune)
  const [remedieri, setRemedieri] = useState(task.remedieri)
  const [pieseInlocuite, setPieseInlocuite] = useState(task.pieseInlocuite)
  const [alteComentarii, setAlteComentarii] = useState(task.alteComentarii)
  const [attachments, setAttachments] = useState<Attachment[]>(task.attachments)

  // Reset form when task changes
  useEffect(() => {
    setDenumire(task.denumire)
    setDate(new Date(task.data))
    setEfectuat(task.efectuat)
    setInGarantie(task.inGarantie)
    setDuritateApa(task.duritateApa)
    setDefectiune(task.defectiune)
    setRemedieri(task.remedieri)
    setPieseInlocuite(task.pieseInlocuite)
    setAlteComentarii(task.alteComentarii)
    setAttachments(task.attachments)
  }, [task])

  const handleSave = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denumire,
          data: date.toISOString(),
          efectuat,
          inGarantie,
          duritateApa,
          defectiune,
          remedieri,
          pieseInlocuite,
          alteComentarii,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Eroare la salvare')
        return
      }

      onUpdate()
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Esti sigur ca vrei sa stergi acest task?')) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Eroare la stergere')
        return
      }

      onDelete()
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAttachmentUploaded = (attachment: Attachment) => {
    setAttachments((prev) => [...prev, attachment])
    onUpdate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="truncate">{task.denumire}</DialogTitle>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <Checkbox
                id="efectuat"
                checked={efectuat}
                onCheckedChange={(checked) => setEfectuat(checked as boolean)}
              />
              <Label htmlFor="efectuat" className="text-xs sm:text-sm">
                Efectuat
              </Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="denumire">Denumire</Label>
            <Input
              id="denumire"
              value={denumire}
              onChange={(e) => setDenumire(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd.MM.yyyy') : 'Selecteaza data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="inGarantie">In garantie</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Nu</span>
              <Switch
                id="inGarantie"
                checked={inGarantie}
                onCheckedChange={setInGarantie}
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">Da</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duritateApa">Duritate apa</Label>
            <Input
              id="duritateApa"
              value={duritateApa}
              onChange={(e) => setDuritateApa(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defectiune">Defectiune</Label>
            <Textarea
              id="defectiune"
              value={defectiune}
              onChange={(e) => setDefectiune(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remedieri">Remedieri</Label>
            <Textarea
              id="remedieri"
              value={remedieri}
              onChange={(e) => setRemedieri(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pieseInlocuite">Piese inlocuite</Label>
            <Textarea
              id="pieseInlocuite"
              value={pieseInlocuite}
              onChange={(e) => setPieseInlocuite(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alteComentarii">Alte comentarii</Label>
            <Textarea
              id="alteComentarii"
              value={alteComentarii}
              onChange={(e) => setAlteComentarii(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Atasamente</Label>
            <AttachmentList attachments={attachments} />
            <AttachmentUpload
              taskId={task.id}
              onUploaded={handleAttachmentUploaded}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Se salveaza...' : 'Salveaza'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
