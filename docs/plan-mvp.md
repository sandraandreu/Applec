# Plan de trabajo — MVP Falles App

> Este plan es provisional y se irá ajustando semana a semana según el progreso real.
> Fecha inicio: 17 abril 2026 | Presentación: 11 junio 2026

---

## Semana 1 — 17-24 abril · Home + Eventos: modelo, servicio y lista

---

### T01 · Diseñar el modelo de evento

Definir la estructura de datos que representa un evento dentro de un grupo. Un evento tiene campos obligatorios como nombre, fecha, hora y deadline de confirmación, y campos opcionales como ubicación y descripción. También tiene un estado que cambia a lo largo de su ciclo de vida.

**Resultado esperado:** Existe el fichero `src/models/event.model.ts` con la interfaz `Event` y el tipo `EventStatus` listos para ser usados en el servicio y los componentes.

**Criterios de aceptación:**
- La interfaz incluye los campos obligatorios: `name`, `date`, `time`, `confirmationDeadline`, `status`, `createdBy`
- La interfaz incluye los campos opcionales: `location`, `description`
- El tipo `EventStatus` cubre los cuatro estados: `activo | plazo-cerrado | finalizado | cancelado`
- El modelo incluye `id` y `groupId` para identificar el documento en Firestore
- El fichero exporta correctamente la interfaz y el tipo

---

### T02 · Crear el servicio de eventos

Implementar el servicio que gestiona todas las operaciones de eventos contra Firestore. Permite crear, leer, actualizar y eliminar eventos de un grupo. Cuando se elimina un evento, también se eliminan todas sus asistencias asociadas.

**Resultado esperado:** Existe `src/services/event.service.ts` con todos los métodos necesarios para que los componentes puedan trabajar con eventos sin tocar Firestore directamente.

**Criterios de aceptación:**
- El servicio incluye los métodos: `createEvent`, `getEvents`, `getEventById`, `updateEvent` y `deleteEvent`
- `getEvents` recibe un `groupId` y devuelve los eventos de ese grupo ordenados por fecha
- `deleteEvent` elimina también todas las asistencias del subcolección del evento
- Todos los métodos tienen try/catch siguiendo el patrón del proyecto (read devuelve `null` en error, write relanza el error)
- El servicio usa `db` importado desde `src/plugins/firebase.ts`, nunca instancia Firestore directamente

---

### T03 · Implementar la pantalla Home

Sustituir el placeholder actual de `Home.tsx` por una pantalla real que muestre al usuario un resumen de lo que pasa en su grupo: los próximos eventos y el número de miembros. Es la primera pantalla que ve el usuario al entrar en la app.

**Resultado esperado:** El usuario entra en la app y ve los próximos eventos de su grupo y un acceso rápido a crear un evento si tiene permisos.

**Criterios de aceptación:**
- Se muestran los próximos eventos del grupo (máximo 3), ordenados por fecha
- Se muestra el número total de miembros del grupo
- Si no hay eventos próximos se muestra un estado vacío con mensaje claro
- El botón de crear evento solo es visible para admin y organizer
- La pantalla muestra un loading mientras se cargan los datos
- Si hay error al cargar se muestra un mensaje de error

---

### T04 · Implementar la lista de eventos

Crear la pantalla que muestra todos los eventos del grupo. El usuario puede ver el listado completo y acceder al detalle de cada uno. Es la pantalla principal del módulo de eventos.

**Resultado esperado:** El usuario accede a la sección de eventos y ve todos los eventos del grupo con su nombre, fecha y estado actual.

**Criterios de aceptación:**
- Se listan todos los eventos del grupo ordenados por fecha
- Cada evento muestra: nombre, fecha y estado (`activo`, `plazo-cerrado`, etc.)
- Al pulsar un evento se navega al detalle
- Si no hay eventos se muestra un estado vacío con mensaje claro
- La pantalla muestra un loading mientras se cargan los datos
- El botón de crear evento solo es visible para admin y organizer

---

## Semana 2 — 25 abril - 1 mayo · Calendario + Detalle + Crear evento

---

### T05 · Implementar la vista de calendario

Crear una pantalla de calendario mensual donde el usuario puede ver qué días tienen eventos. Al navegar por los meses y pulsar un día con eventos, se muestran los eventos de ese día.

**Resultado esperado:** El usuario puede ver los eventos del mes en un calendario, navegar entre meses y acceder al detalle de un evento desde ahí.

**Criterios de aceptación:**
- Se muestra un calendario mensual con navegación de mes anterior y siguiente
- Los días que tienen eventos están marcados visualmente
- Al pulsar un día con eventos se muestra la lista de eventos de ese día
- Al pulsar un evento de la lista se navega al detalle
- Los días sin eventos no son pulsables
- Se muestra un loading mientras se cargan los eventos del mes

