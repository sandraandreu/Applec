# Code Quality Audit — Falles App

**Fecha:** 2026-05-21
**Rama analizada:** `feature/linked-members`
**Última revisión:** 2026-05-21 — correcciones aplicadas en rama `fix/code-quality-audit`

---

## 1. Calidad de código

### TypeScript

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`src/pages/auth/forgot-password/ForgotPasswordPage.tsx:45`~~ | ~~🟠 alto~~ | ~~`as FirebaseError` sin type guard~~ | ✅ Resuelto — usa `isFirebaseError(error)` |
| ~~`src/pages/groups/join-group/JoinGroupPage.tsx:8`~~ | ~~🟠 alto~~ | ~~Importación directa de `FirebaseError` de `firebase/app`~~ | ✅ Resuelto — usa `isFirebaseError(error)` |
| ~~`src/models/error.model.ts:1–4`~~ | ~~🟡 medio~~ | ~~`interface FirebaseError` duplicada con campos opcionales~~ | ✅ Resuelto — archivo eliminado |
| `src/components/event-calendar/EventCalendar.tsx:42`, `src/components/layout/MainLayout.tsx:7` | 🟡 medio | Interfaz genérica `Props` en lugar de `EventCalendarProps` / `MainLayoutProps` | Renombrar a nombre semántico |
| `src/ui-kit/input/Input.tsx:48` | 🟡 medio | Cast `as React.TextareaHTMLAttributes<HTMLTextAreaElement>` para `UseFormRegisterReturn` — pierde type-safety en el `ref` | Extraer props explícitamente (`onChange`, `onBlur`, `name`) o separar la sobrecarga multiline |
| `src/ui-kit/input/Input.tsx:9` | 🟡 medio | `type?: string` acepta cualquier cadena | Cambiar a `"text" \| "email" \| "password" \| "search" \| "number" \| "tel"` |
| `src/components/events/EventCard.tsx:11` | 🟢 mejora | `type AttendanceResponse = "yes" \| "no" \| null` reimplementado localmente cuando ya existe en `attendance.model.ts` | Usar `AttendanceResponse \| null` importando del modelo |
| `src/components/members/MembersList.tsx:17` | 🟢 mejora | `type MemberRole = typeof ROLE_ORDER[number]` duplica `UserProfile["role"]` | Cambiar a `type MemberRole = UserProfile["role"]` |

---

### Convenciones de nombres

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`EditEventPage.tsx:349`~~ | ~~🟡 medio~~ | ~~Parámetro `e` prohibido~~ | ✅ Resuelto — renombrado a `changeEvent` |
| ~~`LoginPage.tsx:28` y otros (12 archivos)~~ | ~~🟡 medio~~ | ~~`{ t: tc }` prohibido~~ | ✅ Resuelto — renombrado a `tCommon` en todo el proyecto |
| ~~`LinkedMembersPage.tsx` y otros~~ | ~~🟡 medio~~ | ~~Iterador `lm` prohibido~~ | ✅ Resuelto — renombrado a `linkedMember` |
| ~~`GroupContextProvider.tsx` y otros~~ | ~~🟡 medio~~ | ~~Iterador `m` prohibido~~ | ✅ Resuelto — renombrado a `member` |
| ~~`MembersList.tsx:33`~~ | ~~🟡 medio~~ | ~~Acumulador `acc` prohibido~~ | ✅ Resuelto — renombrado a `grouped` |
| `SeedPage.tsx:346` | 🟡 medio | Iterador `d` sobre `eventsSnap.docs` | Renombrar a `eventDoc` |

---

