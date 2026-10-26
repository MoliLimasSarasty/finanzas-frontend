import client from './client'
import { mockSummary, mockTransactions, mockDebts, mockCategories } from '../data/mock'

// Mientras el backend no esté listo, USE_MOCK = true devuelve datos de prueba.
// Cuando tu compañero tenga los endpoints, cámbialo a false.
const USE_MOCK = true

const fake = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300))

// "Base de datos" en memoria para el modo de prueba (se reinicia al recargar la página).
let transactions = [...mockTransactions]
let debts = [...mockDebts]
let categories = [...mockCategories]

export async function login(email, password) {
  if (USE_MOCK) return fake({ token: 'token-de-prueba', name: email.split('@')[0] })
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

export async function getSummary() {
  if (USE_MOCK) return fake(mockSummary)
  const { data } = await client.get('/dashboard/summary')
  return data
}

// ---------- Movimientos (ingresos y gastos) ----------

export async function getTransactions() {
  if (USE_MOCK) return fake(transactions)
  const { data } = await client.get('/transactions')
  return data
}

export async function createTransaction(transaction) {
  if (USE_MOCK) {
    const created = { ...transaction, id: Date.now() }
    transactions = [...transactions, created]
    return fake(created)
  }
  const { data } = await client.post('/transactions', transaction)
  return data
}

export async function updateTransaction(id, transaction) {
  if (USE_MOCK) {
    const updated = { ...transaction, id }
    transactions = transactions.map((t) => (t.id === id ? updated : t))
    return fake(updated)
  }
  const { data } = await client.put(`/transactions/${id}`, transaction)
  return data
}

export async function deleteTransaction(id) {
  if (USE_MOCK) {
    transactions = transactions.filter((t) => t.id !== id)
    return fake(null)
  }
  await client.delete(`/transactions/${id}`)
}

// ---------- Categorías ----------

export async function getCategories() {
  if (USE_MOCK) return fake(categories)
  const { data } = await client.get('/categories')
  return data
}

export async function createCategory(category) {
  if (USE_MOCK) {
    const created = { ...category, id: Date.now() }
    categories = [...categories, created]
    return fake(created)
  }
  const { data } = await client.post('/categories', category)
  return data
}

export async function updateCategory(id, category) {
  if (USE_MOCK) {
    const old = categories.find((c) => c.id === id)
    const updated = { ...category, id }
    categories = categories.map((c) => (c.id === id ? updated : c))
    // Si cambió el nombre, los movimientos de esa categoría también se actualizan.
    transactions = transactions.map((t) =>
      t.type === old.type && t.category === old.name ? { ...t, category: updated.name } : t,
    )
    return fake(updated)
  }
  const { data } = await client.put(`/categories/${id}`, category)
  return data
}

export async function deleteCategory(id) {
  if (USE_MOCK) {
    categories = categories.filter((c) => c.id !== id)
    return fake(null)
  }
  await client.delete(`/categories/${id}`)
}

// ---------- Deudas ----------

export async function getDebts() {
  if (USE_MOCK) return fake(debts)
  const { data } = await client.get('/debts')
  return data
}

export async function createDebt(debt) {
  if (USE_MOCK) {
    const created = { ...debt, id: Date.now() }
    debts = [...debts, created]
    return fake(created)
  }
  const { data } = await client.post('/debts', debt)
  return data
}

export async function updateDebt(id, debt) {
  if (USE_MOCK) {
    const updated = { ...debt, id }
    debts = debts.map((d) => (d.id === id ? updated : d))
    return fake(updated)
  }
  const { data } = await client.put(`/debts/${id}`, debt)
  return data
}

export async function deleteDebt(id) {
  if (USE_MOCK) {
    debts = debts.filter((d) => d.id !== id)
    return fake(null)
  }
  await client.delete(`/debts/${id}`)
}
