'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { createTaskFormSchema, type CreateTaskFormInput } from '@/lib/validations/task'

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  onSuccess: (taskId: string) => void
}

export function AddTaskModal({
  open,
  onOpenChange,
  clientId,
  onSuccess,
}: AddTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormInput>({
    resolver: zodResolver(createTaskFormSchema),
  })

  const onSubmit = async (data: CreateTaskFormInput) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/clients/${clientId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denumire: data.denumire,
          data: (date || new Date()).toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Eroare la crearea task-ului')
        return
      }

      reset()
      setDate(new Date())
      onSuccess(result.id)
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setDate(new Date())
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Task nou</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="denumire">Denumire</Label>
            <Input
              id="denumire"
              placeholder="ex: Revizie anuala"
              {...register('denumire')}
              disabled={isLoading}
            />
            {errors.denumire && (
              <p className="text-sm text-destructive">
                {errors.denumire.message}
              </p>
            )}
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Inapoi
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Se salveaza...' : 'Adauga'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