### Código muerto y duplicación

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `src/pages/events/event-detail/vote-sheet/VoteSheet.tsx:99–160` | 🔴 crítico | Botones de voto con `aria-pressed` hardcodeados (`false`/`true`) y botón "Guardar" sin `onClick` — la UI es una maqueta estática que se presenta como funcional | Implementar estado de voto reactivo o marcar explícitamente como UI pendiente |
| `src/pages/groups/join-group/JoinGroupPage.tsx:73–101` | 🔴 crítico | `handleSendRequest` muestra pantalla de "solicitud enviada" pero `handleConfirmJoin` hace la unión directa sin pasar por flujo de aprobación — dato incorrecto en Firestore | Documentar claramente el estado temporal o corregir el flujo antes de producción |
| `src/pages/notifications/NotificationsPage.tsx:33–104` | 🟠 alto | Arrays de notificaciones estáticos con claves de i18n que no existen; `JoinRequestsPage` con 4 usuarios ficticios hardcodeados | Marcar con `// DEMO DATA` o conectar a Firestore |
| `src/pages/home/Home.tsx` | 🟠 alto | Página vestigial con `t("bienvenida")` sin namespace, botón logout sin i18n correcto — scaffold inicial nunca actualizado | Eliminar si no está en rutas activas o actualizar a convenciones del proyecto |
| `src/pages/seed/SeedPage.tsx:304,393` | 🟠 alto | `console.error` en el catch — viola el patrón del proyecto | Eliminar `console.error` y reflejar el error en el estado |
| `CreateEventStep3Page.tsx:71–78` + `EditEventPage.tsx:84–91` | 🟠 alto | Bloque de 5 líneas para combinar fecha+hora copiado literalmente en dos lugares | Extraer a `combineDateAndTime(date, time): Date` en `src/utils/` |
| `EventDetailPage.tsx:124`, `EventCard.tsx:32–35`, `CreateEventStep3Page.tsx:50`, `EditEventPage.tsx:30` | 🟠 alto | Ternario de resolución de locale (`i18n.language === "ca" ? ... : ...`) repetido 4+ veces | Crear `getDateLocale(language)` y `getLocaleString(language)` en `src/utils/` |
| `LoginPage.tsx:113`, `RegisterPage.tsx:186`, `ForgotPasswordPage.tsx:87` | 🟡 medio | Email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` definida 3 veces | Centralizar en `src/utils/validation.ts` como `EMAIL_PATTERN` |
| `EventDetailPage.tsx:132` | 🟡 medio | `const ATTENDEES_PREVIEW = 4` hardcodeada dentro del componente | Moverla a nivel de módulo o a un archivo de constantes |
| `CreateGroupPage.tsx:20` | 🟡 medio | `MAX_IMAGE_SIZE = 5 * 1024 * 1024` sin contexto del origen del límite | Mover a configuración con comentario |
| `TopBar.tsx:23` | 🟡 medio | `style={{ maskType: "luminance" }}` inline en SVG — viola la regla de no inline styles | Mover a clase SCSS (o documentar como excepción SVG/React válida) |
| `EventDetailPage.tsx:139–144` | 🟢 mejora | `filterToAttendance` función pura redefinida en cada render | Moverla fuera del componente |

---

### Componentes React

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `MemberCard.tsx:36` | 🟠 alto | `<div onClick>` con `role="button"` sin `tabIndex={0}` ni manejo de Enter/Space — no accesible con teclado | Cambiar a `<button type="button">` cuando hay interacción |
| `EventsFilter.tsx` | 🟠 alto | Dropdown se abre pero no hay cierre al tocar fuera — el usuario puede quedar atrapado en mobile | Añadir `useRef` + event listener `onClickOutside` o overlay invisible |
| `LanguageSelector.tsx:13–18` | 🟠 alto | `useEffect` con `[]` vacío e `i18n` no en dependencias | Verificar si `i18n` ya maneja la persistencia; si no, añadir `i18n` como dependencia |
| `GroupContextProvider.tsx:22–43` | 🟠 alto | `loadGroup` sin flag `isMounted` — riesgo de actualizar estado tras desmontaje (violación del patrón del proyecto) | Añadir `isMounted` flag como en el patrón requerido |
| `EventDetailPage.tsx` (439 líneas) | 🟡 medio | Componente demasiado grande — mezcla carga de datos, filtrado, renderizado del menú, sección de asistentes y VoteSheet | Extraer `AttendeesList` como subcomponente co-ubicado |
| `EditEventPage.tsx:128–143` | 🟡 medio | IIFE para calcular `isReducerModified` — poco idiomático en React y se recalcula en cada render | Extraer como `computeIsModified(state, event)` fuera del componente o usar `useMemo` |
| `EventsListPage.tsx:37–41` | 🟡 medio | `useEffect` con `[]` vacío pero accede a `showEventUpdated` sin documentar la omisión intencional | Añadir `// eslint-disable-next-line react-hooks/exhaustive-deps` con comentario explicativo |
| `Avatar.tsx`, `Chip.tsx`, `Loading.tsx` | 🟢 mejora | Componentes puros renderizados en listas sin `React.memo` | Exportar con `export default memo(...)` |

---

### Hooks y estado

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `ForgotPasswordPage.tsx:23–27` | 🟠 alto | Formulario auth con flujo idle→loading→success/error usando `useState` individual — es el único formulario de auth sin `useReducer` | Crear `forgot-password.reducer.ts` con acciones `SUBMIT_START`, `SUBMIT_SUCCESS`, `ERROR_CONNECTION`, `DISMISS_SUCCESS` |
| `VerifyEmailPage.tsx:23–24` | 🟠 alto | `isLoading` y `resendSuccess` cambian coordinados en `handleResend` pero son `useState` separados | Agrupar en `useState({ isLoading: false, success: false })` o crear pequeño reducer |
| `JoinGroupPage.tsx:31–38` | 🟡 medio | 5 `useState` forman un flujo multi-paso con transiciones coordinadas | Crear `join-group.reducer.ts` con estados `"idle"`, `"searching"`, `"found"`, `"requesting"`, `"sent"`, `"error"` |
| `EventDetailPage.tsx:33–43` | 🟡 medio | `event`, `memberResponses`, `linkedResponses`, `isLoading` siempre cambian juntos en la misma Promise | Extraer estados de carga a `useReducer` con `LOAD_START`/`LOAD_SUCCESS`/`LOAD_ERROR` |
| `MemberDetailPage.tsx:31–34` | 🟡 medio | `isSaving`, `saveError`, `isDeleting`, `deleteError` como `useState` separados | Agrupar en `saveState = { isLoading, error }` y `deleteState = { isLoading, error }` como en el resto del proyecto |
| `CreateGroupPage.tsx:33–34` | 🟡 medio | `isLoading` y `errorConnection` como `useState` separados | Agrupar en objeto `submitState = { isLoading, error }` |
| `EditEventPage.tsx:37–38` | 🟡 medio | `deleteState` como `useState` separado del reducer existente | Añadir `DELETE_START`/`DELETE_ERROR`/`DISMISS_DELETE` al `editEventReducer` |

