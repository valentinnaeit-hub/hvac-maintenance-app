'use client'

import { useState } from 'react'
import { FileIcon, Download, X, FileText } from 'lucide-react'
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

function isImage(mimeType: string) {
  return mimeType.startsWith('image/')
}

function isPdf(mimeType: string) {
  return mimeType === 'application/pdf'
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  const [previewId, setPreviewId] = useState<string | null>(null)

  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        Niciun atasament
      </p>
    )
  }

  const images = attachments.filter((a) => isImage(a.mimeType))
  const files = attachments.filter((a) => !isImage(a.mimeType))
  const previewAttachment = attachments.find((a) => a.id === previewId)

  return (
    <>
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((attachment) => (
            <button
              key={attachment.id}
              type="button"
              onClick={() => setPreviewId(attachment.id)}
              className="relative aspect-square rounded-md overflow-hidden border bg-muted/50 hover:opacity-80 transition-opacity"
            >
              <img
                src={`/api/attachments/${attachment.id}?inline=true`}
                alt={attachment.originalName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Non-image files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                {isPdf(attachment.mimeType) ? (
                  <FileText className="h-4 w-4 flex-shrink-0 text-red-500" />
                ) : (
                  <FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachment.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isPdf(attachment.mimeType) && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`/api/attachments/${attachment.id}?inline=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Deschide"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`/api/attachments/${attachment.id}`}
                    download={attachment.originalName}
                    title="Descarca"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image lightbox */}
      {previewAttachment && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewId(null)}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-10 right-0 text-white hover:bg-white/20"
              onClick={() => setPreviewId(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={`/api/attachments/${previewAttachment.id}?inline=true`}
              alt={previewAttachment.originalName}
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-white text-sm truncate">{previewAttachment.originalName}</p>
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
                <a
                  href={`/api/attachments/${previewAttachment.id}`}
                  download={previewAttachment.originalName}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descarca
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
