# Plan de trabajo — Falles App

**Período:** 13 mayo – 17 junio 2026
**Presentación:** 17 de junio de 2026

---

## Contexto

El proyecto está desarrollado por dos personas:

- **Sandra** — desarrollo frontend: lógica, componentes, servicios, contexto y SCSS
- **Inma** — diseño UX/UI en Figma + landing page externa + vídeo para la presentación

Sandra trabaja con asistencia de Claude Code (IA), una herramienta de desarrollo que ayuda a escribir, revisar y depurar código. El flujo de trabajo es colaborativo: Sandra toma todas las decisiones de producto, diseño y arquitectura, escribe partes del código, corrige y guía a la IA, y esta ejecuta las partes más mecánicas o complejas bajo su dirección.

---

## Forma de trabajar

**Sandra:**
- Define el objetivo de cada sesión
- Decide cómo quiere que se implemente cada cosa
- Escribe SCSS, partes de lógica y ajustes que quiere hacer ella
- Revisa en el navegador que el resultado es correcto
- Corrige y redirige cuando el resultado no es el esperado
- Hace todos los commits y gestiona el repositorio
- Toma todas las decisiones de producto y diseño

**Claude Code (IA):**
- Propone enfoques de implementación que Sandra aprueba o modifica
- Escribe las partes de código que Sandra delega (servicios, lógica compleja, componentes)
- Sigue las instrucciones y el estilo del proyecto
- No toma decisiones de producto ni de diseño

Esta forma de trabajar es equivalente a un pair programming donde Sandra es quien lidera y la IA actúa como copiloto técnico.

---

## Estrategia de desarrollo

**Fase 1 — Visual completo:** construir primero el HTML + SCSS de todas las pantallas pendientes con datos estáticos o de demo. Así la app parece completa desde el principio y se puede demostrar en cualquier momento.

**Fase 2 — Lógica y funcionalidad:** conectar cada pantalla a Firebase/Firestore priorizando las funcionalidades del MVP. El objetivo es que todo el MVP funcione de verdad antes de la presentación.

**Funcionalidades que se falsean para la presentación** (UI completa, sin backend real):
- Feed de grupo — posts hardcodeados con datos verosímiles
- Notificaciones — lista hardcodeada con notificaciones realistas

**Todo lo demás se implementa con lógica real.**

---

## Estado completado hasta 13 mayo 2026

- Autenticación completa (registro, login, recuperación de contraseña, verificación de email)
- Selección de idioma (castellano / valenciano) con i18n completo
- Crear grupo con imagen y código de invitación
- Unirse a un grupo mediante código
- Sistema de guardas de ruta por sesión, verificación y rol
- Bottom navigation bar con lógica de roles
- Lista de eventos del grupo con filtros por rol + SCSS
- Detalle de evento completo: datos, menú ⋮, badge de estado, zona degradada, sección asistentes (visual) + SCSS
- Creación de evento — flujo de 3 pasos completo con guardado en Firestore + SCSS
- Edición de evento (reutiliza formulario de creación)
- Eliminación de evento con modal de confirmación
- Listado de miembros con búsqueda y filtro por rol + SCSS

## Completado desde 13 mayo 2026

