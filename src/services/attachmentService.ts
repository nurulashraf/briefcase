import { supabase, BUCKET_NAME } from '../lib/supabase'
import type { Attachment } from '../types'

export async function getAttachments(tabId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('tab_id', tabId)
    .order('position', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function uploadAttachment(tabId: string, file: File): Promise<Attachment> {
  const storagePath = `tabs/${tabId}/${crypto.randomUUID()}_${file.name}`

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file)

  if (uploadError) throw uploadError

  // Get max position
  const existing = await getAttachments(tabId)
  const maxPosition = existing.length > 0
    ? Math.max(...existing.map(a => a.position))
    : -1

  // Insert metadata
  const { data, error } = await supabase
    .from('attachments')
    .insert({
      tab_id: tabId,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
      storage_path: storagePath,
      position: maxPosition + 1,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDownloadUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 3600)

  if (error) throw error
  return data.signedUrl
}

export async function deleteAttachment(id: string, storagePath: string): Promise<void> {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath])

  if (storageError) console.error('Failed to delete file from storage:', storageError)

  // Delete metadata
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id)

  if (error) throw error
}
