// Datos de prueba para desarrollar sin backend.

export const mockSummary = {
  income: 4500000,
  expenses: 3120000,
  totalDebt: 18700000,
  savingsRate: 0.31,
  monthly: [
    { month: 'May', ingresos: 4200000, gastos: 3500000 },
    { month: 'Jun', ingresos: 4200000, gastos: 3300000 },
    { month: 'Jul', ingresos: 4400000, gastos: 3600000 },
    { month: 'Ago', ingresos: 4400000, gastos: 3200000 },
    { month: 'Sep', ingresos: 4500000, gastos: 3400000 },
    { month: 'Oct', ingresos: 4500000, gastos: 3120000 },
  ],
  byCategory: [
    { name: 'Vivienda', value: 1200000 },
    { name: 'Alimentación', value: 850000 },
    { name: 'Transporte', value: 420000 },
    { name: 'Ocio', value: 300000 },
    { name: 'Otros', value: 350000 },
  ],
}

export const mockTransactions = [
  { id: 1, date: '2026-10-01', description: 'Salario', category: 'Salario', type: 'INCOME', amount: 4500000 },
  { id: 2, date: '2026-10-02', description: 'Arriendo', category: 'Vivienda', type: 'EXPENSE', amount: 1200000 },
  { id: 3, date: '2026-10-05', description: 'Mercado', category: 'Alimentación', type: 'EXPENSE', amount: 380000 },
  { id: 4, date: '2026-10-08', description: 'Gasolina', category: 'Transporte', type: 'EXPENSE', amount: 150000 },
  { id: 5, date: '2026-10-12', description: 'Cine', category: 'Ocio', type: 'EXPENSE', amount: 60000 },
]

export const mockDebts = [
  { id: 1, name: 'Tarjeta de crédito', balance: 3200000, annualRate: 0.28, minPayment: 250000 },
  { id: 2, name: 'Crédito de libre inversión', balance: 8500000, annualRate: 0.19, minPayment: 420000 },
  { id: 3, name: 'Crédito vehículo', balance: 7000000, annualRate: 0.14, minPayment: 380000 },
]
