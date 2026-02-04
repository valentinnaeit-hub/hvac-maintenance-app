'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { clientSchema, type ClientInput } from '@/lib/validations/client'

interface AddClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddClientModal({
  open,
  onOpenChange,
  onSuccess,
}: AddClientModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  })

  const onSubmit = async (data: ClientInput) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Eroare la crearea clientului')
        return
      }

      reset()
      onSuccess()
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client nou</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numePrenume">Nume Prenume</Label>
            <Input
              id="numePrenume"
              {...register('numePrenume')}
              disabled={isLoading}
            />
            {errors.numePrenume && (
              <p className="text-sm text-destructive">
                {errors.numePrenume.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefon">Nr. telefon</Label>
            <Input
              id="telefon"
              {...register('telefon')}
              disabled={isLoading}
            />
            {errors.telefon && (
              <p className="text-sm text-destructive">
                {errors.telefon.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zona">Zona</Label>
            <Input id="zona" {...register('zona')} disabled={isLoading} />
            {errors.zona && (
              <p className="text-sm text-destructive">{errors.zona.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresa">Adresa</Label>
            <Textarea
              id="adresa"
              {...register('adresa')}
              disabled={isLoading}
              rows={2}
            />
            {errors.adresa && (
              <p className="text-sm text-destructive">
                {errors.adresa.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serieEchipament">Serie Echipament</Label>
            <Input
              id="serieEchipament"
              {...register('serieEchipament')}
              disabled={isLoading}
            />
            {errors.serieEchipament && (
              <p className="text-sm text-destructive">
                {errors.serieEchipament.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="codISCIR">Cod ISCIR</Label>
            <Input
              id="codISCIR"
              {...register('codISCIR')}
              disabled={isLoading}
            />
            {errors.codISCIR && (
              <p className="text-sm text-destructive">
                {errors.codISCIR.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelEchipament">Model Echipament</Label>
            <Input
              id="modelEchipament"
              {...register('modelEchipament')}
              disabled={isLoading}
            />
            {errors.modelEchipament && (
              <p className="text-sm text-destructive">
                {errors.modelEchipament.message}
              </p>
            )}
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
