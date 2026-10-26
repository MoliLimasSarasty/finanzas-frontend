import { useEffect, useState } from 'react'
import Field from './Field'
import FormButtons from './FormButtons'
import { inputClass } from './styles'
import { getCategories } from '../api/services'

// Fecha de hoy en formato AAAA-MM-DD (hora local, no UTC).
const today = () => new Date().toLocaleDateString('en-CA')

const empty = { type: 'EXPENSE', description: '', amount: '', category: '', date: today() }

// Formulario para crear o editar un ingreso/gasto.
// Si recibe "initial", arranca con esos datos (modo edición).
export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? empty)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])

  // Las categorías se gestionan en la página "Categorías"; aquí solo se leen.
  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Al cambiar de tipo, la categoría anterior ya no aplica.
  const changeType = (type) => setForm({ ...form, type, category: '' })

  const validate = () => {
    const errs = {}
    if (!form.description.trim()) errs.description = 'Escribe una descripción'
    if (!(Number(form.amount) > 0)) errs.amount = 'El monto debe ser mayor que 0'
    if (!form.category) errs.category = 'Elige una categoría'
    if (!form.date) errs.date = 'Elige una fecha'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ ...form, description: form.description.trim(), amount: Number(form.amount) })
    } catch {
      setErrors({ general: 'No se pudo guardar. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const typeButton = (type, label, activeClass) => (
    <button
      type="button"
      onClick={() => changeType(type)}
      className={`flex-1 rounded-lg py-2 font-medium ${form.type === type ? activeClass : 'bg-slate-100 text-slate-600'}`}
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4 flex gap-2">
        {typeButton('EXPENSE', 'Gasto', 'bg-rose-600 text-white')}
        {typeButton('INCOME', 'Ingreso', 'bg-emerald-600 text-white')}
      </div>

      <Field label="Descripción" error={errors.description}>
        <input name="description" value={form.description} onChange={change} className={inputClass} placeholder="Ej: Mercado del mes" />
      </Field>

      <Field label="Monto (COP)" error={errors.amount}>
        <input name="amount" type="number" min="0" step="1" value={form.amount} onChange={change} className={inputClass} />
      </Field>

      <Field label="Categoría" error={errors.category}>
        <select name="category" value={form.category} onChange={change} className={inputClass}>
          <option value="">Selecciona…</option>
          {categories
            .filter((c) => c.type === form.type)
            .map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
        </select>
      </Field>

      <Field label="Fecha" error={errors.date}>
        <input name="date" type="date" value={form.date} onChange={change} className={inputClass} />
      </Field>

      {errors.general && <p className="mb-4 text-sm text-rose-600">{errors.general}</p>}

      <FormButtons saving={saving} onCancel={onCancel} />
    </form>
  )
}
