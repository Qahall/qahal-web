import { useAuthContext } from "../context/AuthContext"

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Proporciona una API más limpia y tipada
 */
export function useAuth() {
  return useAuthContext()
}

