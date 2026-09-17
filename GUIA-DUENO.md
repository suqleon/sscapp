# Guía para el dueño — Shark Swimming Club App

Esta guía es para ti, Luis. No necesitas saber programar. Explica qué hay
construido, cómo probarlo en tu celular y qué falta para que sea la app real.

## Qué existe hoy

| Pieza | Qué es | Dónde |
|---|---|---|
| Diseño | Las 9 pantallas originales (referencia visual) | `project/` |
| PRD | El documento de requisitos completo | `PRD.md` / `PRD.html` |
| Demo web | Versión web navegable del diseño | Vercel (`sscapp-….vercel.app`) |
| **App móvil** | **La app real para Android e iPhone (Expo / React Native)** | `mobile/` |
| Base de datos | Estructura del backend (tablas, seguridad por fila) | `supabase/schema.sql` |

La app móvil hoy corre en **modo demostración**: se ve y se usa como la app
final, pero los datos son de ejemplo y el login es simulado. Al conectar
Supabase (abajo) pasa a modo real sin cambiar el código.

## Cómo probar la app en tu celular Android (sin programar)

1. Crea una cuenta gratuita en **https://expo.dev** (puedes entrar con GitHub).
2. En expo.dev → tu avatar → **Account settings → Access tokens → Create token**.
   Ponle nombre `github-actions` y copia el token (empieza con algo como `abc123…`).
3. En GitHub → repositorio `suqleon/sscapp` → **Settings → Secrets and variables →
   Actions → New repository secret**. Nombre: `EXPO_TOKEN`. Valor: el token. Guardar.
4. En GitHub → pestaña **Actions** → workflow **"Build Android APK (EAS)"** →
   **Run workflow** → Run. Tarda 10–20 minutos.
5. Al terminar, abre el log del paso "Build APK": al final hay un link a expo.dev
   con el archivo `.apk`. Ábrelo desde el celular, descárgalo e instálalo
   (Android te pedirá permitir "instalar apps de fuentes desconocidas" — acepta).

Para **iPhone** hace falta una cuenta de Apple Developer (USD 99/año) y se
distribuye por TestFlight. Es el mismo proceso, pero se hace después de tener
esa cuenta.

## Para que la app sea real (no demo): conectar Supabase

1. Crea una cuenta gratuita en **https://supabase.com** → **New project**
   (nombre: `shark-swimming-club`; guarda la contraseña de la base de datos, no la compartas).
2. En el proyecto → **SQL Editor → New query** → pega TODO el contenido de
   `supabase/schema.sql` → **Run**. Eso crea tablas, seguridad y datos de ejemplo.
3. En **Project Settings → API** copia dos valores y pásalos a Claude:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public key** (empieza con `eyJ…`)
   ⚠️ Nunca compartas la **service_role** key.

Con eso se activan el login real, el registro de clientes y que las reservas y
membresías se guarden en la base de datos.

## Lo que sigue (fases)

1. **Fase 1 — hecha:** app de clientes con todas las pantallas, lista para conectar al backend.
2. **Fase 2:** parte del equipo — instructores (agenda del día, pase de lista, avanzar nivel/insignias)
   y contadora (pagos, cobros pendientes, **exportar todo a Excel/CSV**).
3. **Fase 3:** publicación en Google Play y App Store, notificaciones push, pasarela de pago de Ecuador.
