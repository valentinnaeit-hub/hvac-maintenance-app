'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SuperadminList } from '@/components/SuperadminList'
import { AddSuperadminForm } from '@/components/AddSuperadminForm'

interface Superadmin {
  id: string
  email: string
  createdAt: string
}

interface CurrentUser {
  id: string
  email: string
}

export default function SuperadminsPage() {
  const router = useRouter()
  const [superadmins, setSuperadmins] = useState<Superadmin[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchSuperadmins = useCallback(async () => {
    try {
      const response = await fetch('/api/superadmins')
      if (response.ok) {
        const data = await response.json()
        setSuperadmins(data)
      }
    } catch (error) {
      console.error('Error fetching superadmins:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }, [])

  useEffect(() => {
    fetchSuperadmins()
    fetchCurrentUser()
  }, [fetchSuperadmins, fetchCurrentUser])

  const handleDelete = async (id: string) => {
    if (!confirm('Esti sigur ca vrei sa stergi acest administrator?')) return

    setIsDeleting(id)
    setError(null)

    try {
      const response = await fetch(`/api/superadmins/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Eroare la stergere')
        return
      }

      fetchSuperadmins()
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-3 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg md:text-xl font-bold">Gestionare Administratori</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 md:p-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-4">Adauga Administrator Nou</h2>
          <AddSuperadminForm onSuccess={fetchSuperadmins} />
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-semibold mb-4">Administratori Existenti</h2>

          {error && (
            <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Se incarca...
            </div>
          ) : (
            <SuperadminList
              superadmins={superadmins}
              currentUserId={currentUser?.id || null}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        </section>
      </main>
    </div>
  )
}
