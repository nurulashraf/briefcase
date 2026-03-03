import { useState, useEffect } from 'react'
import { TabBar } from '../tabs/TabBar'
import { Board } from '../board/Board'
import { ThemeToggle } from './ThemeToggle'
import { useTabs } from '../../hooks/useTabs'
import { useTheme } from '../../hooks/useTheme'
import { LogOutIcon } from '../icons'

interface AppShellProps {
  onSignOut: () => void
}

export function AppShell({ onSignOut }: AppShellProps) {
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()

  // Row 1: top-level tabs
  const {
    tabs: topTabs,
    addTab: addTopTab,
    updateTabName: renameTopTab,
    removeTab: removeTopTab,
    togglePin: togglePinTopTab,
    reorder: reorderTopTab,
  } = useTabs(null)

  // Row 2: sub-tabs of the active top-level tab
  const {
    tabs: subTabs,
    addTab: addSubTab,
    updateTabName: renameSubTab,
    removeTab: removeSubTab,
    togglePin: togglePinSubTab,
    reorder: reorderSubTab,
  } = useTabs(activeTabId)

  // Auto-select first tab if none selected
  useEffect(() => {
    if (!activeTabId && topTabs.length > 0) {
      setActiveTabId(topTabs[0].id)
    }
  }, [topTabs, activeTabId])

  // Reset sub-tab when switching tabs
  useEffect(() => {
    setActiveSubTabId(null)
  }, [activeTabId])

  // Auto-select first sub-tab if available
  useEffect(() => {
    if (!activeSubTabId && subTabs.length > 0) {
      setActiveSubTabId(subTabs[0].id)
    }
  }, [subTabs, activeSubTabId])

  const handleCloseTopTab = async (id: string) => {
    // Prevent closing pinned tabs
    const tab = topTabs.find(t => t.id === id)
    if (tab?.is_pinned) return

    const removed = await removeTopTab(id)
    if (removed && activeTabId === id) {
      setActiveTabId(topTabs.find(t => t.id !== id)?.id ?? null)
    }
  }

  const handleCloseSubTab = async (id: string) => {
    const tab = subTabs.find(t => t.id === id)
    if (tab?.is_pinned) return

    const removed = await removeSubTab(id)
    if (removed && activeSubTabId === id) {
      setActiveSubTabId(subTabs.find(t => t.id !== id)?.id ?? null)
    }
  }

  const handleCreateTopTab = async () => {
    const tab = await addTopTab('New Tab')
    if (tab) setActiveTabId(tab.id)
  }

  const handleCreateSubTab = async () => {
    const tab = await addSubTab('New Sub-Tab')
    if (tab) setActiveSubTabId(tab.id)
  }

  const boardTabId = activeSubTabId ?? activeTabId

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-300">
      {/* Row 1: Top-level tabs — dark bar */}
      <div className="bg-stone-800 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <TabBar
          tabs={topTabs}
          activeId={activeTabId}
          variant="dark"
          onSelect={setActiveTabId}
          onRename={renameTopTab}
          onClose={handleCloseTopTab}
          onTogglePin={togglePinTopTab}
          onReorder={reorderTopTab}
          onCreate={handleCreateTopTab}
          trailing={
            <div className="flex items-center gap-1">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-700/50 transition-all duration-200 cursor-pointer"
                onClick={onSignOut}
                title="Sign out"
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          }
        />
      </div>

      {/* Row 2: Sub-tabs — light bar */}
      {activeTabId && (
        <div className="bg-stone-200/80 dark:bg-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <TabBar
            tabs={subTabs}
            activeId={activeSubTabId}
            variant="light"
            onSelect={setActiveSubTabId}
            onRename={renameSubTab}
            onClose={handleCloseSubTab}
            onTogglePin={togglePinSubTab}
            onReorder={reorderSubTab}
            onCreate={handleCreateSubTab}
          />
        </div>
      )}

      {/* Board content area */}
      <div className="flex-1 px-8 py-6">
        {boardTabId ? (
          <Board key={boardTabId} tabId={boardTabId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400">
            <svg className="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <p className="text-lg font-medium">No tabs yet</p>
            <p className="text-sm mt-1">Click the + button above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
