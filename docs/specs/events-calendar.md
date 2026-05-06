# Spec — Vista de Calendario (T06)

**Ruta:** `/events/calendar`

---

## Librería: FullCalendar

**Paquetes:**
```bash
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
```

**Por qué FullCalendar:**
- Soporte nativo para React con componente `<FullCalendar />`
- Localización integrada para `es` y `ca` — se sincroniza con i18next
- Vista `dayGridMonth` lista para usar con configuración mínima
- Permite deshabilitar la cabecera por defecto y construir una custom
- Permite personalizar el contenido de cada celda de día (`dayCellContent`)
- Licencia open source (MIT para los paquetes que usamos)

**Configuración principal:**
| Prop | Valor | Motivo |
|---|---|---|
| `initialView` | `'dayGridMonth'` | Vista mensual |
| `headerToolbar` | `false` | Usamos cabecera custom |
| `firstDay` | `1` | Semana empieza en lunes |
| `locale` | `es` o `ca` según i18next | Localización automática |
| `dayCellContent` | función custom | Añadir punto azul en días con eventos |
| `dateClick` | función custom | Seleccionar día |
| `events` | array vacío | Solo usamos FullCalendar para el grid, no para renderizar eventos |

---

## Layout

1. TopBar (ya existe) — con botón + y campana
2. Título "Calendario"
3. Bloque calendario — tarjeta blanca con bordes redondeados
4. Sección día seleccionado — debajo del bloque calendario

---

## Bloque calendario

### Cabecera de navegación (custom)
- Flecha izquierda (círculo azul) → mes anterior
- Texto central: "Mes YYYY" (ej. "Marzo 2026")
- Flecha derecha (círculo azul) → mes siguiente

### Grid
- Empieza en lunes (`firstDay: 1`)
- Cabecera de días: L M X J V S D (formato `narrow`)
- Domingos: número en rojo
- Día de hoy: círculo azul relleno
- Día seleccionado: círculo azul relleno (mismo estilo que hoy)
- Días con eventos: punto azul debajo del número (también en días de otros meses si tienen eventos)
- Días de otros meses: visibles en gris; al pulsar uno navega a ese mes y lo selecciona
- Días sin eventos del mes actual: seleccionables (muestran estado vacío)

---

## Sección día seleccionado

### Cabecera
- Izquierda: día y fecha en mayúsculas y negrita — formato `{ weekday: 'short', day: 'numeric', month: 'long' }` con el idioma activo de i18next (ej. "MIÉ 12 de marzo" en es, "DIM 12 de març" en ca)
- Derecha: enlace "Ver todos" → navega a `/events` — siempre visible independientemente de si hay eventos

### Lista de eventos del día
- Reutiliza `EventCard` con los eventos cuya fecha coincide con `selectedDate`
- Si no hay eventos: mensaje "Todavía no hay eventos para este día"
- Si no hay eventos + rol admin u organizer: botón "Crear evento" → navega a `/events/create`

---

## Estado de la página

| Estado | Qué se muestra |
|---|---|
| Loading | Spinner mientras carga `getEvents` |
| Error | Mensaje de error con icono |
| Día seleccionado sin eventos | Mensaje vacío (+ botón crear si admin/org) |
| Día seleccionado con eventos | Lista de EventCards |

---

## Datos

- Se llama a `getEvents(groupId)` una vez al montar la página
- Los eventos se agrupan por fecha (clave `YYYY-MM-DD`) para marcar los puntos
- `selectedDate` arranca con la fecha de hoy
- Al navegar al mes siguiente o anterior, `selectedDate` se resetea al día 1 del nuevo mes
- Al pulsar un día de otro mes, se navega a ese mes y se selecciona ese día
- Al cambiar de mes no se vuelve a llamar a Firebase — todos los eventos ya están en memoria

---

## Archivos

- Crear: `src/pages/events/events-calendar/EventsCalendarPage.tsx`
- Crear: `src/pages/events/events-calendar/events-calendar.scss`
- Modificar: `src/routes/AppRoutes/AppRoutes.tsx`
