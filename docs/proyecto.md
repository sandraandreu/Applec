# Falles App — Contexto del Proyecto

## Qué es

Plataforma digital privada para la gestión interna de eventos en comisiones falleras.

Sustituye WhatsApp y Google Forms por una herramienta centralizada donde organizar actos, gestionar confirmaciones de asistencia y administrar los miembros de la falla.

**Problema que resuelve:** La organización actual es caótica — los avisos se pierden entre mensajes, las confirmaciones son manuales y la información se mezcla con conversaciones sin relación.

**Propuesta de valor:** Claridad, simplicidad, confirmaciones formales e información estructurada en un solo sitio.

**A quién va dirigida:** Comisiones falleras — organizadores (presidenta, delegado de festejos) y miembros que necesitan consultar y confirmar participación.

**Diferenciación:** No pretende gestionar toda la falla (economía, chats, etc.). Solo resuelve la organización interna de eventos de forma simple.

---

## Equipo

Proyecto de máster — 2 personas:
- **Sandra** — desarrollo frontend (lógica, componentes, servicios, contexto, SCSS)
- **Inma** — diseño UX/UI en Figma + landing page externa + vídeo para la presentación

La presentación es ante empresas, por lo que el nivel de calidad y profesionalidad del producto debe ser alto.

## Fecha de presentación

**11 de junio de 2026.** El MVP debe estar completo y estable con margen suficiente para preparar la presentación. Habrá empresas presentes — el producto tiene que verse y funcionar de forma profesional.

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript (strict mode) |
| Estilos | SCSS |
| Formularios | react-hook-form |
| Routing | react-router-dom |
| i18n | react-i18next — Castellano `es` (por defecto) + Valenciano `ca` |
| Backend | Firebase Auth + Firestore + Storage |
| Mobile | Capacitor (iOS + Android — se convierte tras el build web) |
| Estado | React Context API |

---

## Arquitectura

### Convenciones de carpetas
- Carpetas: **kebab-case** (`forgot-password/`, `member-card/`)
- Archivos de componentes: **PascalCase** (`MemberCard.tsx`)
- Archivos SCSS: **kebab-case**, mismo nombre que la carpeta (`member-card.scss`)
- Componentes específicos de una página se **co-ubican** dentro de su carpeta de página
- Componentes reutilizables compartidos → `src/components/`
- Primitivas UI genéricas sin lógica de dominio → `src/ui-kit/`

### Patrones clave
- **Firebase:** `auth`, `db` y `storage` se exportan desde `src/plugins/firebase.ts`. Nunca instanciar localmente en otros archivos.
- **Servicios:** solo los métodos de lectura tienen try/catch y devuelven `null` en caso de error. Los métodos de escritura no tienen try/catch — el error sube al componente.
- **AuthContext:** expone `{ user, profile, isLoading, logout, refreshProfile }`. `profile` es `UserProfile | null`.
- **Modelos:** `UserProfile` en `src/models/user.model.ts`. `UserProfileCreate = Omit<UserProfile, 'groupId'>`. `FirebaseError` en `src/models/error.model.ts`.
- **Campo nombre:** siempre `username` (nunca `userName`) — se refactorizó y debe mantenerse.

---

## Modelos de datos (Firestore)

### UserProfile — `users/{uid}`
```ts
interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  photoUrl?: string;           // URL de Firebase Storage o externa
  createdAt: Date;
  role: "admin" | "organizer" | "member";
  groupId?: string;
  linkedMembers?: LinkedMember[];
}

interface LinkedMember {
  id: string;       // ID local generado, no uid de Firebase Auth
  firstName: string;
  lastName: string;
}
```

### Group — `groups/{groupId}`
Campos: `name`, `imageUrl?` (URL de Firebase Storage), `createdAt`, `adminId`, `inviteCode` (6 caracteres alfanuméricos, único y verificado)
Array `members`: `{ uid, username, firstName, lastName, email, role }`

### JoinRequest — `groups/{groupId}/joinRequests/{uid}`
```ts
interface JoinRequest {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  requestedAt: Date;
}
```
Existencia del documento = solicitud pendiente. Al aprobar: se añade al array `members` y se borra el documento. Al rechazar: se borra el documento.

### Event — `groups/{groupId}/events/{eventId}`
Campos obligatorios: `name`, `date`, `startTime`, `location`, `requiresConfirmation`, `sendReminder`, `createdBy`, `createdAt`, `groupId`
Campos opcionales: `description`, `endTime`, `confirmationDeadline`, `isSpecial`
El estado (`activo` | `plazo-cerrado` | `finalizado`) se deriva con `getEventStatus()` — no se almacena en Firestore.

### Attendance — `groups/{groupId}/events/{eventId}/attendances/{uid}`
```ts
interface Attendance {
  userId: string;
  eventId: string;
  response: "yes" | "no";
  confirmedAt: Date;
  linkedResponses?: { [linkedMemberId: string]: "yes" | "no" };
}
```
Ausencia de documento = miembro pendiente (sin respuesta). Ausencia de clave en `linkedResponses` = vinculado pendiente.

---

## Diseño (Figma)

El diseño final está completo en Figma y se está implementando en el código.

### Tipografía
- **Bricolage Grotesque ExtraBold** — títulos (h1: 40px, h2: 32px, h3: 24px)
- **Bricolage Grotesque SemiBold** — botones (20px)
- **General Sans Medium** — cuerpo, labels, subtítulos (16-18px)
- **General Sans Semibold** — links, metadatos (16px)
- Mínimo de fuente: 16px en toda la app

### Paleta y estética
- Paleta: azules, rosas/rojos, amarillos, verdes — tonos pastel y vivos
- Estética limpia y moderna con ilustraciones en estados vacíos y onboarding
- Mobile-only — app Capacitor para iOS y Android

