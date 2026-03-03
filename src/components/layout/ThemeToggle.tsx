import { SunIcon, MoonIcon } from '../icons'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-700/50 transition-all duration-200 cursor-pointer"
      onClick={onToggle}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
    </button>
  )
}
