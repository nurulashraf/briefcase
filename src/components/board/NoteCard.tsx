import type { Note } from '../../types'
import { TrashIcon, PinIcon, PinFilledIcon } from '../icons'

interface NoteCardProps {
  note: Note
  onClick: () => void
  onDelete: () => void
  onTogglePin: () => void
  draggable?: boolean
  isDragOver?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  onDragEnd?: () => void
}

export function NoteCard({ note, onClick, onDelete, onTogglePin, draggable, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd }: NoteCardProps) {
  const textPreview = note.content.replace(/<[^>]*>/g, '').slice(0, 200)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', '')
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(e)
  }

  return (
    <div
      className={`bg-white dark:bg-stone-800 rounded-xl p-5 cursor-pointer shadow-sm dark:shadow-stone-950/20 hover:shadow-md dark:hover:shadow-stone-950/30 hover:-translate-y-0.5 transition-all duration-200 group w-full ${
        isDragOver ? 'ring-2 ring-amber-400 dark:ring-amber-500' : ''
      }`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {note.title && (
        <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-1.5 text-sm tracking-tight leading-snug">{note.title}</h3>
      )}
      {textPreview && (
        <p className="text-stone-500 dark:text-stone-400 text-[13px] leading-relaxed line-clamp-6 whitespace-pre-wrap">{textPreview}</p>
      )}
      {!note.title && !textPreview && (
        <p className="text-stone-400 text-[13px] italic">Empty note</p>
      )}
      <div className="flex justify-end gap-1 mt-3 -mb-1 -mr-1">
        <button
          className={`p-1.5 rounded-lg transition-all duration-150 ${
            note.is_pinned
              ? 'text-amber-500 dark:text-amber-400 opacity-100'
              : 'opacity-0 group-hover:opacity-100 text-stone-300 dark:text-stone-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
          }`}
          onClick={e => { e.stopPropagation(); onTogglePin() }}
          title={note.is_pinned ? 'Unpin' : 'Pin'}
        >
          {note.is_pinned ? <PinFilledIcon className="w-3.5 h-3.5" /> : <PinIcon className="w-3.5 h-3.5" />}
        </button>
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150"
          onClick={e => { e.stopPropagation(); onDelete() }}
          title="Delete note"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
