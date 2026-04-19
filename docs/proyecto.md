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
- **Sandra** — desarrollo frontend (lógica, componentes, servicios, contexto) + implementación de CSS/estilos
- **Inma** — diseño UX/UI en Figma + implementación de CSS/estilos

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
| Backend | Firebase Auth + Firestore |
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
- **Firebase:** `auth` y `db` se exportan desde `src/plugins/firebase.ts`. Nunca instanciar localmente en otros archivos.
- **Servicios:** todos los métodos tienen try/catch. Los métodos de lectura devuelven `null` en caso de error; los de escritura re-lanzan el error.
- **AuthContext:** expone `{ user, profile, isLoading, logout }`. `profile` es `UserProfile | null`.
- **Modelos:** `UserProfile` en `src/models/user.model.ts`. `UserProfileCreate = Omit<UserProfile, 'groupId'>`.
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
  createdAt: Date;
  role: "admin" | "organizer" | "member";
  groupId?: string;
}
```

### Group — `groups/{groupId}`
Campos: `name`, `description`, `createdAt`, `adminUid`, `inviteCode`
Array `members`: `{ uid, username, firstName, lastName, email, role }`

### Event — `groups/{groupId}/events/{eventId}` *(pendiente)*
Campos obligatorios: `name`, `date`, `time`, `confirmationDeadline`
Campos opcionales: `location`, `description`
Otros: `status` (`active` | `deadline-closed` | `finished` | `cancelled`), `createdBy`

### Attendance — `groups/{groupId}/events/{eventId}/attendances/{uid}` *(pendiente)*
Campos: `userId`, `eventId`, `response` (`yes` | `no`), `confirmedAt`

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

### Pantallas identificadas en el diseño

**Eventos** (`/home` o `/events`)
- Lista de eventos con fecha, nombre, lugar y hora
- Filtros: Todos · Confirmados · Pendientes

**Miembros** (`/members`)
- Búsqueda + filtros por rol (Todos · Administradores · Organizadores · Miembros... [ajustado por rol del usuario])
- Lista agrupada por rol con avatar, nombre y username
- Al pulsar un miembro → modal de acciones: Ver perfil / Hacer Organizador / Eliminar miembro + botones Guardar cambios / Cerrar

**Perfil** (`/profile`)
- Avatar, nombre completo, badge de rol
- Sección "Mi cuenta": Editar perfil · Mis vinculados · Notificaciones · Idioma
- Sección "Mi falla": Compartir acceso · Configuración del grupo · Cerrar sesión

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
