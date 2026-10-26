import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Debts from './pages/Debts'
import Simulator from './pages/Simulator'
import Categories from './pages/Categories'
import ComingSoon from './pages/ComingSoon'

// Mapa de rutas: qué página se muestra en cada URL.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Todo lo de adentro exige sesión iniciada */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/movimientos" element={<Transactions />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/presupuestos" element={<ComingSoon title="Presupuestos" />} />
              <Route path="/deudas" element={<Debts />} />
              <Route path="/simulador" element={<Simulator />} />
              <Route path="/asistente" element={<ComingSoon title="Asistente financiero IA" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
