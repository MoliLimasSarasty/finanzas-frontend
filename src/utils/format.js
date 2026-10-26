// Formatea un número como pesos colombianos: 4500000 -> "$ 4.500.000"
export const money = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

export const percent = (value) => `${(value * 100).toFixed(1)} %`
