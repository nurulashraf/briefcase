import { useState, useEffect, useCallback } from 'react'
import type { Note, Attachment } from '../types'
import { getNotesByTab, createNote, deleteNote } from '../services/noteService'

export function useBoard(tabId: string | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBoard = useCallback(async () => {
    if (!tabId) {
      setNotes([])
      setAttachments([])
      return
    }

    setIsLoading(true)
    try {
      const notesData = await getNotesByTab(tabId)
      setNotes(notesData)
      // Attachments will be loaded in Phase 5
    } catch (err) {
      console.error('Failed to fetch board:', err)
    } finally {
      setIsLoading(false)
    }
  }, [tabId])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  const addNote = useCallback(async () => {
    if (!tabId) return null
    try {
      const note = await createNote(tabId)
      setNotes(prev => [...prev, note])
      return note
    } catch (err) {
      console.error('Failed to create note:', err)
      return null
    }
  }, [tabId])

  const removeNote = useCallback(async (id: string) => {
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }, [])

  const updateNoteInList = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  }, [])

  return {
    notes,
    attachments,
    setAttachments,
    isLoading,
    addNote,
    removeNote,
    updateNoteInList,
    refetch: fetchBoard,
  }
}
