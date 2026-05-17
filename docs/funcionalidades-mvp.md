# Falles App — Funcionalidades MVP

## Bloque 1 · MVP

Las funcionalidades imprescindibles para resolver el problema principal.

---

### 1. Registro e inicio de sesión
**Estado:** ✓ Implementado

El usuario crea cuenta con nombre, email y contraseña. En accesos posteriores entra directamente a su grupo. Recuperación de contraseña por email.

**Campos requeridos en registro:** nombre, apellidos, username, email, contraseña.

**Estados de interfaz:** vacío → con datos → loading → error / éxito (redirección automática).

---

### 2. Selección de idioma
**Estado:** ✓ Implementado

El usuario elige entre castellano y valenciano. Por defecto: castellano. Se puede cambiar desde el perfil en cualquier momento. El cambio se aplica inmediatamente sin reiniciar la app. Los datos de formularios en curso no se pierden al cambiar idioma.

---

### 3. Crear grupo de falla
**Estado:** ✓ Implementado

Un usuario registrado crea un grupo privado. Se convierte automáticamente en Administrador. Se genera un código de invitación único de 6 caracteres alfanuméricos.

**Campos:** nombre (obligatorio, máx. 50 caracteres), imagen/logo (opcional, máx. 5 MB).

---

### 4. Unirse a un grupo existente
**Estado:** ✓ Parcialmente implementado (código de invitación — unión directa provisional), ✗ flujo de solicitud + aprobación pendiente (T31)

Tres vías de entrada, todas pasan por aprobación del Admin o Organizador:
- **Código de invitación:** el usuario introduce el código, se envía una solicitud al grupo. El Admin/Organizador la aprueba o rechaza. *(Actualmente la implementación une directamente sin solicitud — esto cambiará)*
- **Búsqueda por nombre:** el usuario busca la falla y envía solicitud (pendiente aprobación).
- **Invitación directa:** el Admin/Organizador busca al usuario por nombre o email y lo añade directamente sin solicitud previa.

Las solicitudes pendientes se almacenan en `groups/{groupId}/joinRequests/{uid}`. Al aprobar: se añade al array `members` y se borra el documento. Al rechazar: se borra el documento.

Admin y Organizadores ven las solicitudes pendientes y pueden aprobarlas o rechazarlas desde una pantalla de gestión.

Un usuario solo puede pertenecer a un grupo. Si ya tiene grupo, las rutas `/create-group`, `/join-group` y `/onboarding/group` redirigen a `/events`.

---

### 5. Sistema de roles
**Estado:** ✓ Implementado

Tres roles:
- **Administrador:** control total del grupo. Máximo 3 por grupo. No puede abandonar sin transferir el rol.
- **Organizador:** crea y gestiona sus propios eventos, aprueba solicitudes, añade miembros.
- **Miembro:** ve el calendario, confirma asistencia, ve solo su propia confirmación.

Al cambiar el rol de un miembro, el Admin selecciona entre los roles disponibles con descripciones de cada uno (visibles con icono de info). Promover a Admin requiere confirmación explícita mediante modal. Si ya hay 3 Admins, la opción queda bloqueada.

---

### 6. Gestión de miembros
**Estado:** ✓ Implementado (listado con búsqueda y filtros, página de detalle con cambio de rol y eliminación)

El Admin/Organizador ve la lista completa (nombre, rol, estado). Al pulsar un miembro se navega a `/members/:uid` con acciones:
- Cambiar rol (Hacer Organizador / Hacer Miembro)
- Eliminar miembro del grupo

Solo el Admin puede cambiar roles y expulsar miembros. Los permisos se derivan de `user.permissions.canManageMembers`.

---

### 7. Crear evento
**Estado:** ✓ Completado (creación, edición y eliminación implementadas; modal de confirmación de borrado como bottom sheet)

Solo Admin y Organizadores pueden crear eventos.

Flujo de 3 pasos: (1) tipo de evento (normal / especial) + nombre + descripción opcional; (2) fecha, hora de inicio, hora de fin opcional y lugar; (3) configuración de confirmación obligatoria, recordatorio y fecha límite de confirmación opcional.

**Campos obligatorios:** nombre (máx. 80 caracteres), fecha, hora de inicio, lugar.
**Campos opcionales:** descripción (máx. 500 caracteres), hora de fin, fecha límite de confirmación.

