import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './components/auth/LoginPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 dark:border-stone-700 border-t-stone-600 dark:border-t-stone-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />
  }

  return <AppShell onSignOut={signOut} />
}

export default App
