import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, displayName)
    setLoading(false)
    if (result.success) navigate('/app/dashboard')
    else setError(result.message)
  }

  const handleGoogle = async () => {
    setLoading(true)
    const res = await signInWithGoogle()
    setLoading(false)
    if (res.success) navigate('/app/dashboard')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Link Guru</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'signin' ? 'Sign in to continue' : 'Start your free trial'}
          </p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-4 inline-flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <img alt="Google" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
          <span>{loading ? 'Processing...' : 'Continue with Google'}</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">or</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === 'signin' ? (
            <>Don't have an account? <button onClick={() => setMode('signup')} className="text-primary-600 hover:text-primary-700 font-medium">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode('signin')} className="text-primary-600 hover:text-primary-700 font-medium">Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}