---

## 2. Arquitectura y patrones

### Servicios Firebase

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`linked-member.service.ts:12–31`~~ | ~~🟠 alto~~ | ~~`addLinkedMember` hace `addDoc` + `updateDoc` sin transacción~~ | ✅ Resuelto — usa `writeBatch` |
| `group.service.ts:55–82` | 🟠 alto | `createGroup` llama a `getDocs` internamente (lectura sin try/catch) dentro de una función de escritura | Extraer la verificación de unicidad a una función de lectura separada con try/catch |
| `group.service.ts:102–123` | 🟠 alto | `updateMemberRole` y `removeMemberFromGroup` ejecutan `getDoc` interno sin proteger | Separar el `getDoc` en método de lectura dedicado con try/catch |
| `GroupContextProvider.tsx:38` | 🟡 medio | `.catch(() => undefined)` silencia completamente un error de sincronización de rol | Eliminar el swallow o manejar el error en el provider |
| `group.service.ts:45–48` | 🟡 medio | `uploadGroupImage` mezcla storage con `getDownloadURL` sin distinción de errores | Documentar como deuda técnica o separar en dos operaciones |

---

### Routing

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`AppRoutes.tsx:270`~~ | ~~🟠 alto~~ | ~~`/style-guide` accesible sin autenticación~~ | ✅ Resuelto — guardada con `NODE_ENV !== 'production'` |
| ~~`AppRoutes.tsx:274–279`~~ | ~~🟠 alto~~ | ~~`/seed` accesible en producción~~ | ✅ Resuelto — guardada con `NODE_ENV !== 'production'` |
| `PrivateRoutes.tsx:21` | 🟡 medio | Rutas con `requiresNoGroup` no esperan a que `groupLoading` termine — guard puede dar falso positivo durante carga | Cambiar a `authLoading \|\| ((requiresGroup \|\| requiresNoGroup) && groupLoading)` |
| ~~`PrivateRoutes.tsx:23`~~ | ~~🟡 medio~~ | ~~Usuario con email sin verificar redirigido a `/landing`~~ | ✅ Resuelto — distingue `!user` (→ `/landing`) de `!emailVerified` (→ `/verify-email`) |
| `AppRoutes.tsx:64` | 🟢 mejora | Redirect raíz `/` → `/landing` siempre, incluso para usuarios autenticados — doble redirect innecesario | Convertir en redirect inteligente según estado de auth/grupo |

---

### Context

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`GroupContextProvider.tsx:22–55`~~ | ~~🟠 alto~~ | ~~`useEffect` async sin flag `isMounted`~~ | ✅ Resuelto — añadido `isMountedRef` con cleanup |
| ~~`AuthContextProvider.tsx:40–57`~~ | ~~🟠 alto~~ | ~~Callback async sin flag `isMounted`~~ | ✅ Resuelto — añadido `isMounted` con cleanup |
| `GroupContextProvider.tsx:22–43` | 🟡 medio | `loadGroup` depende del objeto `profile` completo — cualquier cambio en el perfil re-ejecuta la carga | Usar solo `profile?.groupId` y `profile?.role` como dependencias |
| `AuthContext.ts:9` | 🟢 mejora | Interfaz declara `logout: () => void` pero la implementación devuelve `Promise<void>` | Cambiar a `logout: () => Promise<void>` |
| `GroupContext.ts:17` | 🟢 mejora | `GroupContextType` no expone `error: string \| null` — imposible distinguir "sin grupo" de "error al cargar" | Añadir campo `error: string \| null` |

---

## 3. SCSS / Estilos

### BEM

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`empty-state.scss:26–42`, `error-boundary.scss:10–27`~~ | ~~🟠 alto~~ | ~~Elementos BEM definidos como clases de nivel superior~~ | ✅ Resuelto — anidados con `&__` dentro del bloque |
| `_typography.scss:33` | 🟡 medio | `.h1--large` mezcla nombre de etiqueta HTML con modificador BEM | Renombrar a `.display-title` o clase semántica equivalente |
| `style-guide.scss:113–148` | 🟡 medio | `&__type-button` (elemento) vs `&__type--bold` (modificador sin elemento base) — inconsistencia interna | Añadir `.style-guide__type` como elemento base y aplicar modificadores sobre él |
| `stepper.scss:12–18` | 🟢 mejora | `&__dot--active` definido dos veces — redundancia | Mantener solo una definición dentro de `&__dot--active` |

