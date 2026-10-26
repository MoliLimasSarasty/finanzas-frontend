import { useState } from 'react'
import Field from './Field'
import FormButtons from './FormButtons'
import { inputClass } from './styles'

// Formulario para crear o editar una categoría.
// "initial" siempre trae el tipo; si además trae id, es una edición.
// "existing" es la lista de categorías actuales, para evitar nombres repetidos.
export default function CategoryForm({ initial, existing, onSubmit, onCancel }) {
  const isEdit = Boolean(initial.id)
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const errs = {}
    const name = form.name.trim()
    const duplicated = existing.some(
      (c) => c.id !== initial.id && c.type === form.type && c.name.toLowerCase() === name.toLowerCase(),
    )
    if (!name) errs.name = 'Escribe un nombre'
    else if (name.length > 30) errs.name = 'Máximo 30 caracteres'
    else if (duplicated) errs.name = 'Ya existe una categoría con ese nombre'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ ...form, name: form.name.trim() })
    } catch {
      setErrors({ general: 'No se pudo guardar. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const typeButton = (type, label, activeClass) => (
    <button
      type="button"
      disabled={isEdit}
      onClick={() => setForm({ ...form, type })}
      className={`flex-1 rounded-lg py-2 font-medium disabled:cursor-not-allowed ${form.type === type ? activeClass : 'bg-slate-100 text-slate-600'}`}
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-1 flex gap-2">
        {typeButton('EXPENSE', 'Gasto', 'bg-rose-600 text-white')}
        {typeButton('INCOME', 'Ingreso', 'bg-emerald-600 text-white')}
      </div>
      <p className="mb-4 text-xs text-slate-500">
        {isEdit ? 'El tipo no se puede cambiar después de crear la categoría.' : 'Elige si es una categoría de gastos o de ingresos.'}
      </p>

      <Field label="Nombre" error={errors.name}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={30}
          autoFocus
          className={inputClass}
          placeholder="Ej: Mascotas"
        />
      </Field>

      {errors.general && <p className="mb-4 text-sm text-rose-600">{errors.general}</p>}

      <FormButtons saving={saving} onCancel={onCancel} />
    </form>
  )
}
