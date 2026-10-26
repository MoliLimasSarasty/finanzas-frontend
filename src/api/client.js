import axios from 'axios'

// Cliente HTTP único para hablar con el backend.
// Todas las rutas empiezan por /api (ver proxy en vite.config.js).
const client = axios.create({ baseURL: '/api' })

// Antes de cada petición, adjunta el token JWT si el usuario inició sesión.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el backend responde 401 (token vencido o inválido), cerramos sesión.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default client
