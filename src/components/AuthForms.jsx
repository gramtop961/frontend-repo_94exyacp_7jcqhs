import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-slate-200 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  )
}

function Button({ children, onClick, type = 'button', variant = 'primary' }) {
  const styles = variant === 'primary'
    ? 'bg-blue-600 hover:bg-blue-500 text-white'
    : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
  return (
    <button type={type} onClick={onClick} className={`w-full py-2 rounded transition ${styles}`}>
      {children}
    </button>
  )
}

export default function AuthForms({ onAuth }) {
  const [mode, setMode] = useState('login') // login | signup | forgot | reset | otp
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // shared fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [otpTarget, setOtpTarget] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSignup = async () => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')
      setMessage('Signup successful. You can now log in.')
      setMode('login')
    } catch (e) {
      setMessage(e.message)
    } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      onAuth && onAuth(data)
    } catch (e) { setMessage(e.message) }
    finally { setLoading(false) }
  }

  const handleForgot = async () => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setMessage(data.message + (data.token ? ` Token: ${data.token}` : ''))
      if (data.token) setResetToken(data.token)
      setMode('reset')
    } catch (e) { setMessage(e.message) }
    finally { setLoading(false) }
  }

  const handleReset = async () => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, new_password: newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      setMessage('Password updated. Please log in.')
      setMode('login')
    } catch (e) { setMessage(e.message) }
    finally { setLoading(false) }
  }

  const handleOtpRequest = async (channel) => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, target: otpTarget, purpose: 'login' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'OTP request failed')
      setMessage(`OTP sent. Code: ${data.code}`)
      setMode('otp')
    } catch (e) { setMessage(e.message) }
    finally { setLoading(false) }
  }

  const handleOtpVerify = async () => {
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: otpTarget, code: otpCode, purpose: 'login' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'OTP verify failed')
      onAuth && onAuth(data)
    } catch (e) { setMessage(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-slate-800 text-slate-200'}`}>Login</button>
        <button onClick={() => setMode('signup')} className={`px-3 py-1 rounded ${mode==='signup'?'bg-blue-600 text-white':'bg-slate-800 text-slate-200'}`}>Sign Up</button>
      </div>

      {mode === 'signup' && (
        <div>
          <Input label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Doe" />
          <Input label="Email" value={email} onChange={setEmail} placeholder="jane@example.com" />
          <Input label="Phone" value={phone} onChange={setPhone} placeholder="+15551234567" />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          <Button onClick={handleSignup}>{loading ? 'Please wait...' : 'Create account'}</Button>
        </div>
      )}

      {mode === 'login' && (
        <div>
          <Input label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMode('forgot')} className="text-sm text-blue-400 hover:underline">Forgot password?</button>
          </div>
          <Button onClick={handleLogin}>{loading ? 'Please wait...' : 'Login'}</Button>
          <div className="mt-4 p-3 rounded bg-slate-800 text-slate-200">
            <p className="text-sm mb-2">Or login with OTP</p>
            <Input label="Email or Phone" value={otpTarget} onChange={setOtpTarget} placeholder="you@example.com or +1555..." />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleOtpRequest(otpTarget.includes('@') ? 'email' : 'phone')}>Send OTP</Button>
            </div>
          </div>
        </div>
      )}

      {mode === 'forgot' && (
        <div>
          <Input label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <Button onClick={handleForgot}>{loading ? 'Please wait...' : 'Send reset link'}</Button>
        </div>
      )}

      {mode === 'reset' && (
        <div>
          <Input label="Reset token" value={resetToken} onChange={setResetToken} placeholder="Paste token here" />
          <Input label="New password" type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
          <Button onClick={handleReset}>{loading ? 'Please wait...' : 'Reset password'}</Button>
        </div>
      )}

      {mode === 'otp' && (
        <div>
          <Input label="Target" value={otpTarget} onChange={setOtpTarget} placeholder="you@example.com or +1555..." />
          <Input label="OTP Code" value={otpCode} onChange={setOtpCode} placeholder="6-digit code" />
          <Button onClick={handleOtpVerify}>{loading ? 'Please wait...' : 'Verify & Login'}</Button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-slate-200">{message}</p>}
    </div>
  )
}
