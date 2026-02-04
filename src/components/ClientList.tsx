'use client'

import { ClientCard } from './ClientCard'

interface ListItem {
  id: string
  type: 'task' | 'client'
  denumire: string | null
  data: string | Date | null
  client: {
    id: string
    numePrenume: string
    ascuns?: boolean
  }
}

interface ClientListProps {
  items: ListItem[]
  selectedClientId: string | null
  onSelectClient: (id: string) => void
}

export function ClientList({
  items,
  selectedClientId,
  onSelectClient,
}: ClientListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Niciun rezultat gasit</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ClientCard
          key={`${item.type}-${item.id}`}
          item={item}
          isSelected={item.client.id === selectedClientId}
          onClick={() => onSelectClient(item.client.id)}
        />
      ))}
    </div>
  )
}
