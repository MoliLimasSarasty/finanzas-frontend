import { useState } from 'react'
import Field from './Field'
import FormButtons from './FormButtons'
import { inputClass } from './styles'

const empty = { name: '', balance: '', annualRate: '', minPayment: '' }

// Formulario para crear o editar una deuda.
// La tasa se guarda como decimal (0.28) pero el usuario la escribe en porcentaje (28).
export default function DebtForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...initial, annualRate: Math.round(initial.annualRate * 10000) / 100 } : empty,
  )
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const errs = {}
    const rate = Number(form.annualRate)
    if (!form.name.trim()) errs.name = 'Escribe un nombre para la deuda'
    if (!(Number(form.balance) > 0)) errs.balance = 'El saldo debe ser mayor que 0'
    if (form.annualRate === '' || rate < 0 || rate > 100) errs.annualRate = 'Escribe una tasa entre 0 y 100'
    if (!(Number(form.minPayment) > 0)) errs.minPayment = 'El pago mínimo debe ser mayor que 0'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        balance: Number(form.balance),
        annualRate: Number(form.annualRate) / 100,
        minPayment: Number(form.minPayment),
      })
    } catch {
      setErrors({ general: 'No se pudo guardar. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Nombre" error={errors.name}>
        <input name="name" value={form.name} onChange={change} className={inputClass} placeholder="Ej: Tarjeta de crédito" />
      </Field>

      <Field label="Saldo pendiente (COP)" error={errors.balance}>
        <input name="balance" type="number" min="0" step="1" value={form.balance} onChange={change} className={inputClass} />
      </Field>

      <Field label="Tasa de interés anual (%)" error={errors.annualRate}>
        <input name="annualRate" type="number" min="0" max="100" step="0.01" value={form.annualRate} onChange={change} className={inputClass} placeholder="Ej: 28" />
      </Field>

      <Field label="Pago mínimo mensual (COP)" error={errors.minPayment}>
        <input name="minPayment" type="number" min="0" step="1" value={form.minPayment} onChange={change} className={inputClass} />
      </Field>

      {errors.general && <p className="mb-4 text-sm text-rose-600">{errors.general}</p>}

      <FormButtons saving={saving} onCancel={onCancel} />
    </form>
  )
}
