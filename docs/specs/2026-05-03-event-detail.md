# Spec — Pantalla de detalle de evento

**Fecha:** 2026-05-03  
**Última actualización:** 2026-05-06  
**Tareas:** T07 ✅ completado · T10 🔄 pendiente (siguiente sesión)  
**Rama:** developer  

---

## Contexto

Pantalla que se abre al pulsar un evento en la lista (`/events`). Muestra todos los datos del evento y acciones según el rol. La ruta `/events/:id` está fuera del `MainLayout` (sin TopBar ni TabBar). La confirmación de asistencia es visual para el miembro — la lógica de Firestore se conecta en T12.

---

## Estado actual — qué hay implementado

### Layout y navegación
- Ruta `/events/:id` sin TopBar ni TabBar (fuera de `<MainLayout>` en `AppRoutes.tsx`)
- `BackButton` propio en la parte superior
- Redirect a `/events` si el evento no existe o hay error al cargar

### Zona de información del evento
- Nombre del evento (`h1`)
- Badge de estado debajo del nombre: `activo` (teal) / `plazo-cerrado` (naranja) / `finalizado` (gris) — derivado de `getEventStatus(event)`, no almacenado en Firestore
- Fecha con día de la semana capitalizado, formateada según idioma (`ca-ES` / `es-ES`)
- Lugar — condicional, solo si `event.location` existe
- Descripción — condicional, solo si `event.description` existe

### Sección de asistentes (solo admin y organizer)
- Contador `X/Y` donde X = miembros que van (fake por ahora), Y = total de miembros del grupo
- Lista de miembros con `MemberCard` (sin flecha, `showChevron={false}`)
- Estado vacío si no hay nadie confirmado
- Los datos de asistencia son **fake** hasta T12

### Vista del miembro
- Sección "¿Te vienes?" con botones Sí / No (visual, sin lógica de guardado)
- Botón "Votar por mis vinculados" — deshabilitado
- Botón "Guardar" — visual, sin funcionalidad hasta T12

### Botones de editar/eliminar (admin y organizer con `canEdit`)
- Botón "Editar evento" → navega a `/events/:id/edit`
- Botón "Eliminar evento" → **pendiente T10** (botón existe pero sin lógica)

### MemberCard
- Prop `showChevron?: boolean` añadida (default `true`)
- En la sección de asistentes se usa `showChevron={false}`

---

## Rediseño pendiente — a implementar en la próxima sesión

### Nuevo diseño según Figma (revisado 2026-05-06)

**1. Fondo degradado en la zona superior**
- La zona que contiene: BackButton, cabecera (título + ⋮), badge, fecha, lugar y descripción tiene un fondo degradado vertical
- CSS: `background: linear-gradient(to bottom, #FEFFEA 0%, #CCF4F3 62%)`
- La zona de asistentes (y botones del miembro) va sobre fondo blanco

**2. Botón de tres puntos ⋮ (reemplaza los botones de editar/eliminar)**
- Aparece en la cabecera, a la derecha del nombre del evento
- Solo visible si `canEdit`
- Al pulsarlo abre un menú desplegable con dos opciones:
  - "Editar evento" → navega a `/events/:id/edit`
  - "Eliminar evento" → abre el `Alert` de confirmación (T10)
- Los botones "Editar" y "Eliminar" del final de la página desaparecen
- El menú se cierra al pulsar fuera o al seleccionar una opción

**3. T10 — Eliminar evento (lógica)**
- Al pulsar "Eliminar evento" en el desplegable → se abre `<Alert>`
- Header: `events:delete.confirm` / Message: `events:delete.message`
- Botones: Cancelar (`role: "cancel"`) + Eliminar (`role: "destructive"`)
- Al confirmar: `deleteEvent(profile.groupId, event.id)` → loading → navega a `/events`
- Si falla: muestra `events:delete.error` en pantalla (sin alert, inline)
- Estado: `showDeleteAlert`, `isDeleting`, `deleteError`

**4. Sección de asistentes rediseñada**
- Muestra **todos** los miembros del grupo (no solo los que han confirmado)
- Contador sigue siendo solo los que van (`goingCount/totalMembers`)
- Chip de filtro a la derecha: "Todos N ↓" — visual por ahora, funcional en T12
- Al pulsar el chip: dropdown con opciones Todos / Confirmados / No van / Sin respuesta
- Cards: solo avatar + nombre (sin chip de rol, sin flecha)
  - → Añadir prop `showRole?: boolean` a `MemberCard` (default `true`)
  - → En la lista de asistentes: `showChevron={false}` + `showRole={false}`
- Color del avatar según asistencia (implementar en T12):
  - Azul = confirmado (va)
  - Gris = sin respuesta / pendiente
  - Rojo = no va
  - Por ahora todos muestran el color por defecto

---

## Archivos afectados

**T07 — Ya creados:**
- `src/pages/events/event-detail/EventDetailPage.tsx`
- `src/pages/events/event-detail/event-detail.scss`

