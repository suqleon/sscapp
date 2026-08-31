# PRD — App móvil Shark Swimming Club
**Plataformas:** Android e iOS · **Idioma:** Español · **Versión del documento:** 1.0 · **Fecha:** 2026-08-31
**Origen:** Diseño creado en Claude Design (`project/Shark Swimming Club App.dc.html`) + transcripción de requerimientos (`chats/chat1.md`)

---

## 1. Resumen ejecutivo

Shark Swimming Club (SSC) necesita una aplicación móvil nativa (Android + iOS) para digitalizar la operación de su escuela de natación: reservas de clases, control de asistencia, pagos y membresías, seguimiento del progreso del nadador, mensajería con el equipo, horarios y notificaciones — todo con un estándar de seguridad alto, dado que la app maneja datos de menores de edad (información médica, contactos de emergencia, personas autorizadas para recoger a los niños).

El diseño visual ya existe (9 pantallas + panel de edición de marca) y sirve como especificación de UI de referencia. Este documento define el **alcance funcional, los roles, los requisitos no funcionales y la arquitectura propuesta** para pasar de ese prototipo (HTML/CSS estático) a una aplicación real, instalable en App Store y Google Play, con backend y base de datos.

## 2. Contexto de negocio

- Negocio mixto: escuela de natación con clases grupales/individuales, niveles por nadador, e instructores/coaches.
- Usuarios actuales del negocio: clientes/padres de familia, instructores, administración (el propio dueño, Luis Ruales).
- Requisito explícito del dueño: **"que no pueda ser hackeada la aplicación"** — la seguridad no es un "nice to have", es un requisito de aceptación.
- Referencia de mercado citada: smart-swimmer.com, con la instrucción de **mejorarla**.
- Marca: logo del tiburón, paleta navy `#003577`, azul `#0073CC`, cian `#16B5F7`, con acento coral configurable `#FF6A3D` (personalizable desde un panel de marca).

## 3. Objetivos del producto

1. Permitir a los padres/clientes reservar y gestionar clases sin llamar o escribir por WhatsApp.
2. Dar visibilidad del progreso del nadador (niveles, insignias, habilidades) para aumentar la percepción de valor y la retención.
3. Cobrar membresías de forma digital y reducir la gestión manual de pagos.
4. Centralizar la comunicación cliente↔instructor↔administración dentro de un canal auditable y seguro.
5. Proteger datos sensibles de menores (salud, contactos de emergencia, autorizados de recogida) con cifrado y controles de acceso robustos.
6. Dar a Luis (dueño) una consola de administración para operar el negocio sin depender de un desarrollador para cada cambio de precio, horario o texto.

## 4. Usuarios y roles

| Rol | Quién | Necesidades clave |
|---|---|---|
| **Cliente / padre de familia** | Contrata el servicio para su(s) hijo(s), o para sí mismo si es adulto | Reservar clases, ver horario, ver progreso del nadador, pagar membresía, mensajear con el equipo, recibir avisos, gestionar datos de seguridad/emergencia |
| **Instructor / coach** | Da las clases | Ver su agenda del día/semana, pasar lista (asistencia), ver ficha del nadador (nivel, notas médicas relevantes), mensajear con padres y administración |
| **Administrador (dueño / staff de recepción)** | Opera el negocio | Gestionar horarios, precios y planes, altas/bajas de alumnos e instructores, ver pagos y cobros pendientes, enviar avisos masivos, editar textos/marca de la app, ver reportes |

El prototipo actual solo cubre la vista de **cliente**, más un editor de marca pensado para el dueño. Las vistas de **instructor** y **administrador** fueron sugeridas en la conversación de diseño pero no se llegaron a construir — quedan como alcance explícito de este PRD (sección 6.9 y 6.10).

## 5. Alcance por versión

### MVP (v1.0) — lanzamiento a tiendas
- Autenticación segura + biometría (cliente e instructor).
- Home / dashboard del cliente.
- Reserva de clases (calendario + horarios disponibles/llenos).
- Horario semanal/mensual del alumno.
- Progreso y niveles (insignias, habilidades, % de nivel).
- Pagos y membresía: ver estado, historial, método de pago guardado, cobro recurrente.
- Mensajería cliente ↔ instructor/administración (chat 1:1 y grupal por clase).
- Notificaciones push + centro de avisos in-app.
- Perfil y seguridad: 2FA, biometría, datos médicos, contactos de emergencia, autorizados para recoger.
- Vista de instructor: agenda del día, pase de lista, ficha básica del nadador.
- Panel de administración web o in-app: horarios, precios, planes, altas de alumnos/instructores, marca (color, textos).

### v1.1
- Registro / onboarding self-service (alta de cliente y nadador sin intervención manual).
- Reportes de administración (ingresos, asistencia, ocupación por horario).
- Recordatorios automáticos de pago vencido / clase próxima por push + email.
- Edición granular de horario (clase por clase) e insignias desde el panel del dueño.

