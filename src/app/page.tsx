'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, LogOut, Users, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/SearchInput'
import { ClientList } from '@/components/ClientList'
import { ClientDetails } from '@/components/ClientDetails'
import { AddClientModal } from '@/components/AddClientModal'
import { AddTaskModal } from '@/components/AddTaskModal'
import { TaskDetail } from '@/components/TaskDetail'

interface ListItem {
  id: string
  type: 'task' | 'client'
  denumire: string | null
  data: string | null
  client: {
    id: string
    numePrenume: string
    ascuns?: boolean
  }
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
  ascuns?: boolean
  tasks: Task[]
}

export default function Dashboard() {
  const router = useRouter()
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<ClientFull | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(false)

  const fetchListItems = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (showHidden) params.set('showHidden', 'true')

      const response = await fetch(`/api/tasks?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListItems(data)
      }
    } catch (error) {
      console.error('Error fetching list:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, showHidden])

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
    fetchListItems()
  }, [fetchListItems])

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
    fetchListItems()
  }

  const handleTaskAdded = (taskId: string) => {
    setIsAddTaskOpen(false)
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchListItems()
    setSelectedTaskId(taskId)
  }

  const handleTaskUpdated = () => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchListItems()
  }

  const handleTaskDeleted = () => {
    setSelectedTaskId(null)
    if (selectedClientId) {
      fetchClientDetails(selectedClientId)
    }
    fetchListItems()
  }

  const handleClientDeleted = async () => {
    if (!selectedClientId) return
    try {
      const response = await fetch(`/api/clients/${selectedClientId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSelectedClientId(null)
        setSelectedClient(null)
        setSelectedTaskId(null)
        fetchListItems()
      }
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const handleClientToggleHide = async () => {
    if (!selectedClient) return
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ascuns: !selectedClient.ascuns }),
      })
      if (response.ok) {
        fetchClientDetails(selectedClient.id)
        fetchListItems()
      }
    } catch (error) {
      console.error('Error toggling client visibility:', error)
    }
  }

  const handleBackToList = () => {
    setSelectedClientId(null)
    setSelectedClient(null)
  }

  const selectedTask = selectedClient?.tasks.find(
    (t) => t.id === selectedTaskId
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-3 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <Image src="/Logo_EAS.png" alt="EAS Logo" width={120} height={40} priority />
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/superadmins')}>
            <Users className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Administratori</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Deconectare</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Task list */}
        <div className={cn(
          'w-full md:w-[400px] border-r flex flex-col',
          selectedClientId ? 'hidden md:flex' : 'flex'
        )}>
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setIsAddClientOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adauga
              </Button>
              <Button
                variant={showHidden ? 'default' : 'outline'}
                size="icon"
                onClick={() => setShowHidden(!showHidden)}
                title={showHidden ? 'Ascunde clientii ascunsi' : 'Arata clientii ascunsi'}
              >
                {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
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
                items={listItems}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            )}
          </div>
        </div>

        {/* Right panel - Client details */}
        <div className={cn(
          'flex-1 overflow-hidden',
          selectedClientId ? 'flex flex-col' : 'hidden md:block'
        )}>
          <ClientDetails
            client={selectedClient}
            onAddTask={() => setIsAddTaskOpen(true)}
            onSelectTask={setSelectedTaskId}
            onBack={handleBackToList}
            onDelete={handleClientDeleted}
            onToggleHide={handleClientToggleHide}
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
