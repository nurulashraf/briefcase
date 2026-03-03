import { PlusIcon } from '../icons'

interface CreateTabButtonProps {
  variant: 'dark' | 'light'
  onClick: () => void
}

export function CreateTabButton({ variant, onClick }: CreateTabButtonProps) {
  const dark = variant === 'dark'

  return (
    <button
      className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ${
        dark
          ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
          : 'text-stone-400 hover:text-stone-600 hover:bg-stone-300/40'
      }`}
      onClick={onClick}
      title="New tab"
    >
      <PlusIcon className="w-4 h-4" />
    </button>
  )
}