### v2 (futuro, fuera de alcance de este documento salvo mención)
- Soporte multi-sede (si el negocio opera o planea operar en más de una alberca/ubicación).
- Programa de referidos / comisiones.
- Integración con evaluación física / video del nadador.

## 6. Requisitos funcionales

Cada módulo se referencia contra la pantalla del prototipo correspondiente.

### 6.1 Autenticación y acceso seguro (pantalla 01)
- Login con correo + contraseña.
- Desbloqueo biométrico (Face ID / huella) tras el primer login.
- Recuperación de contraseña por correo.
- Sesión con expiración y cierre de sesión remoto (ver 6.8).
- Mensaje de "conexión cifrada extremo a extremo" visible — debe ser **cierto**, no solo cosmético (TLS 1.2+ en todo tránsito, cifrado en reposo para datos sensibles).

### 6.2 Inicio / dashboard (pantalla 02)
- Tarjeta de "próxima clase" (nivel, nadador, carril, hora, alberca, coach) con acceso directo a detalles.
- Accesos rápidos: Reservar, Pagar, Asistencia, Mensajes.
- Resumen de progreso (% de nivel, clases completadas esta semana).
- Soporta múltiples nadadores por cuenta (un padre con 2+ hijos inscritos) — el prototipo asume un nadador por cuenta; el sistema real debe permitir seleccionar entre varios.

### 6.3 Reservar clase (pantalla 03)
- Selector de fecha (vista semanal, navegación por día).
- Lista de horarios con cupo disponible / lleno, filtrado por nivel del nadador.
- Confirmación de reserva con resumen (hora, nivel, coach, cupos).
- Reglas de negocio a definir con el dueño: ¿cuántas clases incluye cada plan?, ¿se puede reservar por encima del plan?, ¿política de cancelación / reprogramación y con cuánta anticipación?

### 6.4 Horario semanal/mensual (pantalla 04)
- Vista de clases reservadas, disponibles y especiales (ej. evaluación de nivel) por día.
- Toggle semana/mes.
- Estados visuales: reservado, disponible, especial.

### 6.5 Progreso y niveles (pantalla 05)
- Nivel actual del nadador + % de avance (visual tipo anillo).
- Insignias obtenidas y pendientes (ej. Flotación, Respiración, Crol 25m, Espalda).
- Barras de habilidad por técnica (Respiración, Crol, Espalda, etc.) con % editable únicamente por el instructor/admin, no por el cliente.
- Puntos acumulados (gamificación) — definir si tiene efecto real (descuentos, mérito) o es solo motivacional.

### 6.6 Pagos y membresía (pantalla 06)
- Tarjeta de membresía activa (plan, titular, vigencia).
- Detalle del plan (precio mensual, clases incluidas, fecha de renovación).
- Método de pago guardado (tarjeta) con opción de cambiar.
- Historial de pagos.
- Requiere integración con una **pasarela de pago habilitada en Ecuador** (ver sección 8.5) que soporte cobro recurrente/tokenización de tarjeta — a definir con el dueño (candidatos: PlaceToPay, PayPhone, Datafast, o Stripe si se factura desde el exterior).
- Cumplimiento con estándar PCI-DSS: la app **nunca** debe almacenar el número de tarjeta completo; se delega a la pasarela vía tokenización.

### 6.7 Mensajería (pantalla 07)
- Lista de conversaciones (instructor, recepción/administración, grupo de la clase, avisos administrativos).
- Chat con texto, indicador de no leídos, timestamp.
- Debe soportar broadcast/grupo (ej. "Grupo Tiburones 2") y conversación 1:1.
- Definir política de retención y moderación de mensajes (¿el admin puede ver todos los chats por seguridad de menores? — recomendado que sí, con aviso de transparencia a los usuarios).

### 6.8 Notificaciones y avisos (pantalla 08)
- Push notifications (recordatorio de clase, insignia nueva, pago confirmado, cambio de horario).
- Centro de avisos in-app agrupado por fecha, con marcado de leído/no leído.
- Preferencias de notificación por tipo (el cliente debe poder desactivar categorías no críticas, pero no las de seguridad/pago).

### 6.9 Perfil y seguridad (pantalla 09)
- Datos del titular de la cuenta (padre/cliente) y del nadador (nombre, edad, nivel).
- Verificación en dos pasos (2FA) — toggle.
- Acceso biométrico — toggle.
- Indicador de "datos cifrados extremo a extremo".
- **Información médica** del nadador (alergias, condiciones, medicación) — dato sensible, requiere cifrado en reposo y acceso restringido (solo el propio cliente, el instructor asignado y el admin).
- **Contactos de emergencia**.
- **Autorizados para recoger** al nadador — con foto/identificación si es posible, para uso operativo real en la alberca.
- Gestión de sesión: ver dispositivos conectados y cerrar sesión remota (requisito de seguridad no cubierto en el prototipo visual, pero implícito en el pedido "que no pueda ser hackeada").

