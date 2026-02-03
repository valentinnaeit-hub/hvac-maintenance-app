'use client'

import { ClientCard } from './ClientCard'

interface Client {
  id: string
  numePrenume: string
  nextTask: {
    id: string
    denumire: string
    data: string | Date
  } | null
}

interface ClientListProps {
  clients: Client[]
  selectedClientId: string | null
  onSelectClient: (id: string) => void
}

export function ClientList({
  clients,
  selectedClientId,
  onSelectClient,
}: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Niciun client gasit</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          isSelected={client.id === selectedClientId}
          onClick={() => onSelectClient(client.id)}
        />
      ))}
    </div>
  )
}
