# MVP Falles App — Plan de Implementación

**Inicio:** 17 abril 2026 · **Presentación:** 11 junio 2026
**Margen para presentación:** 2 semanas (1-11 junio)

---

## Semana 1 — 17-24 abril · Modelo, servicio, navegación y Home

### T01 · Modelo de evento

**Archivos:**
- Crear: `src/models/event.model.ts`

**Criterios de aceptación:**
- [ ] Existe la interfaz `Event` con campos obligatorios: `id`, `groupId`, `name`, `date`, `time`, `confirmationDeadline`, `status`, `createdBy`, `createdAt`
- [ ] Campos opcionales: `location`, `description`
- [ ] Existe el tipo `EventStatus`: `'activo' | 'plazo-cerrado' | 'finalizado' | 'cancelado'`
- [ ] Existe el tipo `EventCreate` (Event sin `id` ni `createdAt`)

---

### T02 · Servicio de eventos

**Archivos:**
- Crear: `src/services/event.service.ts`

**Criterios de aceptación:**
- [ ] `getEvents(groupId)` — devuelve eventos del grupo ordenados por fecha, `null` en error
- [ ] `getEventById(groupId, eventId)` — devuelve el evento o `null`
- [ ] `createEvent(groupId, data)` — crea el documento, devuelve el nuevo id, lanza error en fallo
- [ ] `updateEvent(groupId, eventId, data)` — actualiza campos, lanza error en fallo
- [ ] `deleteEvent(groupId, eventId)` — elimina el evento y todas sus asistencias (batch), lanza error en fallo
- [ ] Usa `db` de `src/plugins/firebase.ts`, nunca instancia Firestore directamente
- [ ] Todos los métodos tienen try/catch siguiendo el patrón del proyecto

---

### T03 · Navegación — Bottom navigation bar

**Archivos:**
- Crear: `src/components/bottom-nav/BottomNav.tsx`
- Crear: `src/components/bottom-nav/bottom-nav.scss`
- Modificar: `src/components/base-layout/BaseLayout.tsx`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Barra de navegación inferior visible en todas las pantallas privadas con grupo
- [ ] Ítems para admin/organizer: Inicio · Eventos · Miembros · Perfil
- [ ] Ítems para member: Inicio · Eventos · Perfil (sin acceso a gestión)
- [ ] El ítem activo se resalta visualmente
- [ ] La barra no aparece en pantallas de auth ni onboarding

---

### T04 · Pantalla Home

**Archivos:**
- Modificar: `src/pages/home/Home.tsx`
- Crear: `src/pages/home/home.scss`
- Modificar: `src/locales/es/common.json` y `src/locales/ca/common.json`

**Criterios de aceptación:**
- [ ] Muestra los próximos 3 eventos del grupo ordenados por fecha
- [ ] Muestra el número total de miembros del grupo
- [ ] Estado vacío si no hay eventos próximos
- [ ] Estado de loading mientras se cargan los datos
- [ ] Estado de error si falla la carga
- [ ] Botón "Crear evento" visible solo para admin y organizer
- [ ] Traducciones en `es` y `ca`

---

## Semana 2 — 25 abril - 1 mayo · Lista, calendario y detalle de eventos

### T05 · Lista de eventos

**Archivos:**
- Crear: `src/pages/events/events-list/EventsListPage.tsx`
- Crear: `src/pages/events/events-list/EventsList.tsx`
- Crear: `src/pages/events/events-list/events-list.scss`
- Crear: `src/locales/es/events.json` y `src/locales/ca/events.json`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Lista todos los eventos del grupo ordenados por fecha
- [ ] Cada evento muestra: nombre, fecha y estado
- [ ] Estado vacío si no hay eventos
- [ ] Estado de loading y de error
- [ ] Botón "Crear evento" visible solo para admin y organizer
- [ ] Al pulsar un evento navega al detalle
- [ ] Ruta: `/events`

---

### T06 · Vista de calendario

