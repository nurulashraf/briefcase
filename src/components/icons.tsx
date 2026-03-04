interface IconProps {
  className?: string
}

export function PlusIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  )
}

export function XIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}

export function TrashIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h12M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1M8 8v6M12 8v6" />
      <path d="M5 5l1 11a1 1 0 001 1h6a1 1 0 001-1l1-11" />
    </svg>
  )
}

export function DownloadIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v10m0 0l-3-3m3 3l3-3M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  )
}

export function NoteIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h8l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <path d="M12 4v4h4M7 10h6M7 13h4" />
    </svg>
  )
}

export function UploadIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13V3m0 0L7 6m3-3l3 3M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  )
}

export function BoldIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h5a3 3 0 010 6H6V4zM6 10h6a3 3 0 010 6H6v-6z" />
    </svg>
  )
}

export function ItalicIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 16h2m0 0l2-12m0 0h2M10 4H8" />
    </svg>
  )
}

export function ListIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 5h9M8 10h9M8 15h9" />
      <circle cx="4" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function OrderedListIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" stroke="none">
      <text x="2" y="7" fontSize="5" fontWeight="600" fontFamily="system-ui">1.</text>
      <text x="2" y="12" fontSize="5" fontWeight="600" fontFamily="system-ui">2.</text>
      <text x="2" y="17" fontSize="5" fontWeight="600" fontFamily="system-ui">3.</text>
      <rect x="8" y="4" width="9" height="1.5" rx="0.75" />
      <rect x="8" y="9" width="9" height="1.5" rx="0.75" />
      <rect x="8" y="14" width="9" height="1.5" rx="0.75" />
    </svg>
  )
}

export function HeadingIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4v12M16 4v12M4 10h12" />
    </svg>
  )
}

export function PinIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2l1.5 1.5L7 7l3 3 3.5-1.5L15 10l-5 5-1.5-1.5L10 10 7 7l-1.5 3.5L4 9l5-5L7.5 2.5" />
      <path d="M4 16l4-4" />
    </svg>
  )
}

export function PinFilledIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" stroke="none">
      <path d="M7 2l1.5 1.5L7 7l3 3 3.5-1.5L15 10l-5 5-1.5-1.5L10 10 7 7l-1.5 3.5L4 9l5-5L7.5 2.5z" />
      <path d="M4 16l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function SunIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M5.05 14.95l1.06-1.06M13.89 6.11l1.06-1.06" />
    </svg>
  )
}

export function MoonIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 10a7 7 0 01-9.9 6.36A7 7 0 017.64 3 5.5 5.5 0 0017 10z" />
    </svg>
  )
}

export function FileIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h8l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <path d="M12 4v4h4" />
    </svg>
  )
}

export function CheckboxIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  )
}

export function ImageIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <circle cx="7.5" cy="7.5" r="1.5" />
      <path d="M17 13l-3.5-3.5L7 16" />
    </svg>
  )
}

export function LogOutIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
