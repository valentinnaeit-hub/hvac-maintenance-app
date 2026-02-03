'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface Superadmin {
  id: string
  email: string
  createdAt: string
}

interface SuperadminListProps {
  superadmins: Superadmin[]
  currentUserId: string | null
  onDelete: (id: string) => void
  isDeleting: string | null
}

export function SuperadminList({
  superadmins,
  currentUserId,
  onDelete,
  isDeleting,
}: SuperadminListProps) {
  if (superadmins.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Niciun administrator</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {superadmins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div>
            <p className="font-medium">{admin.email}</p>
            <p className="text-sm text-muted-foreground">
              Creat: {formatDate(admin.createdAt)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(admin.id)}
            disabled={
              isDeleting === admin.id ||
              admin.id === currentUserId ||
              superadmins.length <= 1
            }
            className="text-destructive hover:text-destructive"
            title={
              admin.id === currentUserId
                ? 'Nu poti sterge propriul cont'
                : superadmins.length <= 1
                ? 'Nu poti sterge ultimul administrator'
                : 'Sterge administrator'
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
