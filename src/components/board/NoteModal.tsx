import { useState, useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import type { Note } from '../../types'
import { updateNote } from '../../services/noteService'
import { BoldIcon, ItalicIcon, ListIcon, OrderedListIcon, HeadingIcon, CheckboxIcon, ImageIcon } from '../icons'

interface NoteModalProps {
  note: Note
  onClose: (title: string, content: string) => void
  onUpdate: (id: string, updates: Partial<Note>) => void
}

export function NoteModal({ note, onClose, onUpdate }: NoteModalProps) {
  const [title, setTitle] = useState(note.title)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onUpdate(note.id, { content: html })
      debouncedSave({ content: html })
    },
  })

  const debouncedSave = useCallback((updates: { title?: string; content?: string }) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateNote(note.id, updates)
      } catch (err) {
        console.error('Failed to save note:', err)
      }
    }, 500)
  }, [note.id])

  useEffect(() => {
    if (title !== note.title) {
      onUpdate(note.id, { title })
      debouncedSave({ title })
    }
  }, [title, note.id, note.title, onUpdate, debouncedSave])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const handleClose = useCallback(() => {
    const content = editor?.getHTML() ?? ''
    onClose(title, content)
  }, [onClose, title, editor])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClose])

  const handleImageUpload = (files: FileList | null) => {
    if (!files || !editor) return
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result as string
        editor.chain().focus().setImage({ src }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm animate-backdrop-in"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl dark:shadow-stone-950/40 w-full max-w-2xl max-h-[80vh] flex flex-col mx-4 animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Title */}
        <input
          className="w-full px-6 pt-6 pb-2 text-xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight outline-none border-none bg-transparent placeholder-stone-300 dark:placeholder-stone-600"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Toolbar */}
        {editor && (
          <div className="flex gap-0.5 px-6 pb-3 pt-1">
            <ToolbarButton
              icon={<BoldIcon className="w-4 h-4" />}
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              icon={<ItalicIcon className="w-4 h-4" />}
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <div className="w-px bg-stone-200 dark:bg-stone-700 mx-1.5" />
            <ToolbarButton
              icon={<HeadingIcon className="w-4 h-4" />}
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              icon={<ListIcon className="w-4 h-4" />}
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              icon={<OrderedListIcon className="w-4 h-4" />}
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              icon={<CheckboxIcon className="w-4 h-4" />}
              active={editor.isActive('taskList')}
              onClick={() => editor.chain().focus().toggleTaskList().run()}
            />
            <div className="w-px bg-stone-200 dark:bg-stone-700 mx-1.5" />
            <ToolbarButton
              icon={<ImageIcon className="w-4 h-4" />}
              active={false}
              onClick={() => imageInputRef.current?.click()}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => { handleImageUpload(e.target.files); e.target.value = '' }}
            />
          </div>
        )}

        {/* Divider */}
        <div className="mx-6 border-t border-stone-100 dark:border-stone-700" />

        {/* Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-4 tiptap-editor">
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-stone-100 dark:border-stone-700">
          <button
            className="px-4 py-2 text-[13px] font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-all duration-150 cursor-pointer"
            onClick={handleClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({ icon, active, onClick }: {
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`p-2 rounded-lg cursor-pointer transition-all duration-150 ${
        active
          ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  )
}
