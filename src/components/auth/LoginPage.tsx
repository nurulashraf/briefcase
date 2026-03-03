import { useState } from 'react'

interface LoginPageProps {
  onSignIn: () => void
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = () => {
    setIsLoading(true)
    onSignIn()
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-sm mx-4">
        {/* Logo / App name */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-stone-800 dark:bg-stone-700 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">Briefcase</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Your personal workspace</p>
        </div>

        {/* Sign in card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm dark:shadow-stone-950/20 p-8">
          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-600 hover:shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  )
}