### Colores principales
- Primary: `#0068FF` · Secondary: `#3772FF`
- Text: `#1A1A1A` / `#4C4C4C` / `#7D7D7D`
- Error: `#FF1C4E`
- Card border: `#D5D5D5` · Input border: `#7D7D7D`

### Navegación — Bottom navigation bar (5 ítems)
La barra inferior varía según el rol: admin/organizador tienen acceso completo, los miembros ven menos ítems.

| Icono | Página |
|---|---|
| Burbuja de chat | Feed *(futuro, plan premium)* |
| Carpeta/documento | *(por confirmar)* |
| Calendario | Eventos |
| Dos personas | Miembros |
| Persona | Perfil |

El menú de miembros tiene menos ítems que el de admin/organizadores (las páginas de gestión no aplican).

### Pantallas de la app

**Lista de eventos** (`/events`) ✓ Implementado
- Lista de eventos del grupo con fecha, nombre, lugar y hora
- Filtros diferenciados por rol: admin/org ven Activos · Plazo cerrado · Finalizados; miembro ve Próximos · Pendientes de confirmar · Pasados
- Tarjeta con fondo degradado azul si `isSpecial === true`
- Icono de editar en tarjetas (admin: todas; organizer: solo las propias)

**Detalle de evento** (`/events/:id`) ✓ Implementado
- Zona superior con fondo degradado, nombre, badge de estado, fecha, lugar, descripción
- Menú ⋮ con opciones Editar y Eliminar (solo si `canEdit`)
- Admin y organizador: sección de asistentes con contador y filtros
- Miembro: botones Sí/No de confirmación + vinculados debajo

**Crear/editar evento** (`/events/create`, `/events/:id/edit`) ✓ Implementado
- Flujo de 3 pasos: tipo + nombre + descripción / fecha + hora + lugar / confirmación + recordatorio

**Miembros** (`/members`, `/members/:uid`) ✓ Implementado
- Búsqueda + filtros por rol (Todos · Admin · Organizadores · Miembros)
- Lista con avatar, nombre y username
- Al pulsar un miembro → página de detalle (`/members/:uid`): zona de perfil con degradado por rol, miembros vinculados, cambio de rol y eliminación del miembro

**Calendario** (`/calendar`) ✗ Pendiente — spec en `docs/specs/events-calendar.md`
- Vista mensual con FullCalendar
- Días con eventos marcados con punto azul
- Al seleccionar un día: lista de eventos del día con `EventCard`
- Navegación por meses; semana empieza en lunes

**Perfil** (`/profile`) ✗ Pendiente
- Avatar circular + nombre completo + badge de rol
- Sección "Mi cuenta": Editar perfil · Mis vinculados · Notificaciones · Idioma
- Sección "Mi falla": Compartir acceso · Configuración del grupo · Cerrar sesión

**Feed** (`/feed`) ✗ Pendiente — pantalla con datos hardcodeados para la presentación
- Publicaciones del grupo con avatar, nombre, fecha y texto
- Sin backend real; datos de demo

**Notificaciones** (`/notifications`) ✗ Pendiente — pantalla con datos hardcodeados para la presentación
- Lista de notificaciones del grupo (eventos nuevos, confirmaciones, cambios de rol)
- Sin backend real; datos de demo

La conexión con Figma se hace via Figma Console MCP (CDP mode): lanzar Figma con `--remote-debugging-port=9222`.

---

## Traducciones (i18n)

**Ubicación:** `src/locales/{lang}/{namespace}.json`
**Idiomas:** `es` (castellano, por defecto) · `ca` (valenciano)

**Namespaces:**
| Archivo | Contenido |
|---|---|
| `common.json` | Botones, campos, errores genéricos, textos globales |
| `auth.json` | Register, login, forgot password |
| `groups.json` | Crear grupo, unirse, invitar |
| `members.json` | Lista de miembros, roles, búsqueda |
| `onboarding.json` | Landing, welcome, language, group choice |
| `events.json` | Eventos, estados, filtros, asistencia, formularios |

**Uso de claves:** `namespace:seccion.clave`, ej. `members:members.title`, `common:buttons.close`

**Regla:** siempre añadir la traducción en **ambos idiomas** (`es` y `ca`) al mismo tiempo.

---

## Competencia analizada

| App | Por qué no cubre la necesidad |
|---|---|
| Komissió | Completa pero compleja, incluye economía y más |
| falles.app | Solución amplia, no centrada solo en eventos |
| Fallas 2025 | Para el público general, no para organización interna |
| FallasBot | Asistente informativo en WhatsApp, no gestiona eventos |

**Oportunidad:** ninguna herramienta está centrada exclusivamente en organización interna de eventos de forma simple.

---

## Pendientes de calidad (post-auditoría 21/04/2026)

Elementos identificados en la auditoría `docs/AUDITORIA_CALIDAD_WEB.md` que han quedado pendientes o con solución provisional:

- **Contraste botón secundario** — `#0068ff` sobre `#cce1ff` no supera WCAG AA (3.56:1). Pendiente decisión de diseño con Inma sobre el fondo de la landing o alternativa de paleta.
- **Ilustraciones PNG → SVG** — Las ilustraciones de onboarding y landing están en PNG. Inma debe exportarlas en SVG desde Figma para que escalen correctamente en pantallas 2x/3x.
- **Font fallback CLS** — Se han añadido `@font-face` fallback con `size-adjust` para reducir el CLS de las fuentes externas. Los valores son aproximados y pueden necesitar ajuste fino una vez se verifique visualmente en dispositivo real.

Ver herramientas y referencias completas en `docs/recursos-calidad.md`.
