import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../api/services'
import { money } from '../utils/format'

export default function Transactions() {
  const [items, setItems] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // movimiento que se está editando (null = nuevo)

  // Carga la lista, ordenada de la más reciente a la más antigua.
  const load = () =>
    getTransactions().then((data) => setItems([...data].sort((a, b) => b.date.localeCompare(a.date))))

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (transaction) => {
    setEditing(transaction)
    setFormOpen(true)
  }

  const handleSave = async (data) => {
    if (editing) await updateTransaction(editing.id, data)
    else await createTransaction(data)
    setFormOpen(false)
    load()
  }

  const handleDelete = async (transaction) => {
    if (!window.confirm(`¿Eliminar "${transaction.description}"?`)) return
    await deleteTransaction(transaction.id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Ingresos y gastos</h2>
        <button onClick={openNew} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
          + Nuevo movimiento
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Categoría</th>
              <th className="p-3 text-right">Monto</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">Aún no tienes movimientos registrados.</td>
              </tr>
            )}
            {items.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="p-3 whitespace-nowrap">{t.date}</td>
                <td className="p-3">{t.description}</td>
                <td className="p-3">{t.category}</td>
                <td className={`p-3 text-right font-medium whitespace-nowrap ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'} {money(t.amount)}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(t)} className="mr-3 text-emerald-700 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(t)} className="text-rose-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <Modal title={editing ? 'Editar movimiento' : 'Nuevo movimiento'} onClose={() => setFormOpen(false)}>
          <TransactionForm initial={editing} onSubmit={handleSave} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}
