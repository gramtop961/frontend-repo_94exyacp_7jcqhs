import { useState } from 'react'
import AuthForms from './components/AuthForms'

function App() {
  const [session, setSession] = useState(null)

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Hospital Management</h1>
            <p className="text-slate-300">Sign up or log in to continue. You can also use OTP-based login.</p>
          </div>
          <div className="flex items-center justify-center">
            <AuthForms onAuth={(data) => setSession(data)} />
          </div>
        </div>
      </div>
    )
  }

  // Home page after login
  const profile = session?.profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Hospital Management</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">{profile?.full_name} ({profile?.role})</div>
            <button
              onClick={() => setSession(null)}
              className="px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
            >Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-600">This is a placeholder home page. We can add appointments, prescriptions, and more next.</p>
          <div className="mt-4 p-3 rounded bg-gray-50 text-sm text-gray-700">
            <div>Token: <span className="font-mono break-all">{session?.token}</span></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
