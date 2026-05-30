# Falles App — Reglas de Negocio

Reglas generales que afectan al sistema en su conjunto, independientemente de la pantalla o acción concreta.

---

## 1. Roles y permisos

### Administrador
- Pueden existir hasta **3 Administradores por grupo**.
- Tienen acceso completo a todas las funcionalidades.
- Solo el Admin puede eliminar el grupo.
- Solo el Admin puede modificar la configuración del grupo (nombre, descripción).
- Puede asignar y revocar cualquier rol (Admin, Organizador, Miembro) a cualquier miembro.
- Puede expulsar a cualquier miembro, incluidos Organizadores.
- Puede crear, editar y eliminar **cualquier** evento, independientemente de quién lo creó.
- Puede aceptar o rechazar solicitudes de entrada.
- Puede añadir miembros directamente buscándolos por nombre o email.
- Es el responsable del plan de pago.

### Organizador
- Puede crear eventos.
- Puede editar y eliminar **únicamente sus propios eventos**.
- Puede ver el listado completo de asistentes de todos los eventos.
- Puede aceptar o rechazar solicitudes de entrada.
- Puede añadir miembros directamente.
- **No puede** modificar la configuración del grupo.
- **No puede** editar/eliminar eventos de otros Organizadores.
- **No puede** expulsar miembros ni cambiar roles.

### Miembro
- Puede ver el calendario y los eventos.
- Puede confirmar su propia asistencia dentro del plazo.
- **No puede** crear, editar ni eliminar eventos.
- **No puede** ver quién más ha confirmado asistencia (solo su propia respuesta).
- **No puede** gestionar solicitudes ni añadir miembros.

### Cambios de rol
- Solo el Admin puede cambiar roles (promover a Admin, Organizador o Miembro).
- Promover a alguien a Admin requiere confirmación explícita (modal).
- No puede haber más de 3 Admins en el mismo grupo; si ya hay 3, la opción queda bloqueada.
- El Admin no puede ser degradado mientras sea titular del grupo.
- Si el Admin quiere abandonar el grupo, **debe transferir el rol primero**. El sistema no permite grupos sin Admin.
- Si el Admin es el único miembro y quiere salir, el sistema ofrece eliminar el grupo directamente.

---

## 2. Gestión de eventos

### Creación
- Campos obligatorios: **nombre, fecha, hora, fecha límite de confirmación**.
- Campos opcionales: lugar, descripción.
- La fecha límite de confirmación **no puede ser posterior** a la fecha del evento.
- Límites de caracteres: nombre máx. 80, descripción máx. 500.
- Al guardar: se publica en el calendario y se notifica a todos los miembros.

### Edición y eliminación
- El creador (Admin u Organizador) puede editar o eliminar su evento en cualquier momento.
- El Admin puede editar o eliminar **cualquier** evento.
- Un Organizador **no puede** editar/eliminar eventos de otro Organizador.
- Si se edita la **fecha u hora**: las confirmaciones existentes se mantienen, pero se notifica a los miembros para que puedan revisarlas.
- Si se **elimina** un evento: todas las confirmaciones se eliminan y los miembros son notificados.

### Estados
| Estado | Condición |
|---|---|
| `activo` | Publicado, fecha no pasada, plazo abierto |
| `plazo-cerrado` | Deadline vencido, evento aún no ocurrido |
| `finalizado` | Fecha del evento pasada |
| `cancelado` | Eliminado antes de ocurrir |

---

## 3. Confirmación de asistencia

- Opciones: **sí** o **no**.
- No confirmar = estado **"sin respuesta"** (no equivale a "no").
- Solo se puede confirmar dentro del plazo definido al crear el evento.
- Dentro del plazo, el miembro puede cambiar su respuesta tantas veces como quiera.
- Una vez vencido el plazo, la confirmación queda **bloqueada**.
- El listado de asistentes (sí / no / sin respuesta) es visible **solo** para Admin y Organizadores.

### Acompañantes en la confirmación