- Code quality audit (2026-05-21): correcciones de seguridad (Firestore rules, SeedPage en producción), TypeScript (`isFirebaseError`, eliminar `error.model.ts`), nombres prohibidos (`tc→tCommon`, `lm→linkedMember`, `m→member`, `acc→grouped`), SCSS tokens en 7 archivos, guards `isMounted` en contextos, `addLinkedMember` atómico con `writeBatch`, BEM en `empty-state` y `error-boundary`, routing `PrivateRoutes` con distinción `!user` / `!emailVerified`
- Modelo y servicio de `Attendance` (modelo, `getEventAttendances`, `saveAttendance`)
- Datos de demo en Firestore — página `/seed` con grupo, miembros, eventos y asistencias
- Página de detalle de miembro `/members/:uid` con cambio de rol y eliminación (solo Admin)
- Lista real de asistentes en detalle de evento: cargada desde Firestore, filtros funcionales, contador real, acompañantes desplegables
- Badge de respuesta en tarjeta de evento para el miembro (check azul / punto naranja / sin respuesta)
- Avatar de color según asistencia (azul confirmado, gris pendiente, rojo no va con nombre tachado)
- Componente `Badge` para estado del evento (activo / plazo cerrado / finalizado)
- Eventos pasados con tema visual gris en lista y detalle
- Modal bottom sheet (reemplaza `alert` del sistema)
- Gesto swipe-back en detalle de evento y detalle de miembro
- Transiciones de slide entre pantallas en onboarding y flujo de crear evento
- Límites de caracteres con contador en inputs de texto (nombre, descripción)
- Lógica completa de votación conectada a Firestore: guardar respuesta, cargar voto previo al abrir el sheet, tarjeta resumen post-voto, bloqueo por `confirmationDeadline`
- Filtros de eventos unificados para todos los roles (Activos · Plazo cerrado · Finalizados · Todos); indicador de asistencia visible para todos los roles en la lista
- Eliminado permiso `canSeeDetailedFilters` (ya no necesario)
- UX main flows (rama `feature/ux-main-flows`, 2026-05-29 → 2026-06-02): mejoras en flujo de asistencia (AttendanceIndicator con texto, botón ¿Vas?, filtros de asistentes), flujo de creación de evento (paso 3 restructurado en secciones, validación hora de fin, toggle especial, error de fecha visible), copy revisado en auth/groups/members, Feed integrado, `--padding-side` token compartido, `PillSelector` eliminado de ui-kit por falta de uso

---

> **Escala de dificultad:** 🟢 Fácil · 🟡 Media · 🔴 Difícil

---

## Semana 1 — 13-19 mayo · Visual completo

**Objetivo:** todas las pantallas tienen HTML + SCSS con datos de demo. La app se puede demostrar de principio a fin.

- ✅ **T01** · Datos de demo en Firestore (grupo, miembros, eventos, asistencias, vinculados) 🟢
- ✅ **T02** · Perfil `/profile` — HTML + SCSS 🟢
- ✅ **T03** · Notificaciones `/notifications` — HTML + SCSS con datos hardcodeados 🟢
- ✅ **T04** · Pantalla de acciones de miembro en `/members` — HTML + SCSS 🟢
- ✅ **T05** · Confirmación de asistencia de vinculados + pantalla añadir vinculados — HTML + SCSS 🟢
- ✅ **T06** · Feed `/feed` — HTML + SCSS con posts hardcodeados 🟡
- ⬜ **T07** · Inicio calendario `/calendar` — instalar FullCalendar, estructura y SCSS 🔴

---

## Semana 2 — 20-26 mayo · Calendario + inicio lógica

- ⬜ **T08** · Finalizar calendario `/calendar` — navegación, puntos en días, lista del día seleccionado 🔴
- ✅ **T09** · Modelo y servicio de `Attendance` en Firestore 🟡
- ✅ **T10** · Conectar botones Sí/No del miembro con escritura en Firestore 🟡
- ✅ **T11** · Cargar respuesta del usuario al abrir el detalle del evento 🟡
- ✅ **T10** · Conectar botones Sí/No del miembro con escritura en Firestore 🟡
- ✅ **T11** · Cargar respuesta del usuario al abrir el detalle del evento 🟡
- ✅ **T34** · Añadir vinculados con escritura en Firestore (Firebase + lógica) 🟡
- ✅ **T35** · Editar vinculados con actualización en Firestore 🟡
- ✅ **T36** · Votar por vinculados en VoteSheet con escritura en Firestore 🟡
- ✅ **T37** · Mostrar respuestas de vinculados en VoteSheet y listado de asistentes 🟢

---

