import { useState, useRef, useEffect } from 'react'
import { XIcon } from '../icons'

interface TabItemProps {
  name: string
  isActive: boolean
  isPinned: boolean
  variant: 'dark' | 'light'
  isDragOver: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onClose: () => void
  onTogglePin: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  onDragEnd: () => void
}

interface MenuPosition {
  x: number
  y: number
}

export function TabItem({
  name, isActive, isPinned, variant, isDragOver,
  onSelect, onRename, onClose, onTogglePin,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: TabItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const [menu, setMenu] = useState<MenuPosition | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menu) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menu])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPinned) return
    e.stopPropagation()
    setEditValue(name)
    setIsEditing(true)
  }

  const handleSubmit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) {
      onRename(trimmed)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', '')
    onDragStart()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop()
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd()
  }

  const dark = variant === 'dark'

  const baseClasses = isPinned
    ? 'group relative flex items-center justify-center w-8 h-8 text-[13px] font-semibold cursor-pointer rounded-lg select-none transition-all duration-200'
    : 'group relative flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 text-[13px] font-medium cursor-pointer rounded-lg select-none transition-all duration-200'

  const stateClasses = dark
    ? isActive
      ? 'bg-stone-600/70 text-white shadow-sm'
      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
    : isActive
      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
      : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-300/40 dark:hover:bg-stone-700/50'

  const dragClasses = isDragging ? 'opacity-40' : isDragOver ? (dark ? 'ring-2 ring-stone-400/50 rounded-lg' : 'ring-2 ring-stone-400/50 dark:ring-stone-500/50 rounded-lg') : ''

  const inputClasses = dark
    ? 'bg-transparent outline-none text-[13px] font-medium w-24 text-white border-b border-stone-400'
    : 'bg-transparent outline-none text-[13px] font-medium w-24 text-stone-900 dark:text-stone-100 border-b border-stone-400'

  const menuItemBase = 'w-full text-left px-3 py-1.5 text-[13px] cursor-pointer transition-colors duration-100'
  const menuItemClasses = dark
    ? `${menuItemBase} text-stone-200 hover:bg-stone-600`
    : `${menuItemBase} text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700`

  return (
    <>
      <div
        className={`${baseClasses} ${stateClasses} ${dragClasses}`}
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {isPinned ? (
          <span title={name}>{name.charAt(0).toUpperCase()}</span>
        ) : isEditing ? (
          <input
            ref={inputRef}
            className={inputClasses}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <>
            <span className="max-w-28 truncate">{name}</span>
            <button
              className={`ml-auto p-0.5 rounded transition-colors duration-100 ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              } ${
                dark
                  ? 'hover:bg-stone-500/50 text-stone-400 hover:text-stone-200'
                  : 'hover:bg-stone-300/60 dark:hover:bg-stone-600/60 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
              onClick={(e) => { e.stopPropagation(); onClose() }}
              title="Close tab"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Context menu */}
      {menu && (
        <div
          ref={menuRef}
          className={`fixed z-[100] min-w-[140px] py-1 rounded-lg shadow-lg border ${
            dark
              ? 'bg-stone-700 border-stone-600'
              : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
          }`}
          style={{ left: menu.x, top: menu.y }}
        >
          <button
            className={menuItemClasses}
            onClick={() => { onTogglePin(); setMenu(null) }}
          >
            {isPinned ? 'Unpin tab' : 'Pin tab'}
          </button>
          {!isPinned && (
            <>
              <button
                className={menuItemClasses}
                onClick={() => { setEditValue(name); setIsEditing(true); setMenu(null) }}
              >
                Rename
              </button>
              <div className={`my-1 border-t ${dark ? 'border-stone-600' : 'border-stone-100 dark:border-stone-700'}`} />
              <button
                className={`${menuItemBase} text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30`}
                onClick={() => { onClose(); setMenu(null) }}
              >
                Close tab
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
