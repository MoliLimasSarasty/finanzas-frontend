import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Si no hay sesión, redirige al login; si la hay, muestra la página pedida.
export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}