---

### T06 · Implementar la pantalla de detalle de evento

Crear la pantalla que muestra toda la información de un evento concreto. Desde aquí el usuario puede ver los detalles, confirmar su asistencia (si es member) o gestionar el evento (si tiene permisos).

**Resultado esperado:** El usuario pulsa un evento y ve toda su información, puede confirmar si va o no, y admin/organizer pueden editar o eliminar el evento.

**Criterios de aceptación:**
- Se muestran todos los campos del evento: nombre, fecha, hora, deadline, ubicación y descripción
- Se muestra el estado actual del evento
- Los members ven los botones de confirmar asistencia (sí/no)
- Si el deadline ha pasado los botones de asistencia están desactivados con mensaje explicativo
- El botón de editar solo es visible para el creador del evento o el admin
- El botón de eliminar solo es visible para el creador del evento o el admin
- Se muestra un loading mientras se carga el evento
- Si el evento no existe se muestra un mensaje de error y se puede volver atrás

---

### T07 · Implementar el formulario de crear evento

Implementar el flujo para que un admin u organizer cree un nuevo evento en el grupo. El usuario rellena los datos del evento y al guardar queda disponible para todos los miembros del grupo.

**Resultado esperado:** Admin y organizer pueden crear un evento desde la lista de eventos o el home. El evento se guarda en Firestore y aparece inmediatamente en la lista y el calendario.

**Criterios de aceptación:**
- Solo admin y organizer pueden acceder a esta pantalla
- Los campos obligatorios son: nombre, fecha, hora y deadline de confirmación
- Los campos opcionales son: ubicación y descripción
- La fecha no puede ser en el pasado
- El deadline de confirmación no puede ser posterior a la fecha del evento
- El nombre tiene un límite de caracteres con contador visible
- Se muestra loading mientras se guarda el evento
- Si hay error al guardar se muestra un mensaje de error
- Si el usuario cancela no se crea ningún evento
- Al crear el evento correctamente se navega al detalle del nuevo evento

---

## Semana 3 — 2-8 mayo · Editar/eliminar evento + Asistencia

---

### T08 · Implementar editar evento

Permitir que el creador de un evento o el admin puedan modificar sus datos. Se usa el mismo formulario que al crear, pero con los campos pre-rellenados con los valores actuales.

**Resultado esperado:** El creador del evento o el admin pueden editar cualquier campo del evento y los cambios se reflejan inmediatamente en la app.

**Criterios de aceptación:**
- Solo el creador del evento o el admin pueden acceder a la edición
- El formulario se pre-rellena con los datos actuales del evento
- Las mismas validaciones que al crear aplican también al editar
- Se muestra loading mientras se guardan los cambios
- Si hay error se muestra un mensaje de error
- Al guardar correctamente se vuelve al detalle del evento con los datos actualizados
- Si el usuario cancela no se modifica nada

---

### T09 · Implementar eliminar evento

Permitir que el creador de un evento o el admin puedan eliminarlo. La eliminación es permanente e incluye todas las asistencias registradas para ese evento.

**Resultado esperado:** El creador o el admin pueden eliminar un evento desde su detalle. Tras confirmar, el evento y sus asistencias desaparecen de Firestore y el usuario vuelve a la lista.

**Criterios de aceptación:**
- Solo el creador del evento o el admin ven el botón de eliminar
- Se muestra un modal de confirmación antes de eliminar
- Si el usuario cancela el modal no se elimina nada
- Al confirmar se eliminan el evento y todas sus asistencias asociadas
- Se muestra loading mientras se elimina
- Si hay error se muestra un mensaje de error
- Al eliminar correctamente se navega a la lista de eventos

---

### T10 · Diseñar el modelo de asistencia

Definir la estructura de datos que representa la respuesta de un usuario a un evento. La asistencia se guarda como un documento en la subcolección del evento en Firestore.

**Resultado esperado:** Existe `src/models/attendance.model.ts` con la interfaz `Attendance` y el tipo `AttendanceResponse` listos para usar en el servicio.

**Criterios de aceptación:**
- La interfaz incluye los campos: `userId`, `eventId`, `response` y `confirmedAt`
- El tipo `AttendanceResponse` es `'yes' | 'no'`
- El estado "sin respuesta" no existe como valor — simplemente no hay documento en Firestore para ese usuario
- El fichero exporta correctamente la interfaz y el tipo

---

### T11 · Crear el servicio de asistencias

