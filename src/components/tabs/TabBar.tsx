import { useState } from 'react'
import { TabItem } from './TabItem'
import { CreateTabButton } from './CreateTabButton'
import type { Tab } from '../../types'

interface TabBarProps {
  tabs: Tab[]
  activeId: string | null
  variant: 'dark' | 'light'
  onSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onClose: (id: string) => void
  onTogglePin: (id: string) => void
  onReorder: (draggedId: string, targetId: string) => void
  onCreate: () => void
  trailing?: React.ReactNode
}

export function TabBar({ tabs, activeId, variant, onSelect, onRename, onClose, onTogglePin, onReorder, onCreate, trailing }: TabBarProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const pinnedTabs = tabs.filter(t => t.is_pinned)
  const unpinnedTabs = tabs.filter(t => !t.is_pinned)
  const hasPinned = pinnedTabs.length > 0

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (targetId !== draggedId) {
      setDragOverId(targetId)
    }
  }

  const handleDrop = (targetId: string) => {
    if (draggedId && draggedId !== targetId) {
      onReorder(draggedId, targetId)
    }
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const renderTab = (tab: Tab) => (
    <TabItem
      key={tab.id}
      name={tab.name}
      isActive={tab.id === activeId}
      isPinned={tab.is_pinned}
      variant={variant}
      isDragOver={dragOverId === tab.id}
      onSelect={() => onSelect(tab.id)}
      onRename={(name) => onRename(tab.id, name)}
      onClose={() => onClose(tab.id)}
      onTogglePin={() => onTogglePin(tab.id)}
      onDragStart={() => setDraggedId(tab.id)}
      onDragOver={(e) => handleDragOver(e, tab.id)}
      onDrop={() => handleDrop(tab.id)}
      onDragEnd={handleDragEnd}
    />
  )

  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {pinnedTabs.map(renderTab)}

      {hasPinned && unpinnedTabs.length > 0 && (
        <div className={`w-px h-4 mx-1 ${variant === 'dark' ? 'bg-stone-600' : 'bg-stone-300 dark:bg-stone-600'}`} />
      )}

      {unpinnedTabs.map(renderTab)}

      <CreateTabButton variant={variant} onClick={onCreate} />

      {trailing && (
        <>
          <div className="flex-1" />
          {trailing}
        </>
      )}
    </div>
  )
}
