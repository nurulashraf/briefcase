export interface Tab {
  id: string
  parent_id: string | null
  name: string
  position: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  tab_id: string
  title: string
  content: string
  position: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface Attachment {
  id: string
  tab_id: string
  file_name: string
  file_size: number
  mime_type: string
  storage_path: string
  position: number
  is_pinned: boolean
  created_at: string
}