---

### Estructura y valores

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| ~~`src/scss/base/_reset.scss:32`~~ | ~~🔴 crítico~~ | ~~`cursor: pointer` en reset global~~ | ⏭️ Descartado — app mobile, no aplica |
| ~~`vote-sheet.scss` (20+ líneas)~~ | ~~🔴 crítico~~ | ~~Colores hex directos sin tokens~~ | ✅ Resuelto — todos reemplazados por tokens semánticos |
| ~~`members.scss:12,17,83`~~ | ~~🟠 alto~~ | ~~`#666666` y `#9ca3af` hardcodeados~~ | ✅ Resuelto — `var(--color-icon)` y `var(--color-text-muted)` |
| ~~`members-list.scss:39,41`~~ | ~~🟠 alto~~ | ~~`#d1d5db` y `#555` hardcodeados~~ | ✅ Resuelto — `var(--color-border)` y `var(--color-text-secondary)` |
| ~~`create-group.scss:45`, `join-group.scss:135`~~ | ~~🟠 alto~~ | ~~`#666666` y `#0068FF` hardcodeados~~ | ✅ Resuelto — `var(--color-icon)` y `var(--color-brand)` |
| ~~`event-detail.scss:66`~~ | ~~🟠 alto~~ | ~~`background: white` hardcodeado~~ | ✅ Resuelto — `var(--color-surface)` |
| ~~`edit-event.scss:95`~~ | ~~🟠 alto~~ | ~~`box-shadow` hardcodeado~~ | ✅ Resuelto — `var(--shadow-card)` |
| ~~`vote-sheet.scss:170`~~ | ~~🟠 alto~~ | ~~`font-size: 18px` hardcodeado~~ | ✅ Resuelto — `var(--font-size-body-m)` |
| `avatar.scss:25` | 🟠 alto | `font-size: 28px` hardcodeado sin token equivalente | Crear `--size-28: 28px` o usar `var(--size-24)` si el diseño lo permite |
| ~~`vote-sheet.scss` (múltiples)~~ | ~~🟡 medio~~ | ~~Padding y border-radius con valores directos~~ | ✅ Resuelto — todos reemplazados por `var(--size-XX)`, `var(--radius-*)` |
| `create-event.scss:278`, `edit-event.scss:158` | 🟡 medio | `padding: 20px var(--gap-content)` — valor `20px` hardcodeado | `→ var(--size-20) var(--gap-content)` |
| ~~`modal.scss:28`, `vote-sheet.scss:23`~~ | ~~🟡 medio~~ | ~~`border-radius: 20px 20px 0 0` sin token compartido~~ | ✅ Resuelto — creado token `--radius-sheet` |
| ~~`members.scss:47–49`~~ | ~~🟡 medio~~ | ~~`padding: 4px 12px; margin-top: 6px` hardcodeados~~ | ✅ Resuelto — `var(--size-4)`, `var(--size-12)`, `var(--size-6)` |
| ~~`event-detail.scss:11`~~ | ~~🟡 medio~~ | ~~`rgba(255,255,255,0.6)` sin token~~ | ✅ Resuelto — `var(--color-overlay-white-soft)` |
| `_typography.scss:35` | 🟢 mejora | `line-height: 42px` — valor absoluto en px para line-height | Cambiar a valor sin unidad (`1.05`) o usar `var(--size-40)` |

---

## 4. Accesibilidad

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `MemberCard.tsx:36` | 🔴 crítico | `<div onClick>` con `role="button"` sin `tabIndex={0}` ni manejo de Enter/Space — no es accesible con teclado ni cumple ARIA | Cambiar a `<button type="button">` cuando hay interacción |
| `VoteSheet.tsx:99–112` | 🔴 crítico | Botones Sí/No con `aria-pressed` hardcodeado estático — el estado declarado a los lectores de pantalla es mentiroso | Conectar `aria-pressed` a estado reactivo y añadir `onClick` |
| `VoteSheet.tsx:160` | 🔴 crítico | Botón "Confirmar" sin `onClick` — no hace nada al presionarlo | Implementar el handler o indicar visualmente que está pendiente |
| `VoteSheet.tsx:130–143` | 🟠 alto | `aria-label` de botones linked members (`"María Sí"`) ambiguo | Usar `aria-label` completo como `"Confirmar asistencia de María: Sí"` |
| `EventDetailPage.tsx:192` | 🟠 alto | Overlay de cierre del menú sin `aria-expanded` en el trigger del menú | Añadir `aria-expanded={showMenu}` al botón trigger; el overlay puede tener `aria-hidden="true"` |
| `Avatar.tsx:16–29` | 🟠 alto | Avatar con iniciales sin `role` ni `aria-label` — lectores de pantalla leen las iniciales sin contexto | Añadir `aria-hidden="true"` cuando sea decorativo, o `role="img"` + `aria-label` completo cuando identifica |
| `TopBar.tsx:44–51` | 🟡 medio | Badge de notificaciones es `aria-hidden="true"` — usuarios de lector de pantalla no saben que hay notificaciones | Reflejar el estado en el `aria-label` del link |
| `MembersPage.tsx:62–86` | 🟡 medio | Botones de filtro sin `aria-pressed` — estado activo solo comunicado visualmente | Añadir `aria-pressed={activeFilter === X}` a cada botón de filtro |
| `Input.tsx` | 🟡 medio | `id` es prop opcional — si no se pasa, `<label htmlFor={id}>` queda sin asociar | Hacer `id` obligatorio o generarlo con `useId()` de React 18 |

