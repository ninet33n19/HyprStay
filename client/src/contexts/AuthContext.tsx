import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types/api'
import { authAPI } from '../lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: 'guest' | 'host') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          // Try to fetch fresh user data from API
          const userData = await authAPI.getMe()
          setUser(userData)
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // Fallback to stored user data
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError)
            // Clear invalid data
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }

  const signup = async (name: string, email: string, password: string, role: 'guest' | 'host') => {
    const response = await authAPI.signup({ name, email, password, role })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 