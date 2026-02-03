'use client'

import { FileIcon, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Attachment {
  id: string
  originalName: string
  mimeType: string
  size: number
}

interface AttachmentListProps {
  attachments: Attachment[]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        Niciun atasament
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
        >
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {attachment.originalName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="flex-shrink-0"
          >
            <a
              href={`/api/attachments/${attachment.id}`}
              download={attachment.originalName}
            >
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
}
