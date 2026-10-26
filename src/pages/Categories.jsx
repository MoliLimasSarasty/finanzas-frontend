import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import CategoryForm from '../components/CategoryForm'
import { createCategory, deleteCategory, getCategories, getTransactions, updateCategory } from '../api/services'

const SECTIONS = [
  { type: 'EXPENSE', title: 'Categorías de gastos', dot: 'bg-rose-500' },
  { type: 'INCOME', title: 'Categorías de ingresos', dot: 'bg-emerald-500' },
]

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [usage, setUsage] = useState({}) // cuántos movimientos usa cada categoría
  // null = formulario cerrado; un objeto = la categoría que se está creando o editando
  const [editing, setEditing] = useState(null)

  // Promise.all pide las dos cosas al mismo tiempo y espera a que ambas lleguen.
  const load = () =>
    Promise.all([getCategories(), getTransactions()]).then(([cats, transactions]) => {
      setCategories([...cats].sort((a, b) => a.name.localeCompare(b.name, 'es')))

      const counts = {}
      for (const t of transactions) {
        const key = `${t.type}:${t.category}`
        counts[key] = (counts[key] ?? 0) + 1
      }
      setUsage(counts)
    })

  useEffect(() => {
    load()
  }, [])

  const usageOf = (category) => usage[`${category.type}:${category.name}`] ?? 0

  const handleSave = async (data) => {
    if (editing.id) await updateCategory(editing.id, data)
    else await createCategory(data)
    setEditing(null)
    load()
  }

  const handleDelete = async (category) => {
    const count = usageOf(category)
    if (count > 0) {
      window.alert(
        `No puedes eliminar "${category.name}" porque tiene ${count} movimiento(s). Cámbialos a otra categoría primero.`,
      )
      return
    }
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return
    await deleteCategory(category.id)
    load()
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">Categorías</h2>
      <p className="mb-6 text-slate-500">Organiza tus ingresos y gastos con las categorías que tengan sentido para ti.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SECTIONS.map((section) => {
          const list = categories.filter((c) => c.type === section.type)
          return (
            <section key={section.type} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <span className={`h-2.5 w-2.5 rounded-full ${section.dot}`} />
                  {section.title}
                </h3>
                <button
                  onClick={() => setEditing({ name: '', type: section.type })}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  + Agregar
                </button>
              </div>

              {list.length === 0 && <p className="text-sm text-slate-500">No hay categorías todavía.</p>}

              <ul className="divide-y divide-slate-100">
                {list.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 py-2.5">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">
                        {usageOf(c) === 1 ? '1 movimiento' : `${usageOf(c)} movimientos`}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button onClick={() => setEditing(c)} className="text-emerald-700 hover:underline">Editar</button>
                      <button onClick={() => handleDelete(c)} className="text-rose-600 hover:underline">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setEditing(null)}>
          <CategoryForm initial={editing} existing={categories} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  )
}