---

## 5. i18n

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `locales/es/notifications.json`, `locales/ca/notifications.json` | 🟠 alto | Prácticamente todo el namespace `notifications` son datos de demo con nombres reales en lugar de plantillas de mensaje | Si las notificaciones son dinámicas, reemplazar por plantillas `"newEvent": "{{createdBy}} ha creado {{eventName}}"` |
| `locales/es/common.json:2`, `locales/ca/common.json:2` | 🟠 alto | Clave `"bienvenida"` al nivel raíz sin sección — viola el formato `namespace:seccion.clave` | Mover a `common.home.title` o eliminar junto con `Home.tsx` |
| `locales/es/events.json` (`detail.going` vs `vote`) | 🟡 medio | `detail.going.title/yes/no` son idénticos a `vote.title/yes/no` — duplicación con ligera diferencia en `save` | Unificar si son para el mismo componente; documentar si los contextos son distintos |
| `locales/ca/events.json` | 🟡 medio | Mezcla "event" (anglicisme) y "esdeveniment" (forma normativa valenciana) en el mismo archivo | Usar "esdeveniment" de forma consistente |
| `locales/es/events.json` (sección `linked`) | 🟡 medio | Claves `linked.firstName/lastName/relationship` duplican conceptualmente el namespace `members` | Evaluar si reutilizar desde `members` o si los contextos son distintos |
| `locales/es/members.json:24`, `locales/ca/members.json:24` | 🟡 medio | `members.chips.organizer: "Org."` — abreviatura que lectores de pantalla leen como "Org punto" | Verificar que `<Chip>` tenga `title` o `aria-label` con el rol completo |
| `locales/es/onboarding.json:7` | 🟢 mejora | `"terms": "Al continuar aceptas los "` — espacio al final para concatenación frágil | Usar componente `<Trans>` con interpolación |
| `locales/{es,ca}/events.json` | 🟢 mejora | Orden de claves en `detail` difiere entre `es` y `ca` | Alinear el orden para facilitar mantenimiento |

---

## 6. Seguridad

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `firestore.rules:35` | 🟠 alto | `allow list: if isAuthenticated()` en `/users` — cualquier usuario logueado puede enumerar todos los perfiles del sistema | Restringir por `groupId`: `allow list: if isAuthenticated() && resource.data.groupId == myProfile().groupId` |
| `firestore.rules:97–99` | 🟠 alto | `allow write: if isMemberOfGroup(groupId)` en `linkedMembers` — cualquier miembro puede modificar o eliminar linked members de otros usuarios | Añadir `request.resource.data.ownerUid == request.auth.uid` a la regla de escritura |
| `AppRoutes.tsx:278`, `SeedPage.tsx:1–431` | 🟠 alto | `/seed` accesible en producción sin guard — cualquier miembro puede borrar todos los eventos y datos | Condicionar con `process.env.NODE_ENV !== 'production'` o restringir a rol `admin` |
| `user.service.ts:31–36` | 🟡 medio | `updateUserFields` acepta `Partial<UserProfile>` incluyendo `role` — un usuario podría elevarse a admin desde el cliente | Añadir en las reglas Firestore: impedir modificación del campo `role` por el propio usuario |
| `.gitignore` | 🟡 medio | `.env` figura como untracked pero no está en `.gitignore` — un `git add .` futuro lo comprometería | Añadir `.env` a `.gitignore` |
| `group.service.ts:62–71` | 🟡 medio | `Math.random()` para generar el código de invitación — no es criptográficamente seguro | Usar `crypto.getRandomValues(new Uint8Array(6))` |

---

## 7. Rendimiento

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `GroupContextProvider.tsx:22–55` | 🟠 alto | Efecto async sin `isMounted` — con React 18 StrictMode el double-mounting hace probable actualizar estado tras desmontaje | Añadir flag `isMounted` con cleanup |
| `attendance.service.ts:31` | 🟡 medio | `collectionGroup("attendances")` sin `limit()` — puede leer miles de documentos en usuarios con mucho historial | Añadir `limit(100)` o filtrar por `groupId` |
| `event.service.ts:41–49` | 🟡 medio | Todos los eventos del grupo se cargan en memoria y se filtran en cliente | Añadir filtro server-side por fecha o `limit()` para la carga inicial |
| `linked-member.service.ts:33–45` | 🟡 medio | `getDocs` sobre `linkedMembers` sin `limit()` — llamado en cada montaje del `GroupContextProvider` | Añadir `limit(200)` o documentar la asunción de tamaño máximo |
| `MembersList.tsx:74–75` | 🟡 medio | `onClick` definido inline dentro del map rompe la memoización de `MemberCard` — cada render recrea la función | Envolver en `useCallback` o extraer el item como subcomponente que gestione su propia navegación |
| `reportWebVitals.ts` | 🟢 mejora | `web-vitals@^0.2.4` con API obsoleta; `reportWebVitals()` se llama sin callback — no hace nada | Eliminar la dependencia o actualizar a v4 con reporting real |

