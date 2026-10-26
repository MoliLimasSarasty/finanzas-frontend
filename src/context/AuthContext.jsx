import { createContext, useContext, useState } from 'react'
import { login as loginRequest } from '../api/services'

// El "contexto" permite que cualquier componente sepa si hay sesión iniciada.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'))

  const login = async (email, password) => {
    const data = await loginRequest(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userName', data.name)
    setToken(data.token)
    setUserName(data.name)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setToken(null)
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
