import { supabase } from '../lib/supabase'
import type { Note } from '../types'

export async function getNotesByTab(tabId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('tab_id', tabId)
    .order('position', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createNote(tabId: string): Promise<Note> {
  const existing = await getNotesByTab(tabId)
  const maxPosition = existing.length > 0
    ? Math.max(...existing.map(n => n.position))
    : -1

  const { data, error } = await supabase
    .from('notes')
    .insert({ tab_id: tabId, title: '', content: '', position: maxPosition + 1 })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNote(id: string, updates: { title?: string; content?: string }): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleNotePin(id: string, is_pinned: boolean): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update({ is_pinned })
    .eq('id', id)

  if (error) throw error
}

export async function reorderNotes(updates: { id: string; position: number }[]): Promise<void> {
  const results = await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('notes').update({ position }).eq('id', id)
    )
  )
  const failed = results.find(r => r.error)
  if (failed?.error) throw failed.error
}
