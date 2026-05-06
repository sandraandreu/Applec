# MVP Falles App — Plan de Implementación

**Inicio:** 17 abril 2026 · **Presentación:** 11 junio 2026
**Margen para presentación:** 2 semanas (1-11 junio)

---

## Semana 1 — 17-24 abril · Modelo, servicio y navegación

### T01 · Modelo de evento ✅ completado

**Archivos:**
- `src/models/event.model.ts`

**Criterios de aceptación:**
- [x] Existe la interfaz `FallesEvent` con campos obligatorios: `id`, `groupId`, `name`, `date`, `startTime`, `confirmationDeadline`, `status`, `createdBy`, `createdAt`
- [x] Campos opcionales: `location`, `description`, `endTime`, `requiresConfirmation`, `sendReminder`, `isSpecial`
- [x] Existe el tipo `EventStatus`: `'activo' | 'plazo-cerrado' | 'finalizado' | 'cancelado'`
- [x] Existe `getEventStatus(event)` que calcula el estado a partir de la fecha y el deadline

---

### T02 · Servicio de eventos ✅ completado

**Archivos:**
- `src/services/event.service.ts`

**Criterios de aceptación:**
- [x] `getEvents(groupId)` — devuelve eventos del grupo ordenados por fecha, `null` en error
- [x] `getEventById(groupId, eventId)` — devuelve el evento o `null`
- [x] `createEvent(groupId, data)` — crea el documento, devuelve el nuevo id, lanza error en fallo
- [x] `updateEvent(groupId, eventId, data)` — actualiza campos, lanza error en fallo
- [x] `deleteEvent(groupId, eventId)` — elimina el evento y todas sus asistencias (batch), lanza error en fallo
- [x] Usa `db` de `src/plugins/firebase.ts`
- [x] Patrón try/catch del proyecto

---

### T03 · Navegación — Tab bar y layout principal ✅ completado

**Archivos:**
- `src/components/tab-bar/TabBar.tsx`
- `src/components/top-bar/TopBar.tsx`
- `src/components/main-layout/MainLayout.tsx`

**Notas:**
- Implementado con tabs: Feed · Calendario · Eventos · Miembros · Perfil
- La pantalla principal (post-login) es `/events`, no existe tab "Inicio"
- `/feed` está preparado para una funcionalidad futura (fuera del MVP)
- La ruta `/home` era provisional y quedará eliminada al implementar T05

---

## Semana 2 — 25 abril - 1 mayo · Lista, calendario y detalle de eventos

### T05 · Lista de eventos ✅ completado

**Archivos:**
- `src/pages/events/events-list/EventsListPage.tsx`
- `src/locales/es/events.json` y `src/locales/ca/events.json`

**Criterios de aceptación:**
- [x] Pantalla principal tras login/onboarding
- [x] Lista eventos del grupo ordenados por fecha
- [x] Cada evento muestra: nombre, fecha, estado y respuesta del usuario
- [x] Estado vacío, loading y error
- [x] Botón "Crear evento" solo para admin y organizer
- [x] Al pulsar un evento navega al detalle
- [x] Filtro desplegable: Todos / Activos / Plazo cerrado / Finalizados / Próximos / Pendientes / Pasados
- [x] Ruta: `/events`

---

### T06 · Vista de calendario ✗ Pendiente

**Archivos a crear:**
- `src/pages/events/events-calendar/EventsCalendarPage.tsx`
- `src/pages/events/events-calendar/events-calendar.scss`

**Criterios de aceptación:**
- [ ] Muestra un calendario mensual con navegación mes anterior / siguiente
- [ ] Los días con eventos están marcados visualmente
- [ ] Al pulsar un día con eventos se muestran los eventos de ese día
- [ ] Al pulsar un evento de la lista se navega al detalle
- [ ] Los días sin eventos no son pulsables
- [ ] Estado de loading mientras se cargan los eventos del mes
- [ ] Ruta: `/events/calendar`

---

### T07 · Detalle de evento ✅ completado

**Archivos:**
- `src/pages/events/event-detail/EventDetailPage.tsx`
- `src/pages/events/event-detail/event-detail.scss`

**Criterios de aceptación:**
- [x] Zona degradada (amarillo → verde) con nombre, estado, fecha/hora y lugar
- [x] Estado de loading y error si el evento no existe
- [x] Menú ⋮ (solo admin/creador): opciones "Editar evento" y "Eliminar evento"
- [x] Confirmación de eliminación con Alert antes de borrar (T10 integrado aquí)
- [x] Sección de asistentes para admin/organizer: lista con filtros y avatares por estado
- [x] Cabecera de asistentes sticky al hacer scroll (top: 16px)
- [x] Sección de confirmación para member: botones Sí/No (UI lista, Firestore pendiente T12)
- [x] Ruta: `/events/:id`

---

