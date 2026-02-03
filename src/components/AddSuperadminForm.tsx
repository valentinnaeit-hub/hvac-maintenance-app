'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createSuperadminSchema,
  type CreateSuperadminInput,
} from '@/lib/validations/superadmin'

interface AddSuperadminFormProps {
  onSuccess: () => void
}

export function AddSuperadminForm({ onSuccess }: AddSuperadminFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSuperadminInput>({
    resolver: zodResolver(createSuperadminSchema),
  })

  const onSubmit = async (data: CreateSuperadminInput) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/superadmins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Eroare la crearea administratorului')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Parola</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minim 8 caractere"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Se adauga...' : 'Adauga administrator'}
      </Button>
    </form>
  )
}
