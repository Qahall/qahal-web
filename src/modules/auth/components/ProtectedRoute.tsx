import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { ReactNode } from "react"

type ProtectedRouteProps = {
  children: ReactNode
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Redirige al login si el usuario no está autenticado
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Guardar la ubicación a la que intentaba acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

