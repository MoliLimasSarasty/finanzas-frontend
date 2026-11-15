import { useState } from 'react'
import Field from './Field'
import FormButtons from './FormButtons'
import { inputClass } from './styles'

// Formulario para crear o editar el límite mensual de una categoría de gasto.
// "available" son las categorías de gasto que todavía no tienen presupuesto.
export default function BudgetForm({ initial, available, onSubmit, onCancel }) {
  const isEdit = Boolean(initial?.id)
  const [form, setForm] = useState(initial ?? { category: '', amount: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const errs = {}
    if (!form.category) errs.category = 'Elige una categoría'
    if (!(Number(form.amount) > 0)) errs.amount = 'El límite debe ser mayor que 0'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ ...form, amount: Number(form.amount) })
    } catch {
      setErrors({ general: 'No se pudo guardar. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  // En edición la categoría queda fija; solo se cambia el monto.
  const options = isEdit ? [form.category] : available

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Categoría de gasto" error={errors.category}>
        <select name="category" value={form.category} onChange={change} disabled={isEdit} className={inputClass}>
          {!isEdit && <option value="">Selecciona…</option>}
          {options.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </Field>

      <Field label="Límite mensual (COP)" error={errors.amount}>
        <input name="amount" type="number" min="0" step="1" value={form.amount} onChange={change} className={inputClass} autoFocus={isEdit} />
      </Field>

      {errors.general && <p className="mb-4 text-sm text-rose-600">{errors.general}</p>}

      <FormButtons saving={saving} onCancel={onCancel} />
    </form>
  )
}
