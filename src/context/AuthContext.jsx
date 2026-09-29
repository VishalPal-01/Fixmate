import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

const CUSTOMER_SEED = {
  id: 'cust-01',
  role: 'customer',
  name: 'Meera Kulkarni',
  email: 'meera.kulkarni@example.com',
  avatar: 'https://i.pravatar.cc/150?img=29',
  phone: '+91 98200 12345',
  address: '204, Sunrise Apartments, Vasai West, Palghar',
}

const PROVIDER_SEED = {
  id: 'tech-01',
  role: 'provider',
  name: 'Ramesh Kulkarni',
  email: 'ramesh.k@example.com',
  avatar: 'https://i.pravatar.cc/300?img=12',
  phone: '+91 98200 54321',
  title: 'Senior Plumbing Specialist',
  category: 'plumbing',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = useCallback((role = 'customer') => {
    setUser(role === 'provider' ? PROVIDER_SEED : CUSTOMER_SEED)
  }, [])

  const register = useCallback((role = 'customer', overrides = {}) => {
    const base = role === 'provider' ? PROVIDER_SEED : CUSTOMER_SEED
    setUser({ ...base, ...overrides, role })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