### 6.10 Vista de instructor (nueva — no está en el prototipo)
- Agenda del día/semana con sus clases asignadas.
- Pase de lista / control de asistencia por clase.
- Ficha del nadador: nivel, habilidades, alertas médicas relevantes (sin exponer el historial médico completo salvo que el rol lo requiera).
- Mensajería con padres del grupo y con administración.
- Actualización de progreso/insignias del nadador tras la clase.

### 6.11 Panel de administración (evoluciona el "Editor del dueño" del prototipo)
El prototipo incluye un editor de marca en vivo (color de acento, nombre de cliente, datos de la próxima clase, plan y precio) pensado como demo. En producción esto se convierte en un **panel de administración real**, separado de la app del cliente (puede ser web responsive o una app dedicada), con:
- Gestión de horarios y clases (crear, editar, cancelar, asignar coach, cupos).
- Gestión de alumnos e instructores (alta, baja, edición de nivel).
- Gestión de planes y precios de membresía.
- Vista de pagos: cobros exitosos, fallidos, pendientes; conciliación.
- Envío de avisos masivos (broadcast).
- Personalización de marca (color de acento, nombre del negocio, textos) — equivalente al editor actual, pero persistido en backend, no en estado local del navegador.
- Control de accesos: quién en el equipo de Luis tiene permisos de administrador vs. solo lectura.

## 7. Requisitos no funcionales

### 7.1 Seguridad (prioridad #1 del negocio)
- Cifrado en tránsito: TLS 1.2+ en toda comunicación cliente-servidor.
- Cifrado en reposo para datos sensibles: información médica, contactos de emergencia, tokens de pago.
- Autenticación: contraseña + biometría + 2FA opcional (recomendado obligatorio para administradores).
- Gestión de sesiones con expiración, refresh tokens, revocación remota.
- Control de acceso basado en roles (RBAC) a nivel de API, no solo de UI — un cliente no debe poder consultar datos de otro nadador manipulando la app.
- Protección contra ataques comunes (OWASP Mobile Top 10): inyección, almacenamiento inseguro, comunicación insegura, autenticación rota, etc.
- Auditoría: registro de accesos y cambios sobre datos sensibles (quién vio/editó información médica o de pago).
- Cumplimiento con protección de datos de menores: consentimiento del padre/tutor para procesar datos del nadador; definir política de retención y borrado de datos al dar de baja.
- Pruebas de seguridad antes de cada release mayor (pentesting básico o revisión de dependencias vulnerables como mínimo).

### 7.2 Disponibilidad y desempeño
- Tiempos de carga de pantallas principales < 2s en conexión 4G.
- Backend con disponibilidad objetivo ≥ 99.5%.
- Modo de solo lectura ante pérdida de conexión (ver horario/progreso ya cargado) — no se requiere reserva offline.

### 7.3 Localización y accesibilidad
- Español (Ecuador) como único idioma en v1; arquitectura de textos preparada para agregar idiomas después (no hardcodear strings).
- Moneda: USD (moneda oficial de Ecuador).
- Tamaños de texto y contraste que cumplan accesibilidad básica (WCAG AA donde aplique a apps móviles).

### 7.4 Plataformas y dispositivos
- iOS: últimas 2 versiones mayores soportadas por Apple al momento del lanzamiento.
- Android: API level correspondiente a los últimos 3–4 años de dispositivos (a definir según el parque de dispositivos real de los clientes de SSC).
- Diseño responsive dentro del propio formato móvil (no se requiere versión tablet en v1, pero no debe romperse en pantallas grandes).

## 8. Arquitectura técnica propuesta

### 8.1 Enfoque de desarrollo (decisión abierta, ver sección 11)
Dos caminos razonables:
- **Cross-platform (recomendado para MVP):** React Native o Flutter → una sola base de código para Android e iOS, más rápido y económico de mantener, con acceso nativo a biometría, push notifications y almacenamiento seguro vía librerías estándar.
- **Nativo (Swift/Kotlin):** mayor costo y tiempo, se justifica solo si se anticipan requisitos muy específicos de hardware/rendimiento que el prototipo no sugiere.

Recomendación: **cross-platform** para el MVP, dado que la complejidad no es gráfica sino de reglas de negocio (reservas, pagos, roles).