- Cada miembro puede confirmar también por sus acompañantes vinculados.
- Los acompañantes son de dos tipos: **fallero/a** (pertenece a la falla sin cuenta propia) o **externo/a** (persona ajena a la falla).
- El admin configura por evento si se permiten externos y cuántos como máximo puede traer cada miembro.
- Si el evento **no permite externos**: en el VoteSheet solo aparecen los acompañantes falleros.
- Si el evento **permite externos con límite**: al alcanzar el máximo, los botones "Sí" de los externos restantes quedan deshabilitados.
- Si el evento **permite externos sin límite**: aparecen todos sin restricción.

---

## 4. Gestión del grupo

### Acceso
- Tres formas de unirse: enlace de invitación, búsqueda por nombre + solicitud, o invitación directa por Admin/Organizador.
- El enlace de invitación es único por grupo. El Admin puede regenerarlo.
- Las solicitudes por búsqueda requieren aprobación de Admin u Organizador.
- Un usuario **no puede pertenecer al mismo grupo dos veces**.
- Un usuario **puede pertenecer a varios grupos distintos** simultáneamente.

### Salida de un miembro
- Cualquier miembro puede abandonar voluntariamente en cualquier momento.
- Al salir: pierde acceso inmediato a todo el contenido del grupo.
- Sus confirmaciones en eventos **futuros** se eliminan del recuento.
- Sus confirmaciones en eventos ya **finalizados** se conservan en el historial.
- Si era Organizador: los eventos que creó permanecen y pasan a ser gestionables solo por el Admin.
- El Admin **no puede abandonar** sin transferir el rol.

### Expulsión
- Solo el Admin puede expulsar miembros.
- Mismo efecto que la salida voluntaria: pérdida de acceso inmediata + confirmaciones futuras eliminadas.
- El miembro expulsado no recibe notificación detallada.
- Un miembro expulsado puede volver a solicitar unirse (bloqueo de usuario: funcionalidad futura).

### Eliminación del grupo
- Solo el Admin puede eliminar el grupo.
- El sistema muestra confirmación explícita antes de proceder.
- Todos los miembros pierden acceso inmediatamente.
- Los datos se conservan **30 días** (no accesibles para usuarios) y luego se borran definitivamente.

---

## 5. Visibilidad de la información

| Información | Quién la ve |
|---|---|
| Calendario y eventos | Todos los miembros |
| Detalle completo del evento | Todos los miembros |
| Listado de asistentes | Solo Admin y Organizadores |
| Confirmación de otros miembros | Nadie excepto Admin/Organizadores |
| Mi propia confirmación | Yo mismo |
| Feed interno | Todos los miembros (plan premium, futuro) |
| Nombre del usuario | Todos los miembros del grupo |
| Email del usuario | Solo el sistema (no visible para otros) |

Los grupos son **privados**. No existe directorio público de grupos ni de miembros. La búsqueda solo muestra el nombre del grupo y la opción de solicitar unirse.

---

## 6. Límites del sistema

### Plan gratuito (orientativo)
- Máximo **40 miembros** por grupo.
- Sin feed interno.
- Sin miembros vinculados.
- Sin gráfico de asistencia.

### Plan premium (orientativo)
- Hasta **100+ miembros** (o sin límite).
- Feed interno del grupo.
- Miembros vinculados.
- Gráfico circular de asistencia.
- Solo el Admin necesita contratar el plan. Los miembros no tienen coste.

### Otros límites
- Nombre del grupo: máx. 60 caracteres.
- Descripción del grupo: máx. 300 caracteres.
- Nombre del evento: máx. 80 caracteres.
- Descripción del evento: máx. 500 caracteres.
- Sin límite de eventos por grupo (pendiente de revisión).
- Sin límite de grupos por usuario (pendiente de revisión).

---

## 7. Comportamiento ante condiciones adversas

- Si se pierde conexión rellenando un formulario: los datos no se pierden.
- Las acciones solo se registran cuando el servidor las confirma (no optimistic updates).
- Si se pierde conexión al confirmar asistencia: se muestra error y se permite reintentar.
- El calendario y eventos ya cargados son consultables en modo offline (caché). No se pueden realizar acciones de escritura sin conexión.
- Si dos usuarios realizan acciones al mismo tiempo: el sistema las gestiona sin conflicto.
