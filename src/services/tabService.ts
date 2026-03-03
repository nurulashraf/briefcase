import { supabase } from '../lib/supabase'
import type { Tab } from '../types'

export async function getChildTabs(parentId: string | null): Promise<Tab[]> {
  const query = supabase
    .from('tabs')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('position', { ascending: true })

  if (parentId === null) {
    query.is('parent_id', null)
  } else {
    query.eq('parent_id', parentId)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createTab(parentId: string | null, name: string): Promise<Tab> {
  // Get max position among siblings
  const siblings = await getChildTabs(parentId)
  const maxPosition = siblings.length > 0
    ? Math.max(...siblings.map(t => t.position))
    : -1

  const { data, error } = await supabase
    .from('tabs')
    .insert({ parent_id: parentId, name, position: maxPosition + 1 })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function renameTab(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('tabs')
    .update({ name })
    .eq('id', id)

  if (error) throw error
}

export async function deleteTab(id: string): Promise<void> {
  const { error } = await supabase
    .from('tabs')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function pinTab(id: string, isPinned: boolean): Promise<void> {
  const { error } = await supabase
    .from('tabs')
    .update({ is_pinned: isPinned })
    .eq('id', id)

  if (error) throw error
}

export async function reorderTabs(tabIds: string[]): Promise<void> {
  const updates = tabIds.map((id, index) =>
    supabase.from('tabs').update({ position: index }).eq('id', id)
  )
  const results = await Promise.all(updates)
  const failed = results.find(r => r.error)
  if (failed?.error) throw failed.error
}
