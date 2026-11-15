import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import BudgetForm from '../components/BudgetForm'
import StatCard from '../components/StatCard'
import { createBudget, deleteBudget, getBudgets, getCategories, getTransactions, updateBudget } from '../api/services'
import { money } from '../utils/format'

// Mes actual en formato AAAA-MM (hora local).
const currentMonth = () => new Date().toLocaleDateString('en-CA').slice(0, 7)

// "2026-10" -> "octubre de 2026"
const monthLabel = (month) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })

// Color de la barra según qué tanto del límite se ha usado.
const statusOf = (ratio) => {
  if (ratio > 1) return { bar: 'bg-rose-500', text: 'text-rose-600', label: 'Excedido' }
  if (ratio >= 0.8) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'Cerca del límite' }
  return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Dentro del presupuesto' }
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [month, setMonth] = useState(currentMonth())
  // undefined = formulario cerrado; null = nuevo presupuesto; objeto = edición
  const [editing, setEditing] = useState(undefined)

  const load = () =>
    Promise.all([getBudgets(), getCategories(), getTransactions()]).then(([b, c, t]) => {
      setBudgets(b)
      setCategories(c)
      setTransactions(t)
    })

  useEffect(() => {
    load()
  }, [])

  // Lo gastado por categoría en el mes elegido.
  const spentByCategory = {}
  for (const t of transactions) {
    if (t.type === 'EXPENSE' && t.date.startsWith(month)) {
      spentByCategory[t.category] = (spentByCategory[t.category] ?? 0) + t.amount
    }
  }

  const rows = budgets
    .map((b) => {
      const spent = spentByCategory[b.category] ?? 0
      return { ...b, spent, ratio: spent / b.amount }
    })
    .sort((a, b) => b.ratio - a.ratio) // los más comprometidos primero

  const totalLimit = rows.reduce((sum, r) => sum + r.amount, 0)
  const totalSpent = rows.reduce((sum, r) => sum + r.spent, 0)
  const exceeded = rows.filter((r) => r.ratio > 1).length

  // Gastos del mes en categorías sin presupuesto (para que no pasen desapercibidos).
  const budgeted = new Set(budgets.map((b) => b.category))
  const unbudgeted = Object.entries(spentByCategory).filter(([name]) => !budgeted.has(name))

  const available = categories
    .filter((c) => c.type === 'EXPENSE' && !budgeted.has(c.name))
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b, 'es'))

  const handleSave = async (data) => {
    if (editing) await updateBudget(editing.id, data)
    else await createBudget(data)
    setEditing(undefined)
    load()
  }

  const handleDelete = async (budget) => {
    if (!window.confirm(`¿Eliminar el presupuesto de "${budget.category}"?`)) return
    await deleteBudget(budget.id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Presupuestos</h2>
          <p className="text-sm text-slate-500">Límites mensuales de gasto por categoría.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
            aria-label="Mes"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => setEditing(null)}
            disabled={available.length === 0}
            title={available.length === 0 ? 'Todas las categorías de gasto ya tienen presupuesto' : undefined}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            + Nuevo presupuesto
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Presupuesto total" value={money(totalLimit)} />
        <StatCard title={`Gastado en ${monthLabel(month)}`} value={money(totalSpent)} tone={totalSpent > totalLimit ? 'red' : 'slate'} />
        <StatCard
          title={totalSpent > totalLimit ? 'Te pasaste por' : 'Disponible'}
          value={money(Math.abs(totalLimit - totalSpent))}
          tone={totalSpent > totalLimit ? 'red' : 'green'}
        />
      </div>

      {exceeded > 0 && (
        <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {exceeded === 1 ? 'Una categoría superó' : `${exceeded} categorías superaron`} su límite este mes.
        </p>
      )}

      {rows.length === 0 && (
        <p className="text-slate-500">Aún no tienes presupuestos. Crea uno para controlar cuánto gastas en cada categoría.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows.map((r) => {
          const status = statusOf(r.ratio)
          return (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{r.category}</h3>
                <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                <span className="text-lg font-bold text-slate-800">{money(r.spent)}</span> de {money(r.amount)}
              </p>
              <div
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={Math.round(r.ratio * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${Math.min(r.ratio, 1) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {Math.round(r.ratio * 100)} % usado ·{' '}
                {r.spent > r.amount ? `excedido por ${money(r.spent - r.amount)}` : `quedan ${money(r.amount - r.spent)}`}
              </p>
              <div className="mt-4 flex gap-3 border-t border-slate-100 pt-3 text-sm">
                <button onClick={() => setEditing(r)} className="text-emerald-700 hover:underline">Editar</button>
                <button onClick={() => handleDelete(r)} className="text-rose-600 hover:underline">Eliminar</button>
              </div>
            </div>
          )
        })}
      </div>

      {unbudgeted.length > 0 && (
        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Gastos sin presupuesto este mes</h3>
          <ul className="divide-y divide-slate-100 text-sm">
            {unbudgeted.map(([name, amount]) => (
              <li key={name} className="flex justify-between py-2">
                <span>{name}</span>
                <span className="font-medium">{money(amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-sm text-slate-500">
        ¿Te falta una categoría? Créala en <Link to="/categorias" className="text-emerald-700 hover:underline">Categorías</Link>.
      </p>

      {editing !== undefined && (
        <Modal title={editing ? 'Editar presupuesto' : 'Nuevo presupuesto'} onClose={() => setEditing(undefined)}>
          <BudgetForm initial={editing} available={available} onSubmit={handleSave} onCancel={() => setEditing(undefined)} />
        </Modal>
      )}
    </div>
  )
}
