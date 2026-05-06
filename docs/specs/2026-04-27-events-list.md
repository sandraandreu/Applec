# Spec — Lista de eventos

**Fecha:** 27 abril 2026  
**Rama:** feature/events-list  
**Depende de:** refactor/components (reorganización de carpetas)

---

## Componentes y estructura

```
src/pages/events/events-list/
  EventsListPage.tsx

src/components/events/
  EventsList.tsx
  EventCard.tsx
  EventsFilter.tsx
  events.scss

src/locales/es/events.json   ← nuevo
src/locales/ca/events.json   ← nuevo
src/routes/AppRoutes/AppRoutes.tsx  ← añadir /events, redirigir /home → /events
```

---

## Modelo de datos

Sin cambios en Firestore. Modificaciones al modelo existente `FallesEvent`:
- **Eliminar** `cancelledAt` — los eventos se borran en duro (hard delete)
- **Añadir** `isSpecial?: boolean` — evento especial con fondo degradado azul

El campo `status` no se guarda en Firestore, se calcula con `getEventStatus()`.

---

## Lógica y servicio

- `getEvents(groupId)` del `event.service.ts` existente — devuelve todos los eventos del grupo
- Los eventos eliminados no aparecen (hard delete en Firestore)
- El filtrado es **client-side**: `EventsList` filtra los eventos recibidos según el filtro activo
- El pill del filtro muestra el nombre del filtro activo + el contador de eventos que coinciden

### Lógica de filtros

| Filtro | Rol | Condición |
|---|---|---|
| Todos | ambos | sin filtro |
| Activos | admin/org | `status === 'activo'` |
| Plazo cerrado | admin/org | `status === 'plazo-cerrado'` |
| Finalizados | admin/org | `status === 'finalizado'` |
| Próximos | member | `status === 'activo' \| 'plazo-cerrado'` |
| Pendientes de confirmar | member | `status === 'activo'` + sin respuesta de asistencia |
| Pasados | member | `status === 'finalizado'` |

---

## UI por rol

### Todos los roles
- Lista ordenada por fecha con loading, error y estado vacío
- Al pulsar una tarjeta → navega al detalle del evento

### Tarjeta de evento
- Lado izquierdo: bloque de fecha (día en azul bold + mes en gris)
- Centro: nombre del evento (bold) + lugar · hora (gris)
- Fondo degradado azul si `isSpecial === true`

### Member
- Sin botón de crear ni editar
- Si `requiresConfirmation === true`: indicador de asistencia a la derecha
  - Check azul → "Voy"
  - Punto naranja → Sin respuesta
  - Tarjeta entera en rojo con tachado → "No voy" (sin indicador derecho)
- Si `requiresConfirmation === false`: sin indicador
- Filtros: Todos · Próximos · Pendientes de confirmar · Pasados

### Admin
- Icono de editar (azul) en todas las tarjetas
- Filtros: Todos · Activos · Plazo cerrado · Finalizados

### Organizer
- Icono de editar (azul) solo en sus propios eventos (`createdBy === userId`)
- Mismos filtros que admin

---

## Traducciones

Namespace nuevo `events` en `es` y `ca`:

```json
{
  "events": {
    "title": "Eventos",
    "empty": "No hay eventos",
    "filters": {
      "all": "Todos",
      "active": "Activos",
      "deadline-closed": "Plazo cerrado",
      "finished": "Finalizados",
      "upcoming": "Próximos",
      "pending": "Pendientes de confirmar",
      "past": "Pasados"
    }
  }
}
```

---

## Criterios de aceptación

- [ ] Se elimina `cancelledAt` del modelo `FallesEvent`
- [ ] Se añade `isSpecial?: boolean` al modelo `FallesEvent`
- [ ] Ruta `/events` es la pantalla principal tras login/onboarding
- [ ] La ruta `/home` redirige a `/events`
- [ ] Carga todos los eventos del grupo con loading, error y estado vacío
- [ ] Las tarjetas muestran: fecha (día + mes), nombre, lugar · hora
- [ ] El evento con `isSpecial === true` muestra fondo degradado azul
- [ ] **Member**: indicador de asistencia si `requiresConfirmation === true`
- [ ] **Member**: sin indicador si `requiresConfirmation === false`
- [ ] **Admin**: icono editar en todas las tarjetas
- [ ] **Organizer**: icono editar solo en sus propios eventos (`createdBy === userId`)
- [ ] Filtro pill muestra nombre del filtro activo + contador
- [ ] Filtros admin/org: Todos · Activos · Plazo cerrado · Finalizados
- [ ] Filtros member: Todos · Próximos · Pendientes de confirmar · Pasados
- [ ] Traducciones en `es` y `ca` — namespace `events`
