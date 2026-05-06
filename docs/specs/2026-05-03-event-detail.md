# Spec — Pantalla de detalle de evento

**Fecha:** 2026-05-03  
**Última actualización:** 2026-05-04  
**Tarea plan:** T07 ✅ completado  
**Rama:** feature/events  
**Estimación original:** 3h

---

## Contexto

Pantalla completa que se abre al pulsar un evento en la lista (`/events`). Muestra todos los datos del evento y acciones según el rol. La confirmación de asistencia es visual en T07 — la lógica de Firestore se conecta en T12.

---

## Archivos creados / modificados

**Creados:**
- `src/pages/events/event-detail/EventDetailPage.tsx`
- `src/pages/events/event-detail/event-detail.scss`
- `src/ui-kit/icons/back-button.scss`

**Modificados:**
- `src/routes/AppRoutes/AppRoutes.tsx` — ruta `/events/:id` añadida
- `src/locales/es/events.json` — sección `detail`
- `src/locales/ca/events.json` — sección `detail`
- `src/ui-kit/button/Button.tsx` — props `to`, `className`; 6 variantes nuevas
- `src/ui-kit/button/button.scss` — variantes nuevas; base actualizada
- `src/ui-kit/icons/BackButton.tsx` — añadido import de `back-button.scss`
- `src/scss/variables/_custom-properties.scss` — `--gap-groups` renombrado a `--gap-content`
- `src/components/members/members.scss` — actualizado a `--gap-content`
- `src/pages/style-guide/StyleGuide.tsx` — sección Button actualizada

> No se creó `EventDetail.tsx` separado — toda la lógica y JSX van en `EventDetailPage.tsx`.

---

## Decisiones tomadas

- **Button component extendido:** se añadieron los props `to?: string` (renderiza como `<Link>` de React Router), `className?: string`, y 6 nuevas variantes: `especial`, `danger`, `going-no-active`, `going-yes`, `going-yes-active`, `linked`.
- **SVGs con `currentColor`:** todos los iconos dentro de botones usan `stroke="currentColor"` / `fill="currentColor"` para heredar el color del texto del variante.
- **Botón linked:** borde discontinuo (`dashed`) + `border-radius: var(--radius-card)` (no pill).
- **`canEdit`:** `role === "admin" || (role === "organizer" && event.createdBy === userId)`
- **Sin foto por ahora:** el modelo `FallesEvent` no tiene `imageUrl` todavía. Cuando se añada irá arriba del `__content` y el resto mantendrá el mismo layout.

---

## Modelo de datos

Sin cambios en Firestore. Usa `getEventById(groupId, eventId)` del servicio existente.  
La colección `attendances` y su servicio se crean en T11.

---

## Lógica de la page

```
useParams → eventId
useAuthContext → profile (groupId, role, uid)
useEffect → getEventById(profile.groupId, eventId)

estados:
  isLoading → muestra Loading
  event === null → redirige a /events (replace)
  event → muestra contenido
```

```ts
canEdit = role === "admin" || (role === "organizer" && event.createdBy === userId)
```

---

## UI por rol

| Sección | admin | organizer (propio) | organizer (ajeno) | member |
|---|---|---|---|---|
| Nombre del evento | ✓ | ✓ | ✓ | ✓ |
| Fecha y hora | ✓ | ✓ | ✓ | ✓ |
| Lugar | ✓ | ✓ | ✓ | ✓ |
| Descripción (si existe) | ✓ | ✓ | ✓ | ✓ |
| Link "Ver asistentes" | ✓ | ✓ | ✓ | ✗ |
| Botón "Editar evento" | ✓ | ✓ | ✗ | ✗ |
| Botón "Eliminar evento" | ✓ | ✓ | ✗ | ✗ |
| "¿Te vienes?" + botones | ✗ | ✗ | ✗ | ✓ (visual) |
| "Votar por mis vinculados" | ✗ | ✗ | ✗ | ✓ (disabled) |
| Botón "Guardar" | ✗ | ✗ | ✗ | ✓ (visual) |

---

## Criterios de aceptación — T07

- [x] Ruta `/events/:id` muestra el detalle del evento
- [x] Si el evento no existe o hay error → redirige a `/events`
- [x] Muestra nombre, fecha/hora, lugar para todos los roles
- [x] Muestra descripción solo si el evento la tiene
- [x] Admin y organizadores ven link "Ver asistentes" (ruta futura T13)
- [x] Botones "Editar" y "Eliminar" visibles solo si `canEdit`
- [x] Miembro ve "¿Te vienes?" con botones Sí/No (sin lógica de guardado)
- [x] Miembro ve "Votar por mis vinculados" deshabilitado
- [x] Botón "Guardar" visible para miembro pero sin funcionalidad
- [x] Estado loading mientras carga el evento
- [x] Todas las cadenas traducidas en `es` y `ca`

---

## Pendiente — tareas futuras

### T08 · Crear evento
- Página `/events/create` con formulario completo
- Solo admin y organizer
- Campos: nombre, fecha, hora, lugar, descripción, `requiresConfirmation`, `sendReminder`
- Validaciones: fecha no pasada, deadline ≤ fecha evento
- Al crear → navega al detalle del nuevo evento

### T09 · Editar evento
- Página `/events/:id/edit`
- Solo `canEdit` puede acceder (guard de ruta o redirect en useEffect)
- Formulario pre-rellenado con datos actuales
- Mismas validaciones que T08
- Al guardar → vuelve al detalle con datos actualizados

### T10 · Eliminar evento
- Lógica en `EventDetailPage` (botón ya existe visualmente)
- Mostrar `<Alert>` de confirmación antes de eliminar
- Al confirmar → `deleteEvent(groupId, eventId)` + navegar a `/events`
- El servicio `deleteEvent` elimina el evento y todas sus asistencias en batch

### T11 · Modelo y servicio de asistencia
- Nueva colección Firestore: `groups/{groupId}/events/{eventId}/attendances`
- Documento por usuario: `{ userId, response: "yes" | "no" | null, updatedAt }`
- Métodos: `getAttendance(groupId, eventId, userId)`, `setAttendance(...)`, `getAttendances(...)`

### T12 · Votación — conectar botones Sí/No y Guardar
- En `EventDetailPage`: cargar la asistencia del usuario al montar
- Botones Sí/No cambian el estado local (`selectedResponse`)
- El estado seleccionado cambia el variante del botón (`going-yes-active` / `going-no-active`)
- "Votar por mis vinculados" → navega o abre modal (pendiente de definir)
- Botón "Guardar" llama a `setAttendance(...)` y actualiza el estado

### T13 · Lista de asistentes
- Página `/events/:id/attendances` (solo admin y organizer)
- Lista agrupada: van / no van / sin respuesta
- Usa `MemberCard` existente
- El link "Ver asistentes" de `EventDetailPage` ya apunta a esta ruta

### Deferred (fuera del MVP o sin definir)
- Soporte de foto en evento: cuando se añada `imageUrl` al modelo, irá arriba del `__content`
- "Votar por mis vinculados": definir si abre modal o navega a pantalla separada