## Semana 3 — 2-8 mayo · Crear, editar y eliminar eventos

### T08 · Crear evento ✗ Pendiente

**Archivos a crear:**
- `src/pages/events/create-event/CreateEventPage.tsx`
- `src/pages/events/create-event/create-event.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Solo admin y organizer pueden acceder (redirige si es member)
- [ ] Campos obligatorios: nombre, fecha, hora, deadline de confirmación
- [ ] Campos opcionales: lugar, descripción
- [ ] La fecha no puede ser en el pasado
- [ ] El deadline no puede ser posterior a la fecha del evento
- [ ] Contador de caracteres visible: nombre (máx. 80), descripción (máx. 500)
- [ ] Loading mientras se guarda
- [ ] Error si falla el guardado
- [ ] Al crear correctamente navega al detalle del nuevo evento
- [ ] Cancelar no crea ningún evento
- [ ] Traducciones en `es` y `ca`
- [ ] Ruta: `/events/create`

---

### T09 · Editar evento ✗ Pendiente

**Archivos a crear:**
- `src/pages/events/edit-event/EditEventPage.tsx`
- `src/pages/events/edit-event/edit-event.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Solo el creador del evento o el admin pueden acceder
- [ ] El formulario se pre-rellena con los datos actuales del evento
- [ ] Mismas validaciones que al crear
- [ ] Loading mientras se guardan los cambios
- [ ] Al guardar correctamente vuelve al detalle con datos actualizados
- [ ] Cancelar no modifica nada
- [ ] Ruta: `/events/:id/edit`

---

### T10 · Eliminar evento ✅ completado (integrado en T07)

**Criterios de aceptación:**
- [x] Solo el creador o el admin ven la opción en el menú ⋮
- [x] Alert de confirmación ("¿Estás seguro?" + "Esta acción no se puede deshacer.")
- [x] Cancelar no elimina nada
- [x] Al confirmar se elimina el evento (deleteEvent borra también las asistencias en batch)
- [x] Loading durante la eliminación
- [x] Al eliminar correctamente navega a `/events`

---

## Semana 4 — 9-15 mayo · Asistencia

### T11 · Modelo y servicio de asistencia ✗ Pendiente

**Archivos a crear:**
- `src/models/attendance.model.ts`
- `src/services/attendance.service.ts`

**Criterios de aceptación — modelo:**
- [ ] Interfaz `Attendance` con campos: `userId`, `eventId`, `response`, `confirmedAt`
- [ ] Tipo `AttendanceResponse`: `'going' | 'not-going'` (pendiente = sin documento)

**Criterios de aceptación — servicio:**
- [ ] `saveAttendance(groupId, eventId, userId, response)` — crea o actualiza el documento, lanza error en fallo
- [ ] `getUserAttendance(groupId, eventId, userId)` — devuelve la respuesta actual o `null` si no ha respondido
- [ ] `getAttendancesByEvent(groupId, eventId)` — devuelve todas las respuestas del evento, `null` en error
- [ ] Patrón try/catch del proyecto

---

### T12 · Confirmación de asistencia ✓ UI lista, ✗ lógica Firestore pendiente

**Archivos a modificar:**
- `src/pages/events/event-detail/EventDetailPage.tsx`
- `src/locales/es/events.json` y `src/locales/ca/events.json`

**Diseño acordado:**
- Vista member: sección "¿Te vienes?" con botones No / Sí (toggle)
- Sin botón "Guardar" — guardado dinámico al tocar
- Sin respuesta = estado pendiente (ningún botón resaltado)
- Sección de vinculados debajo: botón "Añadir vinculados" si no tiene ninguno; lista con opción de votar si tiene

**Criterios de aceptación pendientes:**
- [ ] Conectar botones Sí/No con `saveAttendance` del servicio (T11)
- [ ] Cargar la respuesta actual del usuario al entrar (`getUserAttendance`)
- [ ] Loading durante el guardado; error si falla
- [ ] Bloquear botones si el deadline ha pasado, con mensaje explicativo
- [ ] Conectar lista de asistentes (admin/organizer) con `getAttendancesByEvent`
- [ ] Activar filtros de asistentes con datos reales
- [ ] Reemplazar array `allMembers` con datos reales del grupo + asistencias

---

### T13 · Lista de asistentes ✅ integrado en T07 (datos Firestore pendientes en T12)

La lista de asistentes se muestra directamente en el detalle del evento para admin y organizer. No es una página separada.

**Lo que ya está:**
- [x] Solo visible para admin y organizer
- [x] Filtro desplegable: Todos / Confirmados / Pendientes / No van
- [x] Avatar con color según asistencia (azul/gris/rojo), nombre tachado si no va
- [x] Contador X/Total junto al título

**Pendiente (se activa en T12):**
- [ ] Datos reales de Firestore en lugar del array vacío

---

## Semana 5 — 16-22 mayo · Miembros y perfil

