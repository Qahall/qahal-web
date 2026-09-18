# Qahal Web

Aplicación web para la gestión de miembros, familias, diezmos, bautizos, cumpleaños y configuración de una iglesia.

## Stack

- React 19 y TypeScript.
- Vite 6.
- React Router 7.
- TanStack Query y TanStack Table.
- React Hook Form y Zod.
- Radix UI y Tailwind CSS 4.
- Axios para la API del backend.
- Supabase Auth y Storage para sesiones y fotografías.

El proyecto es completamente web. No requiere Rust, Tauri, WebView ni herramientas nativas.

## Requisitos

- Node.js LTS.
- npm.
- Una API backend accesible desde el navegador.
- Un proyecto Supabase con Auth y el bucket de fotografías configurados.

## Instalación local

```bash
npm ci
```

Copia `.env.example` como `.env` y completa:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Inicia el servidor:

```bash
npm run dev
```

La aplicación queda disponible en la URL que muestre Vite, normalmente `http://localhost:5173`.

## Validación y producción

```bash
npm run typecheck
npm run build
npm run preview
```

El build genera `dist/`.

## Vercel

Importa el proyecto y usa la configuración automática de Vite. El archivo `vercel.json` incluye el rewrite necesario para que `BrowserRouter` funcione en rutas profundas.

Variables de entorno requeridas en Vercel:

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Render

El archivo `render.yaml` configura un Static Site con:

```text
Build command: npm ci && npm run build
Publish directory: dist
```

Añade las mismas tres variables de entorno en Render. El backend debe permitir mediante CORS el dominio final de la aplicación.

## Contratos externos

- La API HTTP se consume desde `VITE_API_URL`.
- Las peticiones incluyen el token Bearer de la sesión Supabase.
- Supabase Storage usa el bucket `member-photos` para fotografías de miembros.
- Las rutas del frontend usan `BrowserRouter`; cualquier hosting debe devolver `index.html` para rutas desconocidas.