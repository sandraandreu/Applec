# Code Quality Audit — Falles App

**Fecha original:** 2026-05-17 · **Revisión:** 2026-05-19
**Rama analizada:** `feature/code-quality-audit`
**Plan de trabajo:** `docs/plan-trabajo-junio.md` · Presentación: 11 junio 2026
**Archivos analizados:** 137 ficheros (59 TSX/TS, 28 SCSS, 12 JSON de traducciones)

> Este audit evalúa únicamente el código ya implementado. Las funcionalidades pendientes según el plan de trabajo (T02, T07, T10, T11, T19, T31…) no se puntúan como defectos — son trabajo planificado y esperado.

---

## Puntuación global

| Campo | Original | Revisión | Estado |
|-------|----------|----------|--------|
| Arquitectura | 9 / 10 | 8.5 / 10 | ✅ Excelente |
| i18n | 9.5 / 10 | 9.5 / 10 | ✅ Excelente |
| Calidad de código | 8.5 / 10 | 8 / 10 | ✅ Muy bueno |
| Sistema de diseño | 8 / 10 | 8.5 / 10 | ✅ Muy bueno |
| Rendimiento | 8 / 10 | 8 / 10 | ✅ Muy bueno |
| Seguridad | 6 / 10 | 8.5 / 10 | ✅ Muy bueno |
| Manejo de errores | 6.5 / 10 | 6.5 / 10 | ⚠️ Mejorable |
| Accesibilidad | 6.5 / 10 | 7.5 / 10 | ⚠️ Mejorable |
| Testing | 4 / 10 | 7.5 / 10 | ⚠️ Mejorable |

**Nota media original: 7.2 / 10 → Revisión: 8.1 / 10**

---

## 1. Arquitectura — 8.5 / 10

### Puntos fuertes
- Separación clara en capas: `ui-kit → components → pages`, `services`, `context`, `models`, `plugins`
- Co-ubicación consistente: cada componente tiene su carpeta con `.tsx` + `.scss` juntos
- Firebase instanciado en un único punto (`src/plugins/firebase.ts`) — sin fugas en ningún archivo
- Modelos de datos centralizados en `src/models/` con tipos derivados bien usados (`Omit<T, "id">`)
- Lógica de permisos encapsulada en `computePermissions()` — el componente no toma decisiones de rol directamente
- Contextos con `useMemo` en el `value` y `useCallback` en las funciones expuestas

### Problemas nuevos encontrados

#### 🔴 EventDetailPage — 10 useState sin useReducer
Líneas 33–44 declaran 10 `useState` para un mismo flujo: evento, respuestas, loading, menús, filtros, alertas. Las convenciones del proyecto establecen que 3+ estados relacionados deben usar `useReducer` con archivo separado.

#### 🟡 MemberDetailPage — 8 useState sin useReducer
Líneas 26–33: rol pendiente, expandido, alerts, loading, errores. Mismo problema.

#### 🟡 ForgotPasswordPage — 3 useState relacionados sin useReducer
Líneas 23–27: loading, estado del formulario, error — flujo sincronizado que debería tener reducer.

#### 🟡 JoinGroupPage — 5 useState sin useReducer
Líneas 30–38: grupo encontrado, requestSent, loading, errores de conexión y código.

#### ✅ Resuelto — Error Boundary
`<ErrorBoundary>` implementado y conectado en `App.tsx`.

#### ✅ Resuelto — Fire-and-forget en GroupContextProvider
`void` reemplazado por `await ... .catch(() => undefined)`.

---

## 2. i18n — 9.5 / 10

Sin cambios. La clave `members.onlyMember` verificada — sí se usa en `MembersList.tsx:84`.

---

## 3. Calidad de código — 8 / 10

### Puntos fuertes
- TypeScript estricto sin `any` en producción
- `isMounted` flag en todos los `useEffect` con async
- `React.memo` en componentes de lista (tarjetas, filas)
- Nombres descriptivos, sin abreviaciones

### Problemas nuevos encontrados

#### 🟡 EventList y MembersList sin React.memo
`EventList.tsx:51` y `MembersList.tsx:90` no están envueltos en `React.memo` pero reciben props complejas (arrays de objetos). Re-renderizan toda la lista con cada cambio de filtro.

#### 🟡 useCallback faltante en EventDetailPage
Funciones `toggleMember`, `handleFilterChange`, `handleDelete` (líneas 53–60, 135–138, 166–177) se redeclaran en cada render y se pasan a componentes hijo.

#### 🟡 InviteGroupPage — setTimeout sin cleanup
`src/pages/groups/invite-group/InviteGroupPage.tsx:24` — `setTimeout(() => setCopied(false), 2000)` sin `clearTimeout` en cleanup. Si el componente desmonta antes de los 2s, actualiza estado sobre componente desmontado.