---

## 8. SEO y HTML

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `public/index.html` | 🟡 medio | Sin Open Graph tags (`og:title`, `og:description`, `og:image`) | Añadir metadatos OG básicos para la landing pública |
| `public/index.html:2` | 🟡 medio | `<html lang="es">` hardcodeado aunque la app soporta catalán | Actualizar `document.documentElement.lang` en la inicialización de i18next y en cada cambio de idioma |
| `public/` | 🟡 medio | Sin `robots.txt` — los crawlers indexan `/seed`, `/style-guide` y rutas de auth | Añadir `robots.txt` con `Disallow` para rutas de desarrollo y onboarding |
| `public/index.html:18` | 🟡 medio | No hay `<link rel="preconnect">` para Fontshare CDN — el browser descubre la conexión solo al parsear el stylesheet | Añadir `<link rel="preconnect" href="https://api.fontshare.com" crossorigin />` |

---

## 9. Testing

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `src/services/__tests__/` | 🟠 alto | Solo `event.service.test.ts` existe — `group.service`, `user.service`, `attendance.service`, `linked-member.service` y `auth.service` sin ningún test | Añadir tests para al menos: `createGroup` (bucle de unicidad), `updateMemberRole`, `findGroupByInviteCode`, `getMyAttendances` |
| `src/context/`, `*.reducer.ts` | 🟠 alto | Contextos y todos los reducers sin tests — los reducers son funciones puras con ROI máximo | Añadir tests de reducer para `loginReducer`, `registerReducer`, `createEventReducer`, `editEventReducer` |
| `package.json:7` | 🟡 medio | `@types/jest@^26` en `dependencies` (no `devDependencies`) y en conflicto de tipos con Vitest globals | Mover a `devDependencies` o eliminar y usar `@vitest/globals` |
| `MembersPage.test.tsx:58–69` | 🟡 medio | Tests que consultan la clave i18n cruda como texto — frágiles ante cambios de clave | Consultar por `role` + `name` semánticos (ej. `getByRole("status")`) |
| `vitest.config.ts` | 🟡 medio | Sin umbrales de cobertura configurados — la cobertura puede caer a 0% sin que CI lo detecte | Añadir `coverage: { provider: 'v8', thresholds: { lines: 60, functions: 60 } }` |
| `@testing-library/user-event` instalado | 🟢 mejora | Instalado pero nunca usado en ningún test | Usar en tests de interacción o eliminar la dependencia |

---

## 10. Dependencias y configuración

| Archivo:línea | Severidad | Problema | Solución |
|---|---|---|---|
| `package.json:25–36` | 🟠 alto | 12 paquetes `workbox-*` en `dependencies` en lugar de `devDependencies`; Workbox 5 desactualizado y `workbox-google-analytics` no funcional (Google Analytics v1 cerrado en julio 2024); el SW está intencionalmente deshabilitado con `unregister()` | Mover todos los `workbox-*` a `devDependencies`; considerar eliminar el SW o actualizar a Workbox 7 |
| `package.json:6` | 🟠 alto | `@testing-library/react` en `dependencies` en lugar de `devDependencies` | Mover a `devDependencies` |
| `package.json`, `.eslintrc.js` | 🟠 alto | `eslint-plugin-react-hooks` no instalado ni configurado — sin análisis estático de hooks, con bugs de dependencias ya presentes | Instalar y añadir `extends: ['plugin:react-hooks/recommended']` |
| `package.json:18` | 🟡 medio | `react-scripts@5` (CRA) sin mantenimiento desde abril 2023; toolchain dividido con Vite para tests | Migrar completamente a Vite |
| `package.json:22` | 🟡 medio | `typescript@^4.1.3` en `dependencies` — 3 versiones mayor de retraso (actual: 5.8) | Mover a `devDependencies` y actualizar a `^5.8` |
| `tsconfig.json:3` | 🟡 medio | `"target": "es5"` innecesariamente antiguo para el browserslist declarado (Chrome 79+, Safari 14+) | Cambiar a `"es2018"` o `"es2020"` |
| `package.json:24` | 🟡 medio | `web-vitals@^0.2.4` — 4 versiones mayor de retraso; la llamada en `index.tsx` no hace nada | Eliminar o actualizar a v4 |
| `package.json:45–47` | 🟡 medio | `eslint@8` + `@typescript-eslint@5` en EOL desde octubre 2024 | Actualizar a ESLint 9 + `@typescript-eslint@8` |
| `tsconfig.json` | 🟢 mejora | Sin `"noUnusedLocals": true` ni `"noUnusedParameters": true` | Añadir ambas opciones |
| `package.json:8` | 🟢 mejora | `@types/node@^22.12.0` en `dependencies` | Mover a `devDependencies` |