La fecha límite de confirmación no puede ser posterior a la fecha del evento.

Edición disponible (reutiliza el formulario de creación). Eliminación con modal de confirmación. Al eliminar se navega de vuelta a la lista de eventos.

---

### 8. Calendario común
**Estado:** ✗ Pendiente — spec definida en `docs/specs/events-calendar.md`

Visible para todos los miembros. Vista mensual con navegación por mes. Días con eventos marcados con punto azul. Al seleccionar un día se muestra la lista de eventos de ese día usando `EventCard`.

**Librería:** FullCalendar (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`).

**Estados de un evento:**
- `activo` — publicado, fecha no pasada, plazo abierto
- `plazo-cerrado` — deadline vencido, evento aún no ocurrido, ya no se puede confirmar
- `finalizado` — fecha pasada, visible en historial, sin interacción posible
- `cancelado` — eliminado antes de ocurrir, notifica a miembros

---

### 9. Confirmación de asistencia
**Estado:** ✓ UI completa implementada (VoteSheet, AddLinkedMemberPage, LinkedMembersPage), ✗ lógica Firestore pendiente (servicio `saveAttendance`, estado en VoteSheet, refresco tras guardar)

Todos los roles (Admin, Organizador, Miembro) pueden confirmar asistencia. No confirmar = "sin respuesta" (pendiente).

Se puede cambiar la respuesta mientras el plazo esté abierto. Al cerrar el plazo queda bloqueada.

Los miembros solo ven su propia confirmación. El listado completo es solo para Admin y Organizadores.

**Diseño implementado:**
- Botón CTA fijo en la parte inferior de la pantalla de detalle (visible para todos los roles mientras el evento esté activo)
- Bottom sheet (`VoteSheet`) con swipe para cerrar
- Sin voto = estado pendiente (ningún botón resaltado)
- Botones propios: No (rojo outline) / Sí (teal outline) — se rellena el seleccionado
- Botón "Confirmar" en el footer del sheet
- Acompañantes: botones circulares Sí/No por cada uno; botón "Añadir acompañante" navega a `/members/linked/new`
- Tras volver de añadir acompañante, el sheet se reabre automáticamente

---

### 10. Listado de asistentes
**Estado:** ✓ UI implementada en el detalle del evento, ✗ datos reales pendientes (vinculados al punto 9)

Integrado directamente en la página de detalle del evento (no es una página separada). Visible solo para Admin y Organizadores. Lista con filtros: Todos / Confirmados / Pendientes / No van. Muestra todos los miembros del grupo (todos los roles) y sus acompañantes. Por defecto se muestran 4 entradas con botón para expandir el listado completo.

---

### 11. Perfil de usuario
**Estado:** ✗ Pendiente (pantalla no creada — HTML/SCSS primero)

Pantalla accesible desde la barra de navegación inferior.

**Contenido:**
- Avatar circular + nombre completo + badge de rol
- Sección **Mi cuenta:** Editar perfil · Mis vinculados · Notificaciones · Idioma
- Sección **Mi falla:** Compartir acceso · Configuración del grupo · Cerrar sesión

Idioma se puede cambiar desde el perfil (ya funciona globalmente). Cerrar sesión llama a `logout` del `AuthContext`.

---

## Bloque 2 · Nice to Have (versiones futuras)

Funcionalidades fuera del MVP, a implementar después de la presentación si hay tiempo o en versiones posteriores.

| # | Funcionalidad | Plan |
|---|---|---|
| 12 | Miembros vinculados (familia sin cuenta propia) | UI implementada (LinkedMembersPage + AddLinkedMemberPage), ✗ Firebase pendiente (crear, editar, eliminar) |
| 13 | Inicio de sesión con Google | Versión futura |
| 14 | Gráfico circular de asistencia | Versión futura |
| 15 | Feed interno del grupo (publicaciones + comentarios) | Pantalla con datos hardcodeados para la presentación |
| 16 | Notificaciones | Pantalla con datos hardcodeados para la presentación |
| 17 | Planes de pago (gratuito / premium) | Monetización |
| 18 | Swipe en tarjetas de lista | Swipe izquierdo en `EventCard` / `MemberCard` para revelar acciones rápidas (editar, eliminar). Requiere rediseño de las cards con action buttons ocultos |
