'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LogOut, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/SearchInput'
import { ClientList } from '@/components/ClientList'
import { ClientDetails } from '@/components/ClientDetails'
import { AddClientModal } from '@/components/AddClientModal'
import { AddTaskModal } from '@/components/AddTaskModal'
import { TaskDetail } from '@/components/TaskDetail'

interface NextTask {
  id: string
  denumire: string
  data: string
}

interface ClientSummary {
  id: string
  numePrenume: string
  nextTask: NextTask | null
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
  attachments: Array<{
    id: string
    originalName: string
    mimeType: string
    size: number
  }>
}

interface ClientFull {
  id: string
  numePrenume: string
  telefon: string
  zona: string
  adresa: string
  serieEchipament: string
  codISCIR: string
  modelEchipament: string
  tasks: Task[]
}

export default function Dashboard() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<ClientFull | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const response = await fetch(`/api/clients?${params}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  const fetchClientDetails = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedClient(data)
      }
    } catch (error) {
      console.error('Error fetching client details:', error)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  useEffect(() => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    } else {
      setSelectedClient(null)
    }
  }, [selectedClientId, fetchClientDetails])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleClientAdded = () => {
    setIsAddClientOpen(false)
    fetchClients()
  }

  const handleTaskAdded = (taskId: string) => {
    setIsAddTaskOpen(false)
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchClients()
    setSelectedTaskId(taskId)
  }

  const handleTaskUpdated = () => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchClients()
  }

  const handleTaskDeleted = () => {
    setSelectedTaskId(null)
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchClients()
  }

  const selectedTask = selectedClient?.tasks.find(
    (t) => t.id === selectedTaskId
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">HVAC Maintenance</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/superadmins')}>
            <Users className="h-4 w-4 mr-2" />
            Administratori
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Deconectare
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Client list */}
        <div className="w-[400px] border-r flex flex-col">
          <div className="p-4 space-y-4">
            <Button className="w-full" onClick={() => setIsAddClientOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adauga
            </Button>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cauta client"
            />
          </div>

          <div className="flex-1 overflow-auto p-4 pt-0">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Se incarca...
              </div>
            ) : (
              <ClientList
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            )}
          </div>
        </div>

        {/* Right panel - Client details */}
        <div className="flex-1 overflow-hidden">
          <ClientDetails
            client={selectedClient}
            onAddTask={() => setIsAddTaskOpen(true)}
            onSelectTask={setSelectedTaskId}
          />
        </div>
      </div>

      {/* Modals */}
      <AddClientModal
        open={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        onSuccess={handleClientAdded}
      />

      {selectedClientId && (
        <AddTaskModal
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          clientId={selectedClientId}
          onSuccess={handleTaskAdded}
        />
      )}

      {selectedTask && (
        <TaskDetail
          open={!!selectedTaskId}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
          task={selectedTask}
          onUpdate={handleTaskUpdated}
          onDelete={handleTaskDeleted}
        />
      )}
    </div>
  )
}