## Semana 3 — 27 mayo - 2 junio · Lógica MVP

- ✅ **T12** · Badge de respuesta en tarjeta de evento (miembro): check azul / punto naranja / rojo tachado 🟡
- ✅ **T13** · Bloquear botones Sí/No si el plazo ha cerrado (`confirmationDeadline`) 🟢
- ✅ **T14** · Lista de asistentes real: cargar desde Firestore, filtros funcionales, contador real 🟡
- ✅ **T15** · Avatar de color según respuesta (azul / gris / rojo) 🟢
- ⬜ **T16** · Calendario conectado a Firebase (puntos reales + eventos del día reales) 🟡
- ✅ **T17** · Gestión de miembros: cambio de rol con confirmación 🟡
- ✅ **T18** · Gestión de miembros: expulsar miembro con confirmación 🟡
- ⬜ **T31** · Solicitudes de unión al grupo — enviar solicitud en lugar de unirse directamente + pantalla de solicitudes pendientes para Admin/Organizador + aprobar/rechazar 🔴
- ✅ **T32** · Permitir hasta 3 admins por grupo — actualizar regla de negocio, lógica de cambio de rol y validación en Firestore 🟡
- ✅ **T33** · Texto informativo de diferencias de roles al cambiar rol en detalle de miembro 🟢
- ✅ **T19** · Perfil funcional completo: `ProfilePage`, `EditProfilePage`, `ChangePasswordPage`, `GroupSettingsPage`, `NotificationsSettingsPage` — datos reales conectados a Firebase, permisos por rol, persistencia de toggles en localStorage, eliminación de grupo con notificación `groupDeleted` a miembros 🟡
- ✅ **T38** · Bug: sincronizar nombre y foto al editar perfil en el array `members` del grupo (`updateMemberFields`) 🟢
- ✅ **T39** · Permisos `canManageGroup` y `canShareAccess` en modelo `UserPermissions` 🟢

---

## Semana 4 — 3-9 junio · Cierre técnico y Capacitor

- ✅ **T40** · UX main flows — mejoras de usabilidad en flujo de asistencia, creación de evento y copy (ver rama `feature/ux-main-flows`) 🟡
- ⬜ **T20** · Verificación i18n completo (todas las claves en `es` y `ca`) 🟢
- ⬜ **T21** · Estados vacíos y casos límite en todas las pantallas 🟡
- ⬜ **T22** · Corrección de bugs encontrados 🟡
- ⬜ **T23** · Compilación con Capacitor + prueba en dispositivo real 🔴
- ⬜ **T24** · Correcciones específicas de app nativa 🟡

> Capacitor puede generar problemas propios del entorno móvil (safe areas, fuentes, gestos). Conviene probar cuanto antes.

---

## 3-11 junio · Preparación de la presentación

- ⬜ **T25** · Polish visual final de la app
- ⬜ **T26** · Guion de la presentación — estructura, qué dice cada una, tiempos
- ⬜ **T27** · Diseño de diapositivas y recursos visuales *(Inma)*
- ⬜ **T28** · Grabación y edición del vídeo de la app *(Inma)*
- ⬜ **T29** · Coordinación landing page + vídeo + presentación
- ⬜ **T30** · Ensayos con app, vídeo y guion completo

---

## Riesgos identificados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El calendario se complica más de lo esperado | Alto | FullCalendar ya elegido y spec definida; si se atasca, dejarlo visual y conectar Firebase en semana 3 |
| Problemas con Capacitor en dispositivo real | Alto | Probar cuanto antes en semana 4; reservar margen para correcciones |
| Cambios de diseño de Inma tardíos | Medio | Cerrar el diseño de cada pantalla antes de empezarla |
| Bugs en Firebase en producción | Medio | Probar en dispositivo real antes del cierre de semana 4 |
| Semana 3 demasiado cargada | Medio | Feed y notificaciones ya son estáticos; gestión de miembros puede quedar parcial si hace falta |
