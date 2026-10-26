import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getDebts } from '../api/services'
import { formatDuration, payoffDate, simulate } from '../utils/debtSimulator'
import { money } from '../utils/format'

// Cada estrategia con su nombre, color y explicación.
// El color siempre sigue a la estrategia (no cambia según cuál gane).
const STRATEGIES = [
  {
    key: 'snowball',
    label: 'Bola de nieve',
    color: '#2a78d6',
    description: 'Pagas primero la deuda más pequeña. Ves resultados rápido y eso te motiva a seguir.',
  },
  {
    key: 'avalanche',
    label: 'Avalancha',
    color: '#eb6834',
    description: 'Pagas primero la deuda con mayor interés. Matemáticamente es la que menos intereses te cobra.',
  },
  {
    key: 'minimum',
    label: 'Solo mínimos',
    color: '#898781',
    description: 'Pagas solo el mínimo de cada deuda, sin abonos extra. Sirve como punto de comparación.',
  },
]

const CHART_MAX_MONTHS = 360 // el gráfico muestra como máximo 30 años

export default function Simulator() {
  const [debts, setDebts] = useState(null)
  const [extra, setExtra] = useState(200000)

  useEffect(() => {
    getDebts().then(setDebts)
  }, [])

  // useMemo evita recalcular las simulaciones si ni las deudas ni el extra cambiaron.
  const results = useMemo(() => {
    if (!debts || debts.length === 0) return null
    const r = {}
    for (const s of STRATEGIES) r[s.key] = simulate(debts, extra, s.key)
    return r
  }, [debts, extra])

  // Une los historiales de las 3 estrategias en una sola tabla para el gráfico:
  // [{ month: 0, snowball: 18700000, avalanche: 18700000, minimum: 18700000 }, ...]
  const chartData = useMemo(() => {
    if (!results) return []
    const length = Math.min(Math.max(...STRATEGIES.map((s) => results[s.key].months)), CHART_MAX_MONTHS)
    return Array.from({ length: length + 1 }, (_, month) => {
      const row = { month }
      for (const s of STRATEGIES) row[s.key] = results[s.key].history[month]?.balance ?? 0
      return row
    })
  }, [results])

  if (!debts) return <p>Cargando…</p>

  if (debts.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold">Simulador de deudas</h2>
        <p className="text-slate-500">
          Primero registra tus deudas en la sección <Link to="/deudas" className="text-emerald-700 underline">Deudas</Link>.
        </p>
      </div>
    )
  }

  const totalMinimum = debts.reduce((sum, d) => sum + d.minPayment, 0)
  const baseline = results.minimum
  const best = results.avalanche.totalInterest <= results.snowball.totalInterest ? 'avalanche' : 'snowball'

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">Simulador de deudas</h2>
      <p className="mb-6 text-slate-500">Compara cómo y cuándo saldrías de tus {debts.length} deudas según el método que elijas.</p>

      {/* Control del pago extra */}
      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <label htmlFor="extra" className="font-semibold">¿Cuánto extra puedes abonar cada mes?</label>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <input
            id="extra"
            type="range"
            min="0"
            max="2000000"
            step="50000"
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
            className="w-full accent-emerald-600 sm:flex-1"
          />
          <span className="text-xl font-bold text-emerald-700">{money(extra)}</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Pago mensual total: {money(totalMinimum)} de mínimos + {money(extra)} extra ={' '}
          <span className="font-semibold text-slate-700">{money(totalMinimum + extra)}</span>
        </p>
      </section>

      {/* Tarjetas de resultados */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STRATEGIES.map((s) => {
          const r = results[s.key]
          const saved = baseline.totalInterest - r.totalInterest
          return (
            <section key={s.key} className="rounded-xl bg-white p-5 shadow-sm" style={{ borderTop: `4px solid ${s.color}` }}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{s.label}</h3>
                {s.key === best && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    ★ Menos intereses
                  </span>
                )}
              </div>

              {r.completed ? (
                <>
                  <p className="mt-3 text-2xl font-bold">{formatDuration(r.months)}</p>
                  <p className="text-sm text-slate-500">Libre de deudas en {payoffDate(r.months)}</p>
                </>
              ) : (
                <p className="mt-3 text-sm font-semibold text-rose-600">
                  ⚠ Con estos pagos la deuda no se termina de pagar: los intereses superan los abonos.
                </p>
              )}

              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Intereses totales</dt>
                  <dd className="font-medium">{money(r.totalInterest)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Total pagado</dt>
                  <dd className="font-medium">{money(r.totalPaid)}</dd>
                </div>
                {s.key !== 'minimum' && saved > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Ahorro vs. solo mínimos</dt>
                    <dd className="font-semibold text-emerald-700">{money(saved)}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-4 text-xs text-slate-500">{s.description}</p>
            </section>
          )
        })}
      </div>

      {/* Gráfico de saldo restante */}
      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold">Saldo total pendiente mes a mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#e1e0d9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#898781', fontSize: 12 }}
              stroke="#c3c2b7"
              label={{ value: 'Meses', position: 'insideBottom', offset: -10, fill: '#898781', fontSize: 12 }}
            />
            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: '#898781', fontSize: 12 }} stroke="#c3c2b7" />
            <Tooltip labelFormatter={(m) => `Mes ${m}`} formatter={(v) => money(v)} />
            <Legend verticalAlign="top" height={32} />
            {STRATEGIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.key === 'minimum' ? '6 4' : undefined}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Orden en que se pagan las deudas */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STRATEGIES.filter((s) => s.key !== 'minimum').map((s) => (
          <div key={s.key} className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold">Orden de pago — {s.label}</h3>
            <ol className="space-y-2 text-sm">
              {results[s.key].payoffOrder.map((p, i) => (
                <li key={p.id} className="flex justify-between gap-2">
                  <span>{i + 1}. {p.name}</span>
                  <span className="text-slate-500">mes {p.month}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      <p className="mt-6 text-xs text-slate-400">
        Simulación orientativa: supone tasas fijas y pagos constantes cada mes. No constituye asesoría financiera.
      </p>
    </div>
  )
}
