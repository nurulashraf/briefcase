import type { Attachment } from '../../types'
import { formatFileSize } from '../../lib/utils'
import { DownloadIcon, TrashIcon } from '../icons'

interface FileCardProps {
  attachment: Attachment
  onDownload: () => void
  onDelete: () => void
}

const EXTENSION_COLORS: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700',
  doc: 'bg-blue-100 text-blue-700',
  docx: 'bg-blue-100 text-blue-700',
  xls: 'bg-green-100 text-green-700',
  xlsx: 'bg-green-100 text-green-700',
  ppt: 'bg-orange-100 text-orange-700',
  pptx: 'bg-orange-100 text-orange-700',
  png: 'bg-purple-100 text-purple-700',
  jpg: 'bg-purple-100 text-purple-700',
  jpeg: 'bg-purple-100 text-purple-700',
  gif: 'bg-purple-100 text-purple-700',
  svg: 'bg-pink-100 text-pink-700',
  mp4: 'bg-indigo-100 text-indigo-700',
  mp3: 'bg-amber-100 text-amber-700',
  zip: 'bg-stone-200 text-stone-600',
  rar: 'bg-stone-200 text-stone-600',
  txt: 'bg-stone-100 text-stone-600',
  csv: 'bg-green-100 text-green-700',
  json: 'bg-yellow-100 text-yellow-700',
}

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function getExtensionColor(ext: string): string {
  return EXTENSION_COLORS[ext] ?? 'bg-stone-100 text-stone-500'
}

export function FileCard({ attachment, onDownload, onDelete }: FileCardProps) {
  const ext = getExtension(attachment.file_name)

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl p-5 shadow-sm dark:shadow-stone-950/20 hover:shadow-md dark:hover:shadow-stone-950/30 hover:-translate-y-0.5 transition-all duration-200 break-inside-avoid mb-4 group">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${getExtensionColor(ext)}`}>
          {ext || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate leading-snug">{attachment.file_name}</p>
          <p className="text-xs text-stone-400 mt-0.5">{formatFileSize(attachment.file_size)}</p>
        </div>
      </div>
      <div className="flex gap-1 justify-end mt-3 -mb-1 -mr-1">
        <button
          className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all duration-150 cursor-pointer"
          onClick={onDownload}
          title="Download"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
        </button>
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150 cursor-pointer"
          onClick={onDelete}
          title="Delete"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
