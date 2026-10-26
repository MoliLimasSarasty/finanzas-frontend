import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/movimientos', label: 'Ingresos y gastos' },
  { to: '/presupuestos', label: 'Presupuestos' },
  { to: '/deudas', label: 'Deudas' },
  { to: '/simulador', label: 'Simulador' },
  { to: '/asistente', label: 'Asistente IA' },
]

// Estructura común: menú lateral + contenido de la página actual (<Outlet />).
export default function Layout() {
  const { userName, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex">
      {/* Barra superior solo en móvil */}
      <header className="flex items-center justify-between bg-emerald-700 p-4 text-white md:hidden">
        <span className="font-bold">FinanzIA</span>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">☰</button>
      </header>

      <aside
        className={`${menuOpen ? 'block' : 'hidden'} w-full bg-emerald-800 p-4 text-emerald-50 md:block md:w-60 md:shrink-0`}
      >
        <h1 className="mb-6 hidden text-xl font-bold md:block">FinanzIA</h1>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'bg-emerald-600 font-semibold' : 'hover:bg-emerald-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-emerald-700 pt-4 text-sm">
          <p className="mb-2">Hola, {userName}</p>
          <button onClick={logout} className="underline hover:text-white">Cerrar sesión</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
