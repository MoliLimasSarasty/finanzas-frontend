// Simulador de pago de deudas, mes a mes.
//
// Cada mes:
//   1. Cada deuda genera intereses (tasa anual / 12).
//   2. Se paga el mínimo de cada deuda.
//   3. El dinero que sobra (pago extra + mínimos de deudas ya pagadas)
//      se abona a la deuda "prioritaria" según la estrategia.
//
// Estrategias:
//   'snowball'  (bola de nieve): primero la deuda de MENOR saldo.
//   'avalanche' (avalancha):     primero la deuda de MAYOR tasa de interés.
//   'minimum'   (solo mínimos):  sin pago extra; sirve como punto de comparación.

const MAX_MONTHS = 600 // 50 años: si se llega aquí, la deuda no se termina de pagar

function sortByStrategy(debts, strategy) {
  const list = [...debts]
  if (strategy === 'snowball') list.sort((a, b) => a.balance - b.balance)
  if (strategy === 'avalanche') list.sort((a, b) => b.annualRate - a.annualRate)
  return list
}

export function simulate(debts, extraPayment, strategy) {
  // Copiamos las deudas para no modificar las originales.
  let pending = sortByStrategy(debts, strategy).map((d) => ({ ...d }))
  const monthlyBudget = debts.reduce((sum, d) => sum + d.minPayment, 0) + extraPayment

  let month = 0
  let totalInterest = 0
  const history = [{ month: 0, balance: debts.reduce((sum, d) => sum + d.balance, 0) }]
  const payoffOrder = []

  while (pending.length > 0 && month < MAX_MONTHS) {
    month++

    // 1. Intereses del mes
    for (const d of pending) {
      const interest = d.balance * (d.annualRate / 12)
      d.balance += interest
      totalInterest += interest
    }

    // En "solo mínimos" no hay extra ni se reutilizan los mínimos de deudas pagadas.
    let available =
      strategy === 'minimum' ? pending.reduce((sum, d) => sum + d.minPayment, 0) : monthlyBudget

    // 2. Pago mínimo de cada deuda
    for (const d of pending) {
      const payment = Math.min(d.minPayment, d.balance)
      d.balance -= payment
      available -= payment
    }

    // 3. El sobrante va a las deudas en orden de prioridad
    for (const d of pending) {
      if (available <= 0) break
      const payment = Math.min(available, d.balance)
      d.balance -= payment
      available -= payment
    }

    // Registrar las deudas que quedaron en cero (tolerancia de 1 peso por redondeo)
    for (const d of pending) {
      if (d.balance < 1) payoffOrder.push({ id: d.id, name: d.name, month })
    }
    pending = pending.filter((d) => d.balance >= 1)

    history.push({ month, balance: pending.reduce((sum, d) => sum + d.balance, 0) })
  }

  const totalDebt = history[0].balance
  return {
    months: month,
    completed: pending.length === 0,
    totalInterest,
    totalPaid: totalDebt + totalInterest,
    history,
    payoffOrder,
  }
}

// 27 -> "2 años y 3 meses"
export function formatDuration(months) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`)
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? 'mes' : 'meses'}`)
  return parts.join(' y ') || '0 meses'
}

// Fecha aproximada en que se termina de pagar: 27 -> "enero de 2029"
export function payoffDate(months) {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
}