Implementar el servicio que gestiona las confirmaciones de asistencia en Firestore. Permite a un usuario confirmar o cambiar su respuesta y a admin/organizer ver la lista completa de respuestas de un evento.

**Resultado esperado:** Existe `src/services/attendance.service.ts` con los métodos necesarios para que los componentes gestionen asistencias sin tocar Firestore directamente.

**Criterios de aceptación:**
- El servicio incluye: `confirmAttendance`, `getUserAttendance` y `getAttendancesByEvent`
- `confirmAttendance` crea el documento si no existe o lo actualiza si ya existe
- `getUserAttendance` devuelve la respuesta actual del usuario para un evento, o `null` si no ha respondido
- `getAttendancesByEvent` devuelve todas las respuestas de todos los usuarios de un evento
- Todos los métodos tienen try/catch siguiendo el patrón del proyecto

---

### T12 · Implementar la confirmación de asistencia

Añadir dentro del detalle del evento la funcionalidad para que el usuario confirme si va o no al evento. La respuesta se puede cambiar hasta que el deadline pase.

**Resultado esperado:** El usuario entra al detalle de un evento y puede indicar si va o no. Su respuesta queda guardada y puede cambiarla hasta el deadline.

**Criterios de aceptación:**
- Se muestran dos botones: "Voy" y "No voy"
- El botón correspondiente a la respuesta actual aparece destacado
- Si el usuario no ha respondido ningún botón aparece seleccionado
- Al pulsar un botón la respuesta se guarda inmediatamente en Firestore
- Se muestra un estado de loading mientras se guarda la respuesta
- Si el deadline ha pasado los botones están desactivados y se muestra un mensaje explicativo
- Si hay error al guardar se muestra un mensaje de error
- Los admin y organizer también pueden confirmar su propia asistencia

---

### T13 · Implementar la lista de asistentes

Crear la pantalla que muestra el desglose de respuestas de todos los miembros para un evento concreto. Solo visible para admin y organizer.

**Resultado esperado:** Admin y organizer pueden ver quién va, quién no va y quién no ha respondido, con el conteo de cada grupo.

**Criterios de aceptación:**
- Solo admin y organizer pueden acceder a esta pantalla
- Se muestran tres secciones: "Van", "No van" y "Sin respuesta"
- Cada sección muestra el número de personas y la lista de nombres
- Se muestra un loading mientras se cargan los datos
- Si hay error se muestra un mensaje de error
- Los members no pueden acceder a esta pantalla (guard de ruta)

---

## Semana 4 — 9-15 mayo · Gestión de miembros + Perfil

---

### T14 · Implementar la pantalla de solicitudes de unión

Crear la pantalla donde admin y organizer gestionan las solicitudes de nuevos miembros que quieren unirse al grupo. Pueden aceptar o rechazar cada solicitud individualmente.

**Resultado esperado:** Admin y organizer ven la lista de solicitudes pendientes y pueden aceptar o rechazar cada una. Al aceptar el usuario pasa a ser miembro del grupo.

**Criterios de aceptación:**
- Solo admin y organizer pueden acceder a esta pantalla
- Se lista cada solicitud con el nombre del usuario y la fecha en que solicitó unirse
- Cada solicitud tiene botones de aceptar y rechazar
- Al aceptar el usuario se añade al grupo con rol `member` y desaparece de la lista de solicitudes
- Al rechazar la solicitud desaparece de la lista sin añadir al usuario al grupo
- Se muestra loading durante cada acción
- Si hay error se muestra un mensaje de error
- Si no hay solicitudes pendientes se muestra un estado vacío con mensaje claro

---

### T15 · Implementar expulsar miembro

Permitir al admin eliminar un miembro del grupo. La acción es permanente y el miembro pierde el acceso al grupo inmediatamente.

**Resultado esperado:** El admin puede expulsar a un miembro desde su perfil dentro del grupo. Tras confirmar, el miembro deja de aparecer en la lista y pierde acceso al grupo.

**Criterios de aceptación:**
- Solo el admin ve la opción de expulsar
- El admin no puede expulsarse a sí mismo
- Se muestra un modal de confirmación con el nombre del miembro antes de expulsar
- Si el usuario cancela el modal no se expulsa a nadie
- Al confirmar se elimina al miembro del array `members` del grupo en Firestore
- Se muestra loading mientras se procesa la acción
- Si hay error se muestra un mensaje de error
- Tras expulsar correctamente se vuelve a la lista de miembros

---

### T16 · Implementar cambio de rol

Permitir al admin cambiar el rol de un miembro entre `member` y `organizer`. El cambio tiene efecto inmediato en los permisos del usuario dentro de la app.

