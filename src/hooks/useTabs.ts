import { useState, useEffect, useCallback } from 'react'
import type { Tab } from '../types'
import { getChildTabs, createTab, renameTab, deleteTab, pinTab, reorderTabs } from '../services/tabService'

export function useTabs(parentId: string | null) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTabs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getChildTabs(parentId)
      setTabs(data)
    } catch (err) {
      console.error('Failed to fetch tabs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [parentId])

  useEffect(() => {
    fetchTabs()
  }, [fetchTabs])

  const addTab = useCallback(async (name: string) => {
    try {
      const newTab = await createTab(parentId, name)
      setTabs(prev => [...prev, newTab])
      return newTab
    } catch (err) {
      console.error('Failed to create tab:', err)
      return null
    }
  }, [parentId])

  const updateTabName = useCallback(async (id: string, name: string) => {
    try {
      await renameTab(id, name)
      setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t))
    } catch (err) {
      console.error('Failed to rename tab:', err)
    }
  }, [])

  const removeTab = useCallback(async (id: string) => {
    try {
      await deleteTab(id)
      setTabs(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      console.error('Failed to delete tab:', err)
      return false
    }
  }, [])

  const togglePin = useCallback(async (id: string) => {
    const tab = tabs.find(t => t.id === id)
    if (!tab) return
    const newPinned = !tab.is_pinned
    try {
      await pinTab(id, newPinned)
      setTabs(prev => {
        const updated = prev.map(t => t.id === id ? { ...t, is_pinned: newPinned } : t)
        // Re-sort: pinned first, then by position
        return updated.sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
          return a.position - b.position
        })
      })
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }, [tabs])

  const reorder = useCallback(async (draggedId: string, targetId: string) => {
    setTabs(prev => {
      const dragged = prev.find(t => t.id === draggedId)
      const target = prev.find(t => t.id === targetId)
      if (!dragged || !target || dragged.is_pinned !== target.is_pinned) return prev

      const newTabs = [...prev]
      const fromIndex = newTabs.findIndex(t => t.id === draggedId)
      const toIndex = newTabs.findIndex(t => t.id === targetId)
      newTabs.splice(fromIndex, 1)
      newTabs.splice(toIndex, 0, dragged)

      // Persist new positions
      const ids = newTabs.map(t => t.id)
      reorderTabs(ids).catch(err => console.error('Failed to reorder tabs:', err))

      return newTabs.map((t, i) => ({ ...t, position: i }))
    })
  }, [])

  return { tabs, isLoading, addTab, updateTabName, removeTab, togglePin, reorder, refetch: fetchTabs }
}
