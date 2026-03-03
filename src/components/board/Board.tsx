import { useState, useRef } from 'react'
import { useBoard } from '../../hooks/useBoard'
import { useAttachments } from '../../hooks/useAttachments'
import { NoteCard } from './NoteCard'
import { FileCard } from './FileCard'
import { NoteModal } from './NoteModal'
import { NoteIcon, UploadIcon } from '../icons'
import type { Note } from '../../types'

interface BoardProps {
  tabId: string
}

export function Board({ tabId }: BoardProps) {
  const { notes, isLoading: notesLoading, addNote, removeNote, updateNoteInList } = useBoard(tabId)
  const { attachments, isLoading: filesLoading, isUploading, upload, remove, download } = useAttachments(tabId)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const isLoading = notesLoading || filesLoading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-6 h-6 border-2 border-stone-300 dark:border-stone-700 border-t-stone-600 dark:border-t-stone-400 rounded-full animate-spin" />
      </div>
    )
  }

  const hasContent = notes.length > 0 || attachments.length > 0

  type CardItem =
    | { type: 'note'; data: Note }
    | { type: 'file'; data: typeof attachments[number] }

  const cards: CardItem[] = [
    ...notes.map(n => ({ type: 'note' as const, data: n })),
    ...attachments.map(a => ({ type: 'file' as const, data: a })),
  ].sort((a, b) => a.data.position - b.data.position)

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

      {/* Masonry grid */}
      {hasContent ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {cards.map(card =>
            card.type === 'note' ? (
              <NoteCard
                key={`note-${card.data.id}`}
                note={card.data}
                onClick={() => setEditingNote(card.data)}
                onDelete={() => removeNote(card.data.id)}
              />
            ) : (
              <FileCard
                key={`file-${card.data.id}`}
                attachment={card.data}
                onDownload={() => download(card.data.storage_path, card.data.file_name)}
                onDelete={() => remove(card.data.id, card.data.storage_path)}
              />
            )
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
