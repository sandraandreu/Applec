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
**Estado:** ✓ Parcialmente implementado (enlace y código de invitación)

Tres vías de entrada:
- **Enlace de invitación:** el usuario lo abre, la app muestra el grupo y confirma unión.
- **Búsqueda por nombre:** el usuario busca la falla y envía solicitud (pendiente aprobación).
- **Invitación directa:** el Admin/Organizador busca al usuario por nombre o email y lo añade directamente.

Un usuario no puede pertenecer al mismo grupo dos veces. Sí puede pertenecer a varios grupos distintos.

---

### 5. Sistema de roles
**Estado:** ✓ Implementado en datos, ✗ lógica de permisos en UI pendiente

Tres roles:
- **Administrador:** control total del grupo. Solo 1 por grupo. No puede abandonar sin transferir el rol.
- **Organizador:** crea y gestiona sus propios eventos, aprueba solicitudes, añade miembros.
- **Miembro:** ve el calendario, confirma asistencia, ve solo su propia confirmación.

---

### 6. Gestión de miembros
**Estado:** ✓ Listado implementado (lista, filtros, búsqueda), ✗ modal de acciones pendiente (HTML/SCSS primero, luego lógica)

El Admin/Organizador ve la lista completa (nombre, rol, estado). Al pulsar un miembro se abre un modal con acciones:
- Ver perfil del miembro
- Cambiar rol (Hacer Organizador / Hacer Miembro)
- Eliminar miembro del grupo

Solo el Admin puede cambiar roles y expulsar miembros.

---

### 7. Crear evento
**Estado:** ✓ Completado (creación, edición y eliminación implementadas)

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
**Estado:** ✓ UI base implementada (botones Sí/No), ✗ lógica Firestore pendiente · ✗ diseño de vinculados a implementar

Cada miembro confirma: **sí** o **no**. No confirmar = "sin respuesta" (pendiente).

Se puede cambiar la respuesta mientras el plazo esté abierto. Al cerrar el plazo queda bloqueada.

Los miembros solo ven su propia confirmación. El listado completo es solo para Admin y Organizadores.

**Diseño acordado:**
- Sin botón "Guardar" — guardado dinámico al tocar Sí/No
- Sin voto = estado pendiente (ningún botón resaltado)
- Botones: No (outline) / Sí (relleno con check) — se resalta el seleccionado
- Vinculados: se muestran directamente debajo de los botones propios (no hay botón "añadir vinculados"); si el usuario tiene vinculados registrados, aparecen listados y se puede votar por cada uno individualmente

---

### 10. Listado de asistentes
**Estado:** ✓ UI implementada en el detalle del evento, ✗ datos reales pendientes

Integrado directamente en la página de detalle del evento (no es una página separada). Visible solo para Admin y Organizadores. Lista con filtros: Todos / Confirmados / Pendientes / No van. Avatar en color según asistencia: azul (confirmado), gris (pendiente), rojo (no va) con nombre tachado.

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
| 12 | Miembros vinculados (familia sin cuenta propia) | Versión futura — la UI de votación los mostrará con datos de demo |
| 13 | Inicio de sesión con Google | Versión futura |
| 14 | Gráfico circular de asistencia | Versión futura |
| 15 | Feed interno del grupo (publicaciones + comentarios) | Pantalla con datos hardcodeados para la presentación |
| 16 | Notificaciones | Pantalla con datos hardcodeados para la presentación |
| 17 | Planes de pago (gratuito / premium) | Monetización |
