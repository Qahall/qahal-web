import { createClient } from "@supabase/supabase-js"

// Variables de entorno - asegúrate de configurarlas en tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase: Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas."
  )
}

/**
 * Cliente de Supabase para autenticación y base de datos
 * 
 * Para obtener tus credenciales:
 * 1. Ve a https://supabase.com y crea un proyecto
 * 2. En Settings > API encontrarás:
 *    - Project URL (VITE_SUPABASE_URL)
 *    - anon/public key (VITE_SUPABASE_ANON_KEY)
 * 3. Crea un archivo .env en la raíz del proyecto con:
 *    VITE_SUPABASE_URL=tu_url_aqui
 *    VITE_SUPABASE_ANON_KEY=tu_key_aqui
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export const MEMBER_PHOTOS_BUCKET = "member-photos"

export function getMemberPhotoUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return ""
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl

  return supabase.storage
    .from(MEMBER_PHOTOS_BUCKET)
    .getPublicUrl(pathOrUrl.replace(/^\/+/, "")).data.publicUrl
}

