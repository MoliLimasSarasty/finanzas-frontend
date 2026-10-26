import { useEffect, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import { getSummary } from '../api/services'
import { money, percent } from '../utils/format'

const PIE_COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#8b5cf6', '#94a3b8']

export default function Dashboard() {
  const [summary, setSummary] = useState(null)

  // useEffect se ejecuta al abrir la página: aquí pedimos los datos.
  useEffect(() => {
    getSummary().then(setSummary)
  }, [])

  if (!summary) return <p>Cargando…</p>

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Resumen de octubre</h2>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Ingresos del mes" value={money(summary.income)} tone="green" />
        <StatCard title="Gastos del mes" value={money(summary.expenses)} tone="red" />
        <StatCard title="Deuda total" value={money(summary.totalDebt)} />
        <StatCard title="Tasa de ahorro" value={percent(summary.savingsRate)} tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 font-semibold">Ingresos vs. gastos (últimos 6 meses)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip formatter={(v) => money(v)} />
              <Legend />
              <Bar dataKey="ingresos" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Gastos por categoría</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={summary.byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {summary.byCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => money(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  )
}
