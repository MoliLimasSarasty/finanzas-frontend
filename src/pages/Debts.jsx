import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import DebtForm from '../components/DebtForm'
import { createDebt, deleteDebt, getDebts, updateDebt } from '../api/services'
import { money, percent } from '../utils/format'

export default function Debts() {
  const [debts, setDebts] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // deuda que se está editando (null = nueva)

  const load = () => getDebts().then(setDebts)

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (debt) => {
    setEditing(debt)
    setFormOpen(true)
  }

  const handleSave = async (data) => {
    if (editing) await updateDebt(editing.id, data)
    else await createDebt(data)
    setFormOpen(false)
    load()
  }

  const handleDelete = async (debt) => {
    if (!window.confirm(`¿Eliminar la deuda "${debt.name}"?`)) return
    await deleteDebt(debt.id)
    load()
  }

  const total = debts.reduce((sum, d) => sum + d.balance, 0)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Mis deudas</h2>
          <p className="text-sm text-slate-500">Total adeudado: <span className="font-semibold text-rose-600">{money(total)}</span></p>
        </div>
        <button onClick={openNew} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
          + Nueva deuda
        </button>
      </div>

      {debts.length === 0 && <p className="text-slate-500">No tienes deudas registradas. ¡Excelente!</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {debts.map((d) => (
          <div key={d.id} className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="font-semibold">{d.name}</h3>
            <p className="mt-2 text-2xl font-bold text-rose-600">{money(d.balance)}</p>
            <p className="mt-2 text-sm text-slate-500">Tasa anual: {percent(d.annualRate)}</p>
            <p className="text-sm text-slate-500">Pago mínimo: {money(d.minPayment)}</p>
            <div className="mt-4 flex gap-3 border-t border-slate-100 pt-3 text-sm">
              <button onClick={() => openEdit(d)} className="text-emerald-700 hover:underline">Editar</button>
              <button onClick={() => handleDelete(d)} className="text-rose-600 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Editar deuda' : 'Nueva deuda'} onClose={() => setFormOpen(false)}>
          <DebtForm initial={editing} onSubmit={handleSave} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}
