// Tarjeta pequeña para mostrar un indicador (ej: "Ingresos del mes").
export default function StatCard({ title, value, tone = 'slate' }) {
  const colors = {
    slate: 'text-slate-800',
    green: 'text-emerald-600',
    red: 'text-rose-600',
  }
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${colors[tone]}`}>{value}</p>
    </div>
  )
}