**Rediseño + T10 — A modificar:**
- `src/pages/events/event-detail/EventDetailPage.tsx`
- `src/pages/events/event-detail/event-detail.scss`
- `src/components/members/MemberCard.tsx` — añadir `showRole?: boolean`

**Ya modificados en sesiones anteriores:**
- `src/routes/AppRoutes/AppRoutes.tsx` — ruta sin MainLayout
- `src/locales/es/events.json` — sección `detail`, `delete`
- `src/locales/ca/events.json` — sección `detail`, `delete`
- `src/ui-kit/button/Button.tsx` — props `to`, `className`; variantes nuevas
- `src/ui-kit/button/button.scss` — variantes nuevas
- `src/components/members/MemberCard.tsx` — `showChevron` añadido

---

## Lógica del componente

```
useParams → eventId
useAuthContext → profile (groupId, role), user (uid)
useGroupContext → group (members)
useEffect → getEventById(profile.groupId, eventId)

estados actuales:
  isLoading       → muestra Loading
  event === null  → redirige a /events (replace)
  event           → muestra contenido

estados a añadir (rediseño):
  showMenu        → boolean — abre/cierra dropdown ⋮
  showDeleteAlert → boolean — abre/cierra Alert de confirmación
  isDeleting      → boolean — loading durante deleteEvent
  deleteError     → string | null

canEdit = role === "admin" || (role === "organizer" && event.createdBy === userId)
eventStatus = getEventStatus(event)  // derivado, no de Firestore
```

---

## UI por rol (diseño actualizado)

| Sección | admin | organizer (propio) | organizer (ajeno) | member |
|---|---|---|---|---|
| Fondo degradado + datos evento | ✓ | ✓ | ✓ | ✓ |
| Badge de estado | ✓ | ✓ | ✓ | ✓ |
| Botón ⋮ con menú | ✓ | ✓ | ✗ | ✗ |
| Lista de asistentes con filtro | ✓ | ✓ | ✓ | ✗ |
| "¿Te vienes?" + botones Sí/No | ✗ | ✗ | ✗ | ✓ |

---

## Criterios de aceptación — T07 (completados)

- [x] Ruta `/events/:id` sin TopBar ni TabBar
- [x] Redirect a `/events` si el evento no existe
- [x] Muestra nombre, badge de estado, fecha/hora, lugar (condicional), descripción (condicional)
- [x] Día de la semana capitalizado según idioma
- [x] Admin y organizer ven sección de asistentes con contador y lista
- [x] Botones "Editar" y "Eliminar" visibles si `canEdit`
- [x] Miembro ve "¿Te vienes?" con botones Sí/No (sin lógica)
- [x] Estado loading mientras carga
- [x] Traducciones en `es` y `ca`

## Criterios de aceptación — Rediseño + T10 (pendientes)

- [ ] Zona superior (BackButton, título, badge, fecha, lugar, descripción) con fondo degradado `#FEFFEA → #CCF4F3`
- [ ] Zona de asistentes y botones del miembro sobre fondo blanco
- [ ] Botón ⋮ visible solo si `canEdit`, a la derecha del título
- [ ] Menú desplegable ⋮ con opciones Editar y Eliminar
- [ ] Editar del menú navega a `/events/:id/edit`
- [ ] Eliminar del menú abre `<Alert>` de confirmación
- [ ] Cancelar en el Alert no elimina nada
- [ ] Confirmar en el Alert llama a `deleteEvent`, loading, navega a `/events`
- [ ] Error de eliminación visible en pantalla si falla
- [ ] Sección de asistentes muestra todos los miembros del grupo
- [ ] Chip de filtro "Todos N ↓" visible (no funcional hasta T12)
- [ ] Cards de asistentes sin chip de rol ni flecha (`showRole={false}`, `showChevron={false}`)
- [ ] `MemberCard` acepta `showRole?: boolean`

---

## Pendiente — tareas futuras

### T12 · Votación y asistencia real
- Conectar botones Sí/No con Firestore (`setAttendance`)
- Cargar asistencia del usuario al montar
- Botón activo cambia variante: `going-yes-active` / `going-no-active`
- Cambiar badge del evento (admin/org) por badge de respuesta del miembro: "Confirmado" / "Sin respuesta" / "No voy"
- Poblar asistentes reales desde subcolección `attendances` filtrando `response === 'yes'` y cruzando con `group.members`
- Activar color del avatar según respuesta (azul/gris/rojo)
- Activar filtro de asistentes (Todos / Confirmados / No van / Sin respuesta)
- Bloquear botones si `event.confirmationDeadline` ha pasado

### T13 · Lista de asistentes
- Página `/events/:id/attendances` (solo admin y organizer)
- Tres secciones: Van / No van / Sin respuesta con contador por sección
- Gráfica circular (quesito) con porcentajes
- Link "Ver detalle de respuestas" desde el detalle del evento

### Deferred
- Soporte de foto en evento: cuando se añada `imageUrl` al modelo irá arriba de la zona de info
- "Votar por mis vinculados": definir si abre modal o navega a pantalla separada
