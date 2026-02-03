'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Attachment {
  id: string
  originalName: string
  mimeType: string
  size: number
}

interface AttachmentUploadProps {
  taskId: string
  onUploaded: (attachment: Attachment) => void
}

export function AttachmentUpload({ taskId, onUploaded }: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Eroare la incarcarea fisierului')
        return
      }

      onUploaded(result)
    } catch {
      setError('Eroare de conexiune')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Se incarca...' : 'Incarca fisier'}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
