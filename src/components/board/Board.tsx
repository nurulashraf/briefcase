import { useState, useRef, useCallback } from 'react'
import { useBoard } from '../../hooks/useBoard'
import { useAttachments } from '../../hooks/useAttachments'
import { NoteCard } from './NoteCard'
import { FileCard } from './FileCard'
import { NoteModal } from './NoteModal'
import { NoteIcon, UploadIcon } from '../icons'
import { reorderNotes } from '../../services/noteService'
import { reorderAttachments } from '../../services/attachmentService'
import type { Note } from '../../types'

interface BoardProps {
  tabId: string
}

type CardKey = { type: 'note' | 'file'; id: string }

export function Board({ tabId }: BoardProps) {
  const { notes, setNotes, isLoading: notesLoading, addNote, removeNote, updateNoteInList, toggleNotePin } = useBoard(tabId)
  const { attachments, setAttachments, isLoading: filesLoading, isUploading, upload, remove, download, togglePin: toggleFilePin } = useAttachments(tabId)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag state
  const [draggedKey, setDraggedKey] = useState<CardKey | null>(null)
  const [dragOverKey, setDragOverKey] = useState<CardKey | null>(null)

  const handleAddNote = async () => {
    const note = await addNote()
    if (note) setEditingNote(note)
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      await upload(file)
    }
  }

  // Build unified card list
  type CardItem =
    | { type: 'note'; data: Note }
    | { type: 'file'; data: typeof attachments[number] }

  const allCards: CardItem[] = [
    ...notes.map(n => ({ type: 'note' as const, data: n })),
    ...attachments.map(a => ({ type: 'file' as const, data: a })),
  ].sort((a, b) => a.data.position - b.data.position)

  const pinnedCards = allCards.filter(c => c.data.is_pinned)
  const unpinnedCards = allCards.filter(c => !c.data.is_pinned)

  // Drag handlers
  const handleDragStart = useCallback((key: CardKey) => {
    setDraggedKey(key)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, key: CardKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!draggedKey || (draggedKey.type === key.type && draggedKey.id === key.id)) return
    setDragOverKey(key)
  }, [draggedKey])

  const handleDrop = useCallback((e: React.DragEvent, targetKey: CardKey) => {
    e.preventDefault()
    if (!draggedKey || (draggedKey.type === targetKey.type && draggedKey.id === targetKey.id)) {
      setDraggedKey(null)
      setDragOverKey(null)
      return
    }

    // Determine which section we're in
    const draggedCard = allCards.find(c => c.type === draggedKey.type && c.data.id === draggedKey.id)
    const targetCard = allCards.find(c => c.type === targetKey.type && c.data.id === targetKey.id)
    if (!draggedCard || !targetCard) return

    // Only allow reorder within same section (pinned or unpinned)
    if (draggedCard.data.is_pinned !== targetCard.data.is_pinned) {
      setDraggedKey(null)
      setDragOverKey(null)
      return
    }

    const section = draggedCard.data.is_pinned ? pinnedCards : unpinnedCards
    const fromIndex = section.findIndex(c => c.type === draggedKey.type && c.data.id === draggedKey.id)
    const toIndex = section.findIndex(c => c.type === targetKey.type && c.data.id === targetKey.id)

    if (fromIndex === -1 || toIndex === -1) return

    // Reorder
    const reordered = [...section]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    // Assign new positions
    const noteUpdates: { id: string; position: number }[] = []
    const fileUpdates: { id: string; position: number }[] = []

    reordered.forEach((card, i) => {
      if (card.type === 'note') {
        noteUpdates.push({ id: card.data.id, position: i })
      } else {
        fileUpdates.push({ id: card.data.id, position: i })
      }
    })

    // Optimistic update
    if (noteUpdates.length > 0) {
      setNotes(prev => prev.map(n => {
        const update = noteUpdates.find(u => u.id === n.id)
        return update ? { ...n, position: update.position } : n
      }))
      reorderNotes(noteUpdates).catch(err => console.error('Failed to reorder notes:', err))
    }

    if (fileUpdates.length > 0) {
      setAttachments(prev => prev.map(a => {
        const update = fileUpdates.find(u => u.id === a.id)
        return update ? { ...a, position: update.position } : a
      }))
      reorderAttachments(fileUpdates).catch(err => console.error('Failed to reorder attachments:', err))
    }

    setDraggedKey(null)
    setDragOverKey(null)
  }, [draggedKey, allCards, pinnedCards, unpinnedCards, setNotes, setAttachments])

  const handleDragEnd = useCallback(() => {
    setDraggedKey(null)
    setDragOverKey(null)
  }, [])

  const isDragOver = (key: CardKey) =>
    dragOverKey?.type === key.type && dragOverKey?.id === key.id

  const renderCard = (card: CardItem) => {
    const key: CardKey = { type: card.type, id: card.data.id }

    if (card.type === 'note') {
      return (
        <div key={`note-${card.data.id}`} className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.67rem)] lg:w-[calc(25%-0.75rem)]">
          <NoteCard
            note={card.data}
            onClick={() => setEditingNote(card.data)}
            onDelete={() => removeNote(card.data.id)}
            onTogglePin={() => toggleNotePin(card.data.id, !card.data.is_pinned)}
            draggable
            isDragOver={isDragOver(key)}
            onDragStart={() => handleDragStart(key)}
            onDragOver={(e) => handleDragOver(e, key)}
            onDrop={(e) => handleDrop(e, key)}
            onDragEnd={handleDragEnd}
          />
        </div>
      )
    }

    return (
      <div key={`file-${card.data.id}`} className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.67rem)] lg:w-[calc(25%-0.75rem)]">
        <FileCard
          attachment={card.data}
          onDownload={() => download(card.data.storage_path, card.data.file_name)}
          onDelete={() => remove(card.data.id, card.data.storage_path)}
          onTogglePin={() => toggleFilePin(card.data.id, !card.data.is_pinned)}
          draggable
          isDragOver={isDragOver(key)}
          onDragStart={() => handleDragStart(key)}
          onDragOver={(e) => handleDragOver(e, key)}
          onDrop={(e) => handleDrop(e, key)}
          onDragEnd={handleDragEnd}
        />
      </div>
    )
  }

  const isLoading = notesLoading || filesLoading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-6 h-6 border-2 border-stone-300 dark:border-stone-700 border-t-stone-600 dark:border-t-stone-400 rounded-full animate-spin" />
      </div>
    )
  }

  const hasContent = notes.length > 0 || attachments.length > 0

  return (
    <div>
      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <button
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-white dark:bg-stone-800 rounded-xl shadow-sm dark:shadow-stone-950/20 hover:shadow-md dark:hover:shadow-stone-950/30 hover:-translate-y-0.5 transition-all duration-200 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          onClick={handleAddNote}
        >
          <NoteIcon className="w-4 h-4" />
          Add Note
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-white dark:bg-stone-800 rounded-xl shadow-sm dark:shadow-stone-950/20 hover:shadow-md dark:hover:shadow-stone-950/30 hover:-translate-y-0.5 transition-all duration-200 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <UploadIcon className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Board content */}
      {hasContent ? (
        <div>
          {/* Pinned section */}
          {pinnedCards.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">Pinned</p>
              <div className="flex flex-wrap gap-4">
                {pinnedCards.map(renderCard)}
              </div>
            </div>
          )}

          {/* Unpinned section */}
          {unpinnedCards.length > 0 && (
            <div>
              {pinnedCards.length > 0 && (
                <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">Others</p>
              )}
              <div className="flex flex-wrap gap-4">
                {unpinnedCards.map(renderCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-stone-400 dark:text-stone-500">
          <svg className="w-20 h-20 mb-5 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
            <circle cx="7" cy="7.5" r="0.5" fill="currentColor" />
            <circle cx="9.5" cy="7.5" r="0.5" fill="currentColor" />
            <circle cx="12" cy="7.5" r="0.5" fill="currentColor" />
          </svg>
          <p className="text-base font-medium text-stone-400 dark:text-stone-500">This board is empty</p>
          <p className="text-sm mt-1 text-stone-300 dark:text-stone-600">Add notes or upload files to get started</p>
        </div>
      )}

      {/* Note editor modal */}
      {editingNote && (
        <NoteModal
          key={editingNote.id}
          note={editingNote}
          onClose={(currentTitle, currentContent) => {
            const isEmpty = !currentTitle.trim() && (!currentContent || currentContent === '<p></p>' || !currentContent.replace(/<[^>]*>/g, '').trim())
            if (isEmpty) {
              removeNote(editingNote.id)
            }
            setEditingNote(null)
          }}
          onUpdate={updateNoteInList}
        />
      )}
    </div>
  )
}