**Archivos:**
- Crear: `src/pages/events/events-calendar/EventsCalendarPage.tsx`
- Crear: `src/pages/events/events-calendar/EventsCalendar.tsx`
- Crear: `src/pages/events/events-calendar/events-calendar.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Muestra un calendario mensual con navegación mes anterior / siguiente
- [ ] Los días con eventos están marcados visualmente
- [ ] Al pulsar un día con eventos se muestran los eventos de ese día
- [ ] Al pulsar un evento de la lista se navega al detalle
- [ ] Los días sin eventos no son pulsables
- [ ] Estado de loading mientras se cargan los eventos del mes
- [ ] Ruta: `/events/calendar`

---

### T07 · Detalle de evento

**Archivos:**
- Crear: `src/pages/events/event-detail/EventDetailPage.tsx`
- Crear: `src/pages/events/event-detail/EventDetail.tsx`
- Crear: `src/pages/events/event-detail/event-detail.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Muestra todos los campos del evento: nombre, fecha, hora, deadline, lugar, descripción y estado
- [ ] Estado de loading y estado de error si el evento no existe
- [ ] Botón "Editar" visible solo para el creador del evento o el admin
- [ ] Botón "Eliminar" visible solo para el creador del evento o el admin
- [ ] Sección de asistencia visible (se implementará en T12)
- [ ] Ruta: `/events/:id`

---

## Semana 3 — 2-8 mayo · Crear, editar y eliminar eventos

### T08 · Crear evento

**Archivos:**
- Crear: `src/pages/events/create-event/CreateEventPage.tsx`
- Crear: `src/pages/events/create-event/CreateEvent.tsx`
- Crear: `src/pages/events/create-event/create-event.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`
- Modificar: `src/locales/es/events.json` y `src/locales/ca/events.json`

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

### T09 · Editar evento

**Archivos:**
- Crear: `src/pages/events/edit-event/EditEventPage.tsx`
- Crear: `src/pages/events/edit-event/EditEvent.tsx`
- Crear: `src/pages/events/edit-event/edit-event.scss`
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

### T10 · Eliminar evento

**Archivos:**
- Modificar: `src/pages/events/event-detail/EventDetail.tsx`

**Criterios de aceptación:**
- [ ] Solo el creador o el admin ven el botón de eliminar
- [ ] Se muestra modal de confirmación antes de eliminar
- [ ] Cancelar el modal no elimina nada
- [ ] Al confirmar se eliminan el evento y todas sus asistencias
- [ ] Loading durante la eliminación
- [ ] Al eliminar correctamente navega a la lista de eventos

---

## Semana 4 — 9-15 mayo · Asistencia

### T11 · Modelo y servicio de asistencia

**Archivos:**
- Crear: `src/models/attendance.model.ts`
- Crear: `src/services/attendance.service.ts`

**Criterios de aceptación — modelo:**
- [ ] Interfaz `Attendance` con campos: `userId`, `eventId`, `response`, `confirmedAt`
- [ ] Tipo `AttendanceResponse`: `'yes' | 'no'`

**Criterios de aceptación — servicio:**
- [ ] `confirmAttendance(groupId, eventId, userId, response)` — crea o actualiza el documento, lanza error en fallo
- [ ] `getUserAttendance(groupId, eventId, userId)` — devuelve la respuesta actual o `null` si no ha respondido
- [ ] `getAttendancesByEvent(groupId, eventId)` — devuelve todas las respuestas del evento, `null` en error
- [ ] Patrón try/catch del proyecto

---

### T12 · Confirmación de asistencia

**Archivos:**
- Modificar: `src/pages/events/event-detail/EventDetail.tsx`
- Modificar: `src/locales/es/events.json` y `src/locales/ca/events.json`

**Criterios de aceptación:**
- [ ] Todos los roles ven los botones "Voy" / "No voy"
- [ ] El botón correspondiente a la respuesta actual aparece resaltado
- [ ] Si no ha respondido, ningún botón aparece seleccionado
- [ ] Al pulsar se guarda inmediatamente con loading
- [ ] Si el deadline ha pasado los botones están desactivados con mensaje explicativo
- [ ] Error si falla el guardado
- [ ] Traducciones en `es` y `ca`

---

### T13 · Lista de asistentes

**Archivos:**
- Crear: `src/pages/events/attendance-list/AttendanceListPage.tsx`
- Crear: `src/pages/events/attendance-list/AttendanceList.tsx`
- Crear: `src/pages/events/attendance-list/attendance-list.scss`
- Modificar: `src/routes/appRoutes/AppRoutes.tsx`

**Criterios de aceptación:**
- [ ] Solo admin y organizer pueden acceder
- [ ] Tres secciones: "Van" / "No van" / "Sin respuesta"
- [ ] Cada sección muestra el número de personas y la lista de nombres
- [ ] Loading y error
- [ ] Ruta: `/events/:id/attendances`

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