---

## Resumen ejecutivo — Estado de correcciones

### ✅ Resueltos en `fix/code-quality-audit` (2026-05-21)
- Seguridad: SeedPage y StyleGuide protegidas en producción, `.env` en `.gitignore`
- Firestore rules: `linkedMembers` restringido al propietario, usuarios listables solo por grupo
- isMounted: `AuthContextProvider` y `GroupContextProvider` protegidos
- Nombres prohibidos: `tc→tCommon`, `lm→linkedMember`, `m→member`, `acc→grouped`, `e→changeEvent` (18 archivos)
- SCSS tokens: tokens semánticos en `vote-sheet`, `members`, `members-list`, `create-group`, `join-group`, `event-detail`, `edit-event`; nuevos tokens `--size-2`, `--radius-sheet`
- TypeScript: `isFirebaseError` en ForgotPasswordPage, JoinGroupPage y CreateGroupPage; eliminado `error.model.ts`
- Routing: `PrivateRoutes` distingue `!user` (→ `/landing`) de `!emailVerified` (→ `/verify-email`)
- Servicios: `addLinkedMember` atomico con `writeBatch`
- BEM: elementos anidados en `empty-state.scss` y `error-boundary.scss`

---

## Problemas pendientes más urgentes

### 🔴 1. VoteSheet no funcional con estado de accesibilidad incorrecto
**`src/pages/events/event-detail/vote-sheet/VoteSheet.tsx:99–160`**
Los botones Sí/No tienen `aria-pressed` hardcodeado estático y el botón "Confirmar" no tiene `onClick`. La feature de votación es un componente central del MVP pero actualmente es una maqueta que declara un estado accesible falso a los lectores de pantalla. Bloquea la release.

### 🔴 2. `cursor: pointer` en el reset global
**`src/scss/base/_reset.scss:32`**
Una sola línea afecta a todos los botones de toda la aplicación en violación explícita de la regla del proyecto. Es la corrección de mayor impacto por menor coste: una línea eliminada.

### 🔴 3. SeedPage destructiva accesible en producción
**`src/routes/AppRoutes/AppRoutes.tsx:278`**
Cualquier miembro del grupo puede navegar a `/seed` y borrar todos los eventos y datos del grupo con un clic. Requiere una sola línea de guarda: `{process.env.NODE_ENV !== 'production' && <Route ...>}`.

### 🔴 4. Firestore: `linkedMembers` sin restricción de propietario
**`firestore.rules:97–99`**
Un miembro puede crear, editar o eliminar los linked members de otros usuarios. Requiere añadir `request.resource.data.ownerUid == request.auth.uid` a la regla de escritura.

### 🔴 5. `eslint-plugin-react-hooks` no instalado
**`package.json`, `.eslintrc.js`**
Sin esta regla, los bugs de `useEffect` con dependencias incorrectas (ya presentes en `EventsListPage`, `LanguageSelector`, `GroupContextProvider`) son invisibles para el linter. Es la red de seguridad mínima para el 40% de los bugs de hooks más comunes. Una sola dependencia + configuración previene toda una categoría de errores.

---

## Valoración por categorías

