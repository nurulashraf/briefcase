-- ============================================================
-- BRIEFCASE — Master Schema
-- ============================================================

-- ============================================================
-- TABS TABLE (self-referencing for tab/sub-tab hierarchy)
-- parent_id = NULL → Row 1 (top-level tab)
-- parent_id = <tab id> → Row 2 (sub-tab)
-- ============================================================
CREATE TABLE tabs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id   UUID REFERENCES tabs(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'New Tab',
  position    INTEGER NOT NULL DEFAULT 0,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tabs_parent_id ON tabs(parent_id);

-- ============================================================
-- NOTES TABLE (multiple notes per tab, Google Keep style)
-- ============================================================
CREATE TABLE notes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id      UUID NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notes_tab_id ON notes(tab_id);

-- ============================================================
-- ATTACHMENTS TABLE (metadata; files in Supabase Storage)
-- ============================================================
CREATE TABLE attachments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id        UUID NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_size     BIGINT NOT NULL DEFAULT 0,
  mime_type     TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_path  TEXT NOT NULL,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_attachments_tab_id ON attachments(tab_id);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tabs_updated_at
  BEFORE UPDATE ON tabs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Storage bucket (run this or create via Supabase dashboard)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('briefcase-files', 'briefcase-files', false)
ON CONFLICT (id) DO NOTHING;
