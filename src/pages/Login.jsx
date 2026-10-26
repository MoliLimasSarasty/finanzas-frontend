import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault() // evita que el navegador recargue la página
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-emerald-700">FinanzIA</h1>
        <p className="mb-6 text-sm text-slate-500">Inicia sesión para ver tus finanzas</p>

        <label className="mb-1 block text-sm font-medium">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />

        <label className="mb-1 block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />

        {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