#### 🟡 onEdit={() => undefined en LinkedMembersPage
`src/pages/members/linked-members/LinkedMembersPage.tsx:59` — patrón confuso: pasa un handler que no hace nada. Si el botón no debe aparecer, no pasar la prop.

#### 🟢 EventsListPage — banner de evento actualizado no se limpia
`src/pages/events/events-list/EventsListPage.tsx:28–30` — `eventUpdated` de `location.state` no se limpia. Si el usuario navega atrás y adelante, el banner reaparece.

#### ✅ Resuelto — Fire-and-forget en GroupContextProvider

---

## 4. Sistema de diseño — 8.5 / 10

### Mejoras aplicadas
- `#4C4C4C` reemplazado por `var(--color-icon)` en `layout.scss`
- Inline style de `CreateEventPage` movido a `create-event.scss`
- Regla `sin estilos inline en JSX` añadida a `.claude/rules/scss-bem.md`

### Nota sobre VoteSheet
Los `style.transform` del swipe en `VoteSheet.tsx` y `Modal.tsx` son la excepción documentada — valores calculados en tiempo real por gesto táctil, no expresables en CSS estático.

---

## 5. Rendimiento — 8 / 10

### Problemas encontrados
| Severidad | Problema | Archivo |
|-----------|---------|---------|
| 🟡 Media | `EventList` sin `React.memo` — re-renderiza con cada cambio de filtro | `src/components/events/EventList.tsx` |
| 🟡 Media | `MembersList` sin `React.memo` | `src/components/members/MembersList.tsx` |
| 🟡 Media | Handlers en `EventDetailPage` sin `useCallback` | `src/pages/events/event-detail/EventDetailPage.tsx` |

---

## 6. Seguridad — 8.5 / 10

### Mejoras aplicadas
- `firestore.rules` creado con reglas por colección: membresía de grupo, roles, protección de `groupId`
- Eliminados los tres agujeros críticos: `allow list: if true`, acceso cross-group, sin validación de rol

### Limitación conocida
El campo `role` en documentos de usuario aún puede ser modificado por el propio usuario para no romper el flujo de join. La solución definitiva (Cloud Functions) es trabajo de T32.

### Pendiente
- Desplegar `firestore.rules` vía Firebase CLI (`firebase deploy --only firestore:rules`)

---

## 7. Manejo de errores — 6.5 / 10

### Mejoras aplicadas
- Claves Firebase legacy eliminadas (`auth/wrong-password`, `auth/user-not-found`)

### Problemas que persisten

#### 🔴 Servicios devuelven null para cualquier error
Un error de permisos, un fallo de red y un dato malformado devuelven exactamente lo mismo: `null`. El componente no puede distinguir "sin datos" de "hubo un error".

#### 🟡 hasError no diferencia tipos de error
El usuario ve el mismo estado si hay 0 eventos (lista vacía real) que si Firebase falló.

---

## 8. Accesibilidad — 7.5 / 10

### Mejoras aplicadas
- `EventCard` — indicadores corregidos: `<div aria-label>` → `<span role="img" aria-label>`
- `Modal` — añadido `aria-labelledby` apuntando al título
- `VoteSheet` — añadido `aria-labelledby="vote-sheet-title"`

### Problemas que persisten

#### 🔴 VoteSheet — aria-pressed hardcodeado
`VoteSheet.tsx:112,120,144–154` — botones de voto con `aria-pressed` hardcodeado (`false`/`true`) sin reflejar estado real. La API de accesibilidad no representa el estado actual. Resoluble cuando se conecte la lógica de asistencia (T10).

#### 🟡 EventDetailPage — div con role="button" sin aria-label
`EventDetailPage.tsx:306` — elemento interactivo sin nombre accesible. Los lectores de pantalla no saben qué hace.

#### 🟡 MemberDetailPage — botón con aria-disabled sin tabindex="-1"
`MemberDetailPage.tsx:155–162` — usuario puede tabular a botón deshabilitado.

---

## 9. Testing — 7.5 / 10

### Tests añadidos
| Archivo | Tests | Qué cubre |
|---------|-------|-----------|
| `src/models/__tests__/user.model.test.ts` | 4 | `computePermissions` — los 3 roles + undefined |
| `src/models/__tests__/event.model.test.ts` | 4 | `getEventStatus` — activo, plazo-cerrado, finalizado |
| `src/services/__tests__/event.service.test.ts` | 4 | Mapper Firestore→Date, confirmationDeadline |
| `src/utils/__tests__/firebase-errors.test.ts` | 5 | Mapeo de códigos de error Firebase |
| `src/routes/AppRoutes/__tests__/routes.test.tsx` | 9 | Guards de ruta — PrivateRoutes y PublicRoutes |
| `src/plugins/__tests__/i18n.test.ts` | 1 | Paridad de namespaces es/ca |