### 8.2 Backend
- API REST o GraphQL sobre un backend gestionado (ej. Node.js/NestJS, o una plataforma BaaS como Supabase/Firebase con reglas de seguridad estrictas) + base de datos relacional (PostgreSQL recomendado por la naturaleza transaccional de reservas y pagos).
- Servicio de autenticación con soporte de 2FA y biometría del lado del cliente + sesión validada en servidor.
- Servicio de notificaciones push (Firebase Cloud Messaging para Android, APNs para iOS).
- Almacenamiento cifrado para datos médicos/documentos de autorización de recogida.

### 8.3 Integraciones necesarias
- Pasarela de pagos con soporte de cobro recurrente en Ecuador (a decidir, ver 6.6).
- Push notifications (FCM/APNs).
- Opcional: WhatsApp Business API para notificaciones críticas fuera de la app (muchos padres revisan WhatsApp más que push notifications).

### 8.4 Panel de administración
- Puede construirse como aplicación web separada (más rápido de iterar que una app móvil) consumiendo la misma API — recomendado para v1, ya que el dueño y su staff probablemente lo usarán desde una computadora en recepción.

### 8.5 Assets de marca disponibles
- `project/assets/shark-logo.png` — logo completo, usado en login.
- `project/assets/shark-fin.png` — aleta, usada como marca de agua/decoración en tarjetas.
- Tipografías: Outfit (títulos) y Plus Jakarta Sans (cuerpo), vía Google Fonts.
- Paleta: navy `#003577` / `#07254F`, azul `#0073CC`, cian `#16B5F7`, acento coral `#FF6A3D` (configurable).

## 9. Métricas de éxito

- % de reservas hechas desde la app vs. por WhatsApp/teléfono (objetivo: mayoría de reservas migradas a la app en los primeros 3 meses).
- % de pagos de membresía procesados dentro de la app.
- Tasa de retención mensual de clientes activos.
- Adopción del panel de administración por parte del equipo de Luis (reduce dependencia de edición manual).
- Cero incidentes de seguridad/fuga de datos — métrica no negociable dado el tipo de datos (menores, salud).

## 10. Riesgos y supuestos

- **Riesgo:** subestimar el esfuerzo de seguridad (2FA, cifrado, RBAC) por tratarse del requisito explícito más fuerte del dueño — mitigar dedicando una fase de auditoría de seguridad antes del lanzamiento.
- **Riesgo:** falta de una pasarela de pago recurrente confiable y bien soportada en Ecuador — validar temprano con el proveedor elegido.
- **Supuesto:** el negocio opera actualmente en una sola sede/alberca; si hay planes de expansión a múltiples sedes, el modelo de datos debe anticiparlo desde el MVP para evitar una reescritura costosa.
- **Riesgo:** la vista de instructor y el panel de administración no fueron diseñados visualmente (solo sugeridos en la conversación) — se necesitará una fase de diseño UI para esas dos superficies antes de construirlas.

## 11. Preguntas abiertas (a resolver con el dueño antes de iniciar desarrollo)

1. ¿Cross-platform (React Native/Flutter) o apps nativas separadas? (se recomienda cross-platform, sección 8.1)
2. ¿Qué pasarela de pago se usará para cobros recurrentes en Ecuador?
3. ¿Cuántas clases incluye cada plan de membresía y cuál es la política de cancelación/reprogramación?
4. ¿El panel de administración debe ser una app móvil también, o basta con versión web para el staff?
5. ¿El negocio planea operar en más de una sede/alberca a mediano plazo? (afecta el modelo de datos desde el MVP)
6. ¿Se requiere registro/onboarding self-service en el MVP, o las altas de clientes las sigue haciendo el equipo de SSC manualmente al inicio?
7. Presupuesto y plazo objetivo de lanzamiento, para dimensionar si el MVP debe reducirse aún más (ej. lanzar sin mensajería en la primera versión y agregarla después).
8. ¿Quién en el equipo de Luis necesita acceso de administrador vs. solo consulta (recepción, coaches, el propio dueño)?

## 12. Anexo — Inventario de pantallas del prototipo

| # | Pantalla | Rol | Estado en el diseño |
|---|---|---|---|
| 01 | Acceso seguro (login) | Cliente | Diseñado |
| 02 | Inicio | Cliente | Diseñado |
| 03 | Reservar clase | Cliente | Diseñado |
| 04 | Horario semanal | Cliente | Diseñado |
| 05 | Progreso y niveles | Cliente | Diseñado |
| 06 | Pagos y membresía | Cliente | Diseñado |
| 07 | Mensajería | Cliente | Diseñado |
| 08 | Notificaciones y avisos | Cliente | Diseñado |
| 09 | Perfil y seguridad | Cliente | Diseñado |
| — | Registro / onboarding | Cliente | Sugerido, no diseñado |
| — | Vista de instructor (agenda, asistencia) | Instructor | Sugerido, no diseñado |
| — | Panel de administración | Administrador | Prototipo parcial (editor de marca en vivo), no es un panel de administración real |
