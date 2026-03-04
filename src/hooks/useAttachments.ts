import { useState, useEffect, useCallback } from 'react'
import type { Attachment } from '../types'
import { getAttachments, uploadAttachment, deleteAttachment, getDownloadUrl, toggleAttachmentPin as toggleAttachmentPinService } from '../services/attachmentService'

export function useAttachments(tabId: string | null) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchAttachments = useCallback(async () => {
    if (!tabId) {
      setAttachments([])
      return
    }
    setIsLoading(true)
    try {
      const data = await getAttachments(tabId)
      setAttachments(data)
    } catch (err) {
      console.error('Failed to fetch attachments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [tabId])

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  const upload = useCallback(async (file: File) => {
    if (!tabId) return null
    setIsUploading(true)
    try {
      const attachment = await uploadAttachment(tabId, file)
      setAttachments(prev => [...prev, attachment])
      return attachment
    } catch (err) {
      console.error('Failed to upload file:', err)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [tabId])

  const remove = useCallback(async (id: string, storagePath: string) => {
    try {
      await deleteAttachment(id, storagePath)
      setAttachments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to delete attachment:', err)
    }
  }, [])

  const download = useCallback(async (storagePath: string, fileName: string) => {
    try {
      const url = await getDownloadUrl(storagePath)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
    } catch (err) {
      console.error('Failed to download file:', err)
    }
  }, [])

  const togglePin = useCallback(async (id: string, is_pinned: boolean) => {
    setAttachments(prev => prev.map(a => a.id === id ? { ...a, is_pinned } : a))
    try {
      await toggleAttachmentPinService(id, is_pinned)
    } catch (err) {
      console.error('Failed to toggle attachment pin:', err)
      setAttachments(prev => prev.map(a => a.id === id ? { ...a, is_pinned: !is_pinned } : a))
    }
  }, [])

  return { attachments, setAttachments, isLoading, isUploading, upload, remove, download, togglePin, refetch: fetchAttachments }
}
