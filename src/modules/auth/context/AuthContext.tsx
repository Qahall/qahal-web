import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, LoginCredentials, AuthState } from "../types/auth.types"
import { supabaseAuthService } from "../services/auth.service"
import { supabase } from "@/lib/supabase"

type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper to map Supabase user to our User type
  const mapUser = (supabaseUser: any): User => ({
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name ?? "Usuario",
    email: supabaseUser.email!,
  })

  useEffect(() => {
    let mounted = true

    // Función unificada para manejar la sesión
    const handleSession = async (session: any) => {
      if (!mounted) return

      try {
        if (session?.user && session?.access_token) {
          const mappedUser = mapUser(session.user)
          setUser(mappedUser)
          setToken(session.access_token)
        } else {
          setUser(null)
          setToken(null)
        }
      } catch (error) {
        console.error("Error al procesar sesión:", error)
        if (mounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    // 1. Obtener sesión inicial
    supabaseAuthService.getSession().then((session) => {
      handleSession(session)
    })

    // 2. Suscribirse a cambios
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const { user: loggedUser, session } = await supabaseAuthService.login(credentials)
      
      // Actualizar estado inmediatamente para navegación fluida
      if (session?.access_token) {
        setUser(loggedUser)
        setToken(session.access_token)
      }
    } catch (error) {
      // Si hay error, el estado se mantiene limpio
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await supabaseAuthService.logout()
      // El estado se limpiará vía onAuthStateChange o podemos forzarlo aquí
      setUser(null)
      setToken(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider")
  }
  return context
}

