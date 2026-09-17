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

La app móvil tiene **dos partes** y ya es operativa con datos guardados en el
propio dispositivo (al conectar Supabase, abajo, esos datos pasan a compartirse
entre todos los celulares del club):

- **Cliente** (padres / alumnos): Inicio, Reservar, Horario, Progreso, Pagos, Mensajes, Avisos, Perfil.
- **Equipo** (profesores, dueño, contadora): resumen del día, **Clases** (crear /
  editar / pase de lista), **Alumnos** (ficha completa: nivel, plan, habilidades,
  insignias, datos médicos), **Pagos** (registrar cobros, ver pendientes del mes),
  planes/precios/profesores y **Exportar a Excel** (alumnos, pagos, asistencia, clases).

Para cambiar entre las dos partes desde tu celular: botón **Ajustes** (arriba a la
derecha) → *Ver la app como* → Cliente / Profesor / Dueño. Ahí también eliges qué
alumno ve el cliente, el color de la marca y el nombre del club.

Viene con alumnos, clases y pagos de ejemplo para que pruebes; bórralos con
**Ajustes → Restablecer datos de ejemplo** cuando quieras cargar los reales.

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