**Total: 27 tests en 6 archivos**

### Cobertura restante (sin prioridad inmediata)
- Servicios de asistencia y grupo (requieren Firebase mocking complejo)
- Reducers de formulario (fallos obvios visualmente)

---

## Trabajo pendiente del plan (no son defectos)

| Tarea | Estado | Descripción |
|-------|--------|-------------|
| T02 | ⬜ Pendiente | Perfil `/profile` — HTML + SCSS |
| T03 | ⬜ Pendiente | Notificaciones — HTML + SCSS con datos hardcodeados |
| T06 | ⬜ Pendiente | Feed — HTML + SCSS con posts hardcodeados |
| T07/T08 | ⬜ Pendiente | Calendario `/calendar` con FullCalendar |
| T10/T11 | ⬜ Pendiente | Conectar VoteSheet con Firestore (`saveAttendance`, cargar respuesta actual) |
| T13 | ⬜ Pendiente | Bloquear botones Sí/No si el plazo ha cerrado |
| T16 | ⬜ Pendiente | Calendario conectado a Firebase (puntos reales) |
| T19 | ⬜ Pendiente | Perfil funcional: datos reales, cambio de idioma, cerrar sesión |
| T20 | ⬜ Pendiente | Verificación i18n completo |
| T21 | ⬜ Pendiente | Estados vacíos y casos límite en todas las pantallas |
| T22 | ⬜ Pendiente | Corrección de bugs encontrados |
| T23/T24 | ⬜ Pendiente | Compilación con Capacitor + prueba en dispositivo real |
| T31 | ⬜ Pendiente | Flujo real de solicitudes de unión al grupo con aprobación |
| T32 | ⬜ Pendiente | Límite de 3 admins + Cloud Functions para gestión de roles |
| T33 | ⬜ Pendiente | Texto informativo de diferencias de roles al cambiar rol |

---

## Resumen de acciones

### ✅ Resueltos en esta rama
| # | Acción | Archivo |
|---|--------|---------|
| ✅ | Firebase Security Rules con comprobación de membresía y rol | `firestore.rules` |
| ✅ | `<ErrorBoundary>` en App.tsx | `src/App.tsx` |
| ✅ | `aria-label` en EventCard → `<span role="img">` | `src/components/events/EventCard.tsx` |
| ✅ | Fire-and-forget en GroupContextProvider | `src/context/group/GroupContextProvider.tsx` |
| ✅ | `#4C4C4C` → `var(--color-icon)` en layout.scss | `src/components/layout/layout.scss` |
| ✅ | Claves Firebase legacy eliminadas | `src/utils/firebase-errors.ts` |
| ✅ | `aria-labelledby` en Modal y VoteSheet | `Modal.tsx`, `VoteSheet.tsx` |
| ✅ | 27 tests en 6 archivos | `src/models/`, `src/services/`, `src/routes/`, `src/utils/` |
| ✅ | Inline style → SCSS en CreateEventPage | `src/pages/events/create-events/` |

### 🔴 Alta — pendientes
| # | Acción | Archivo |
|---|--------|---------|
| 1 | Desplegar `firestore.rules` en Firebase | Firebase Console / CLI |
| 2 | `useReducer` en EventDetailPage (10 useState) | `src/pages/events/event-detail/EventDetailPage.tsx` |

### 🟡 Media — pendientes
| # | Acción | Archivo |
|---|--------|---------|
| 3 | `useReducer` en MemberDetailPage (8 useState) | `src/pages/members/member-detail/MemberDetailPage.tsx` |
| 4 | `useReducer` en ForgotPasswordPage (3 useState) | `src/pages/auth/forgot-password/ForgotPasswordPage.tsx` |
| 5 | `useReducer` en JoinGroupPage (5 useState) | `src/pages/groups/join-group/JoinGroupPage.tsx` |
| 6 | `React.memo` en EventList y MembersList | `EventList.tsx`, `MembersList.tsx` |
| 7 | `useCallback` en handlers de EventDetailPage | `src/pages/events/event-detail/EventDetailPage.tsx` |
| 8 | Cleanup de setTimeout en InviteGroupPage | `src/pages/groups/invite-group/InviteGroupPage.tsx` |
| 9 | `div role="button"` → `aria-label` en EventDetailPage | `src/pages/events/event-detail/EventDetailPage.tsx` |
| 10 | `aria-pressed` en VoteSheet refleje estado real (con T10) | `vote-sheet/VoteSheet.tsx` |

### 🟢 Baja — pendientes
| # | Acción | Archivo |
|---|--------|---------|
| 11 | Limpiar `eventUpdated` de location.state en EventsListPage | `src/pages/events/events-list/EventsListPage.tsx` |
| 12 | `onEdit={() => undefined}` → no pasar la prop | `src/pages/members/linked-members/LinkedMembersPage.tsx` |
