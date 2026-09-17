# Shark Swimming Club — app móvil (Android + iOS)

App nativa construida con [Expo](https://expo.dev) (React Native) y Expo Router.
Comparte el backend de Supabase definido en `../supabase/schema.sql` con la app web.

## Estructura

```
src/app/            rutas (Expo Router: cada archivo es una pantalla)
  _layout.tsx       carga de fuentes, sesión y guardas de autenticación
  login.tsx         iniciar sesión / crear cuenta / huella
  (tabs)/           cliente: index (Inicio), reservar, progreso, mensajes,
                    horario, pagos, avisos, perfil
  (tabs)/equipo/    equipo: resumen del día, exportar CSV, planes y profesores
  (tabs)/clases/    clases: lista, [id] (crear/editar), asistencia/[id]
  (tabs)/alumnos/   alumnos: lista, [id] (ficha completa)
  (tabs)/cobros/    pagos (solo dueño/contadora): resumen, nuevo
src/components/     UI compartida (ui.tsx), formularios (form.tsx), panel Ajustes
src/context/        sesión / autenticación (AppState)
src/store/          datos del negocio: tipos, seed, DataProvider (CRUD +
                    persistencia en AsyncStorage), selectors, csv (exportar)
src/lib/supabase.ts cliente del backend
```

## Modos

- **Demo** (sin variables de entorno): datos de ejemplo, login simulado. Es lo que corre hoy.
- **Real** (con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`): login real,
  perfil/nadador/membresía leídos de la base de datos. Copia `.env.example` a `.env`.

## Comandos

```
npm install          # dependencias
npx expo start       # servidor de desarrollo (escanear QR con Expo Go)
npx expo export      # bundle de producción (verificación)
eas build -p android --profile preview   # APK instalable (requiere cuenta Expo)
```
