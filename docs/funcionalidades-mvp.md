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
**Estado:** ✓ Listado implementado, ✗ acciones de gestión pendientes

El Admin/Organizador ve la lista completa (nombre, rol, estado). El Admin puede aceptar/rechazar solicitudes y expulsar miembros. Solo el Admin cambia roles.

---

### 7. Crear evento
**Estado:** ✗ Pendiente (T08)

Solo Admin y Organizadores pueden crear eventos.

**Campos obligatorios:** nombre (máx. 80 caracteres), fecha, hora, fecha límite de confirmación.
**Campos opcionales:** lugar, descripción (máx. 500 caracteres).

La fecha límite de confirmación no puede ser posterior a la fecha del evento.

Dos vías de creación: desde plantilla predefinida (cena, ofrenda, reunión, etc.) o desde cero.

Al guardar: aparece en el calendario del grupo + notificación a todos los miembros.

---

### 8. Calendario común
**Estado:** ✗ Pendiente (T06)

Visible para todos los miembros. Eventos ordenados por fecha, navegación por mes/semana. Al seleccionar un evento: detalle completo (nombre, fecha, hora, lugar, descripción, fecha límite).

**Estados de un evento:**
- `activo` — publicado, fecha no pasada, plazo abierto
- `plazo-cerrado` — deadline vencido, evento aún no ocurrido, ya no se puede confirmar
- `finalizado` — fecha pasada, visible en historial, sin interacción posible
- `cancelado` — eliminado antes de ocurrir, notifica a miembros

---

### 9. Confirmación de asistencia
**Estado:** ✓ UI implementada, ✗ lógica Firestore pendiente (T11 + T12)

Cada miembro confirma: **sí** o **no**. No confirmar = "sin respuesta" (pendiente).

Se puede cambiar la respuesta mientras el plazo esté abierto. Al cerrar el plazo queda bloqueada.

Los miembros solo ven su propia confirmación. El listado completo es solo para Admin y Organizadores.

**Diseño acordado:**
- Sin botón "Guardar" — guardado dinámico al tocar Sí/No
- Sin voto = estado pendiente (ningún botón resaltado)
- Botones actuales: No (outline) / Sí (relleno con check) — se resalta el seleccionado
- Sección de vinculados debajo: si no tiene ninguno → botón "añadir vinculados"; si tiene → lista con opción de votar por cada uno

---

### 10. Listado de asistentes
**Estado:** ✓ UI implementada en el detalle del evento, ✗ datos reales pendientes (T12)

Integrado directamente en la página de detalle del evento (no es una página separada). Visible solo para Admin y Organizadores. Lista con filtros: Todos / Confirmados / Pendientes / No van. Avatar en color según asistencia: azul (confirmado), gris (pendiente), rojo (no va) con nombre tachado.

---

## Bloque 2 · Nice to Have (versiones futuras)

Funcionalidades fuera del MVP, a implementar después de la presentación si hay tiempo o en versiones posteriores.

| # | Funcionalidad | Plan |
|---|---|---|
| 11 | Miembros vinculados (familia sin cuenta propia) | Versión futura |
| 12 | Inicio de sesión con Google | Versión futura |
| 13 | Gráfico circular de asistencia | Versión futura |
| 14 | Feed interno del grupo (publicaciones + comentarios) | Premium |
| 15 | Planes de pago (gratuito / premium) | Monetización |