**Resultado esperado:** El admin puede promover un member a organizer o degradar un organizer a member desde el perfil del miembro.

**Criterios de aceptación:**
- Solo el admin ve la opción de cambiar rol
- El admin no puede cambiar su propio rol
- La opción muestra el rol actual y la acción disponible ("Promover a Organizer" o "Degradar a Member")
- Se muestra un modal de confirmación antes de aplicar el cambio
- Si el usuario cancela el modal no se cambia nada
- Al confirmar se actualiza el rol en Firestore en el documento del grupo y en el documento del usuario
- Se muestra loading mientras se procesa
- Si hay error se muestra un mensaje de error

---

### T17 · Implementar la página de perfil

Crear la pantalla donde el usuario puede ver y editar sus datos personales y cambiar el idioma de la app. Accesible para todos los roles.

**Resultado esperado:** El usuario accede a su perfil, ve su información actual y puede editar su nombre o username y cambiar el idioma entre español y valenciano.

**Criterios de aceptación:**
- Se muestran los datos del usuario: `username`, `fullName`, `email` y rol actual
- El email no es editable
- El usuario puede editar `username` y `fullName` con validación (campos no vacíos)
- Los cambios se guardan en Firestore al confirmar
- Hay un selector de idioma que cambia entre español y valenciano de forma inmediata
- Se muestra loading mientras se guardan los cambios
- Si hay error al guardar se muestra un mensaje de error
- Si el usuario cancela la edición se descartan los cambios

---

## Semana 5 — 16-22 mayo · Repaso, bugfixes y cierre del MVP

---

### T18 · Probar el flujo completo de eventos y asistencia

Recorrer manualmente el ciclo de vida completo de un evento: desde su creación hasta que el plazo de confirmación cierra. Verificar que cada rol ve y puede hacer exactamente lo que le corresponde.

**Resultado esperado:** El flujo completo funciona sin errores y cada rol (admin, organizer, member) tiene acceso solo a lo que le corresponde.

**Criterios de aceptación:**
- Un admin puede crear, editar y eliminar un evento
- Un organizer puede crear eventos propios pero no editar los de otro organizer
- Un member puede confirmar asistencia y cambiarla hasta el deadline
- Pasado el deadline los botones de asistencia están bloqueados
- Admin y organizer ven la lista de asistentes; los members no pueden acceder
- La eliminación de un evento elimina también sus asistencias en Firestore

---

### T19 · Probar el flujo completo de gestión de miembros

Recorrer manualmente el flujo de incorporación y gestión de miembros: desde que alguien solicita unirse hasta que es aceptado, y las acciones posteriores de cambio de rol o expulsión.

**Resultado esperado:** El flujo de miembros funciona sin errores y los cambios en Firestore se reflejan inmediatamente en la app.

**Criterios de aceptación:**
- Un usuario puede solicitar unirse con un código de invitación
- Admin y organizer ven la solicitud y pueden aceptarla o rechazarla
- Al aceptar el nuevo miembro aparece en la lista de miembros con rol `member`
- El admin puede cambiar el rol de un member a organizer y viceversa
- El admin puede expulsar a un miembro y este desaparece de la lista
- Los guards de rutas funcionan correctamente para cada rol en todas las pantallas nuevas

---

### T20 · Revisión de i18n, estados vacíos y casos límite

Verificar que la app está completamente traducida en español y valenciano, que todos los estados vacíos tienen mensajes claros y que los casos límite están controlados.

**Resultado esperado:** La app funciona correctamente en ambos idiomas y no hay pantallas sin traducir, sin estados vacíos o con comportamientos inesperados en casos límite.

**Criterios de aceptación:**
- Cambiar el idioma desde el perfil actualiza todos los textos de la app inmediatamente
- No hay keys de traducción sin definir en ninguna pantalla
- Todas las pantallas tienen estado vacío cuando no hay datos
- Un usuario sin grupo asignado no puede acceder a las pantallas del grupo
- Un evento sin asistencias muestra correctamente las tres secciones vacías en la lista de asistentes

---

### T21 · Bugfixes y pulido final

Corregir todos los errores encontrados durante el repaso de los flujos. Pequeños ajustes de comportamiento, mensajes de error y navegación para dejar el MVP estable.

**Resultado esperado:** El MVP está estable, sin errores conocidos y listo para ser demostrado.

**Criterios de aceptación:**
- Todos los errores encontrados en T18, T19 y T20 están corregidos
- La navegación entre pantallas es coherente (los botones de volver llevan donde corresponde)
- Los mensajes de error son claros y accionables para el usuario
- No hay pantallas que queden en estado de loading indefinido