### T14 · Solicitudes de unión

**Archivos:**
- Crear: `src/pages/members/member-requests/MemberRequestsPage.tsx`
- Crear: `src/pages/members/member-requests/MemberRequests.tsx`
- Crear: `src/pages/members/member-requests/member-requests.scss`
- Modificar: `src/services/group.service.ts`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Solo admin y organizer acceden
- [ ] Lista cada solicitud con nombre del usuario y fecha
- [ ] Botones aceptar y rechazar por solicitud
- [ ] Aceptar añade al usuario con rol `member` y lo elimina de solicitudes
- [ ] Rechazar elimina la solicitud sin añadir al usuario
- [ ] Loading por acción, error si falla
- [ ] Estado vacío si no hay solicitudes
- [ ] Ruta: `/members/requests`

---

### T15 · Expulsar miembro

**Archivos:**
- Modificar: `src/pages/members/MembersPage.tsx`
- Modificar: `src/services/group.service.ts`

**Criterios de aceptación:**
- [ ] Solo el admin ve la opción de expulsar
- [ ] El admin no puede expulsarse a sí mismo
- [ ] Modal de confirmación con el nombre del miembro
- [ ] Cancelar no expulsa a nadie
- [ ] Al confirmar se elimina al miembro del grupo
- [ ] Tras expulsar vuelve a la lista de miembros

---

### T16 · Cambio de rol

**Archivos:**
- Modificar: `src/pages/members/MembersPage.tsx`
- Modificar: `src/services/group.service.ts`

**Criterios de aceptación:**
- [ ] Solo el admin ve la opción de cambiar rol
- [ ] El admin no puede cambiar su propio rol
- [ ] Muestra el rol actual y la acción disponible
- [ ] Modal de confirmación antes de aplicar el cambio
- [ ] Al confirmar actualiza el rol en el documento del grupo y en el documento del usuario
- [ ] Loading y error

---

### T17 · Página de perfil

**Archivos:**
- Crear: `src/pages/profile/ProfilePage.tsx`
- Crear: `src/pages/profile/Profile.tsx`
- Crear: `src/pages/profile/profile.scss`
- Modificar: `src/services/user.service.ts`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`
- Modificar: `src/locales/es/` y `src/locales/ca/` — namespace `profile`

**Criterios de aceptación:**
- [ ] Muestra: `username`, `fullName`, `email` y rol actual
- [ ] El email no es editable
- [ ] Puede editar `username` y `fullName` (campos no vacíos)
- [ ] Los cambios se guardan en Firestore al confirmar
- [ ] Selector de idioma: cambia entre `es` y `ca` de forma inmediata
- [ ] Loading mientras se guardan, error si falla
- [ ] Cancelar descarta los cambios
- [ ] Ruta: `/profile`

---

## Semana 6 — 23-29 mayo · Repaso, bugfixes y cierre MVP

### T18 · Prueba flujo completo de eventos y asistencia

**Criterios de aceptación:**
- [ ] Admin puede crear, editar y eliminar un evento
- [ ] Organizer puede crear eventos propios pero no editar los de otro organizer
- [ ] Member puede confirmar asistencia y cambiarla hasta el deadline
- [ ] Pasado el deadline los botones de asistencia están bloqueados
- [ ] Admin y organizer ven la lista de asistentes, los members no acceden
- [ ] Eliminar un evento elimina también sus asistencias en Firestore

---

### T19 · Prueba flujo completo de gestión de miembros

**Criterios de aceptación:**
- [ ] Un usuario puede solicitar unirse con código de invitación
- [ ] Admin y organizer ven la solicitud y pueden aceptarla o rechazarla
- [ ] Al aceptar el nuevo miembro aparece en la lista con rol `member`
- [ ] El admin puede cambiar el rol de member a organizer y viceversa
- [ ] El admin puede expulsar a un miembro y este desaparece de la lista
- [ ] Los guards de rutas funcionan correctamente para cada rol

---

### T20 · i18n, estados vacíos y casos límite

**Criterios de aceptación:**
- [ ] Cambiar idioma desde el perfil actualiza todos los textos de la app al instante
- [ ] No hay claves de traducción sin definir en ninguna pantalla
- [ ] Todas las pantallas tienen estado vacío cuando no hay datos
- [ ] Un usuario sin grupo no puede acceder a pantallas que requieren grupo
- [ ] Un evento sin asistencias muestra correctamente las tres secciones vacías

---

### T21 · Bugfixes y pulido final

**Criterios de aceptación:**
- [ ] Todos los errores encontrados en T18, T19 y T20 están corregidos
- [ ] La navegación entre pantallas es coherente (volver lleva donde corresponde)
- [ ] Los mensajes de error son claros y accionables
- [ ] No hay pantallas en estado de loading indefinido
- [ ] Merge `developer` → `main`
