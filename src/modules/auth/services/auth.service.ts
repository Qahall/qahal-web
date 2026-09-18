import type { LoginCredentials, User } from "../types/auth.types"
import { supabase } from "@/lib/supabase"

export interface AuthService {
  login(
    credentials: LoginCredentials
  ): Promise<{ user: User; session: any }>

  logout(): Promise<void>

  getSession(): Promise<any>

  getCurrentUser(): Promise<User | null>
}

export const supabaseAuthService: AuthService = {
  async login(credentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) throw new Error("Credenciales inválidas")

    const user: User = {
      id: data.user!.id,
      name: data.user!.user_metadata?.name ?? "Usuario",
      email: data.user!.email!,
    }

    return { user, session: data.session }
  },

  async logout() {
    await supabase.auth.signOut()
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
      ? {
          id: data.user.id,
          name: data.user.user_metadata?.name ?? "Usuario",
          email: data.user.email!,
        }
      : null
  },
}