| # | Categoría | Nota | Justificación |
|---|---|---|---|
| 1 | Calidad de código | **5 / 10** | La estructura general es sólida y los patrones están bien definidos, pero hay violaciones consistentes de las propias convenciones del proyecto: nombres prohibidos (`e`, `tc`, `lm`, `m`) en la mayoría de archivos, lógica duplicada que debería estar extraída, y estados de carga que no siguen el criterio `useReducer` que el proyecto mismo establece. El gap entre las reglas escritas y el código real es el problema principal. |
| 2 | Arquitectura y patrones | **6 / 10** | Las decisiones arquitectónicas son correctas: singleton de Firebase, servicios sin `console.error`, separación de lectura/escritura. Lo que falla es la implementación: los dos contextos más críticos (`AuthContextProvider`, `GroupContextProvider`) violan el patrón `isMounted` obligatorio, `addLinkedMember` no es atómica, y hay rutas de producción sin guard adecuado. El diseño es bueno; la ejecución tiene huecos importantes. |
| 3 | SCSS / Estilos | **4 / 10** | El sistema de design tokens existe y está bien definido en `_custom-properties.scss`, pero se ignora en los archivos más recientes. `vote-sheet.scss` tiene más de 20 valores hex directos sin usar ningún token. `_reset.scss` tiene `cursor: pointer` que viola una regla explícita del proyecto. La inconsistencia no es ocasional — es sistemática en los archivos escritos en las últimas semanas. |
| 4 | Accesibilidad | **4 / 10** | Hay problemas críticos activos en producción: el componente `MemberCard` (que aparece en todas las listas) usa `<div>` como botón interactivo sin semántica de teclado, y `VoteSheet` declara `aria-pressed` estático que miente a los lectores de pantalla. El ui-kit tiene buenas bases (`IconButton` con `aria-label`, `Modal` con `<dialog>` nativo), pero los componentes de dominio no las aplican con consistencia. |
| 5 | i18n | **7 / 10** | Es la categoría mejor ejecutada. Ambos idiomas se mantienen sincronizados, los namespaces están bien organizados, y el formato de claves es consistente en la gran mayoría del proyecto. Los problemas son aislados: datos de demo en el namespace `notifications`, una clave raíz sin sección en `common`, y la inconsistencia "event" vs "esdeveniment" en el archivo catalán. |
| 6 | Seguridad | **4 / 10** | Las reglas de Firestore tienen dos vulnerabilidades reales: cualquier usuario autenticado puede listar todos los perfiles del sistema, y cualquier miembro puede manipular los linked members de otros. La SeedPage en producción sin guard es un riesgo de integridad de datos. Son problemas corregibles en horas, pero están activos y el proyecto se acerca a una presentación pública. |
| 7 | Rendimiento | **6 / 10** | No hay antipatrones graves: no hay N+1 queries, los listeners en tiempo real tienen cleanup, los componentes de lista están memoizados. Los problemas son de escala: queries sin `limit()` que hoy no duelen (grupos pequeños) pero escalarán mal, y los inline callbacks que rompen la memoización en listas. El riesgo real es el `isMounted` faltante en los contextos, que en React 18 StrictMode ya causa problemas en desarrollo. |
| 8 | SEO y HTML | **4 / 10** | Es la categoría más descuidada, aunque es la de menor impacto inmediato para una app de gestión interna. No hay Open Graph, no hay `robots.txt`, el `lang` del HTML es estático para una app bilingüe. Ninguno de estos problemas bloquea el MVP, pero son señales de que esta dimensión no ha recibido atención. |
| 9 | Testing | **3 / 10** | Es el punto más débil del proyecto. Con 21 pruebas en total y cobertura real solo sobre `event.service` (un servicio de 5) y la página de miembros, los reducers —que son funciones puras, los elementos más fáciles de testear— no tienen ni un solo test. Los contextos tampoco. Esto no es un problema de calidad de los tests existentes (que son razonables), sino de volumen: el 90% del código crítico no tiene red de seguridad. |
| 10 | Dependencias y configuración | **4 / 10** | El toolchain está en un estado de transición incompleta: `react-scripts` (CRA, sin mantenimiento desde 2023) para desarrollo/build, y Vite para tests. Esto crea una incoherencia donde las configuraciones de ambos entornos pueden divergir silenciosamente. `eslint-plugin-react-hooks` no está instalado pese a que el proyecto tiene reglas de hooks documentadas. TypeScript 4.1 tiene casi 5 años. No son problemas que rompan la app hoy, pero representan deuda técnica acumulada que cada vez cuesta más saldar. |

**Media global: 4,7 / 10**

---

## Opinión general

El proyecto tiene una base conceptualmente sólida. Las decisiones de arquitectura están bien pensadas y documentadas —el patrón de servicios Firebase, el criterio `useReducer` vs `useState`, la co-ubicación de componentes, BEM— y se nota que hay reflexión detrás de cómo se quiere construir la app. Eso tiene valor real y no es lo habitual en proyectos de este tamaño.

El problema principal no es el diseño sino la brecha entre las reglas escritas y el código real. La mayoría de issues encontrados no son errores de criterio, son violaciones de convenciones que el propio proyecto define con claridad. Nombres abreviados prohibidos (`e`, `tc`, `lm`) aparecen en prácticamente todos los archivos nuevos. Los design tokens existen pero los últimos archivos SCSS ignoran el sistema. El patrón `isMounted` está documentado como obligatorio pero los dos contextos más importantes no lo implementan. Esto sugiere que el ritmo de desarrollo ha superado la capacidad de mantener las propias reglas — algo muy normal cuando se trabaja en solitario con deadline.

Hay dos áreas que merecen atención antes de la presentación de junio. La primera es la seguridad: las reglas de Firestore tienen vulnerabilidades reales que son corregibles en una tarde, y la SeedPage en producción es un riesgo de integridad que no debería estar ahí. La segunda es la funcionalidad: `VoteSheet` es un componente central del MVP que actualmente es una maqueta estática — si la demo incluye el flujo de votación, hay trabajo pendiente antes de que funcione.

Lo que el proyecto tiene a favor: la organización de carpetas es limpia y predecible, el sistema de diseño tiene buenas bases (tokens bien nombrados, ui-kit razonable), los formularios de auth con `useReducer` están bien implementados y son el ejemplo que el resto del proyecto debería seguir, y la cobertura i18n en dos idiomas es un logro que pocos proyectos de este tamaño mantienen con rigor. Con dos o tres semanas de trabajo focalizado en los issues críticos, el proyecto puede estar en muy buena forma para la presentación.
