# Plan de trabajo — Falles App
**Período:** 22 abril – 11 junio 2026
**Presentación:** 11 de junio de 2026
**Dedicación media:** 18-20 horas semanales

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

## Estado actual del proyecto

### Completado
- Autenticación completa (registro, login, recuperación de contraseña, verificación de email)
- Selección de idioma (castellano / valenciano) con i18n completo
- Crear grupo con imagen y código de invitación
- Unirse a un grupo mediante código
- Listado de miembros con búsqueda y filtro por rol
- Sistema de guardas de ruta por sesión, verificación y rol
- Auditoría de calidad web completa (accesibilidad, SEO, performance, buenas prácticas)

### Pendiente
Todo el bloque de eventos, asistencia, gestión avanzada de miembros, perfil de usuario y compilación a app nativa con Capacitor.

---

## Plan de implementación

Cada semana reserva **2-3 horas de margen** para imprevistos, bugs o ajustes de diseño.

---

### Semana 1 — 22-28 abril · Base de eventos y navegación

| Tarea | Horas |
|---|---|
| ✓ Modelo de datos del evento (TypeScript) | 1h |
| Servicio de eventos (Firebase/Firestore) | 3h |
| Bottom navigation bar con lógica de roles + SCSS | 5h |
| Rediseño pantalla Home con datos reales + SCSS | 5h |
| **Subtotal tareas** | **14h** |
| **Margen imprevistos** | **2-4h** |
| **Total semana** | **18-20h** |

---

### Semana 2 — 29 abril - 5 mayo · Lista de eventos y calendario

| Tarea | Horas |
|---|---|
| Lista de eventos del grupo + SCSS | 5h |
| Vista de calendario mensual + SCSS | 8h |
| Inicio pantalla de detalle de evento | 3h |
| **Subtotal tareas** | **16h** |
| **Margen imprevistos** | **2-4h** |
| **Total semana** | **18-20h** |

> El calendario es la tarea más compleja del proyecto. Se valora usar una librería ligera si el desarrollo a medida se complica.

---

### Semana 3 — 6-12 mayo · Detalle y gestión de eventos

| Tarea | Horas |
|---|---|
| Finalizar pantalla de detalle de evento + SCSS | 2h |
| Formulario de creación de evento (validaciones complejas) + SCSS | 7h |
| Formulario de edición de evento (reutiliza creación) | 4h |
| Eliminación de evento con modal de confirmación | 3h |
| **Subtotal tareas** | **16h** |
| **Margen imprevistos** | **2-4h** |
| **Total semana** | **18-20h** |

---

### Semana 4 — 13-19 mayo · Asistencia

| Tarea | Horas |
|---|---|
| Modelo y servicio de asistencia | 3h |
| Confirmación de asistencia desde el detalle del evento + SCSS | 5h |
| Lista de asistentes (solo admin y organizador) + SCSS | 5h |
| Inicio gestión de solicitudes de unión | 3h |
| **Subtotal tareas** | **16h** |
| **Margen imprevistos** | **2-4h** |
| **Total semana** | **18-20h** |

---

### Semana 5 — 20-26 mayo · Miembros y perfil

| Tarea | Horas |
|---|---|
| Finalizar gestión de solicitudes de unión + SCSS | 2h |
| Expulsar miembro (modal de confirmación) | 3h |
| Cambio de rol con confirmación | 3h |
| Página de perfil con edición de datos e idioma + SCSS | 6h |
| **Subtotal tareas** | **14h** |
| **Margen imprevistos** | **4-6h** |
| **Total semana** | **18-20h** |

---

### Semana 6 — 27 mayo - 2 junio · Cierre técnico y Capacitor

| Tarea | Horas |
|---|---|
| Prueba flujo completo eventos y asistencia | 3h |
| Prueba flujo completo gestión de miembros | 2h |
| Verificación i18n, estados vacíos y casos límite | 2h |
| Corrección de bugs encontrados | 3h |
| Compilación con Capacitor + prueba en dispositivo real | 4h |
| Correcciones específicas de app nativa | 2h |
| **Subtotal tareas** | **16h** |
| **Margen imprevistos** | **2-4h** |
| **Total semana** | **18-20h** |

> Capacitor convierte el build web en una app nativa iOS/Android. En este paso pueden aparecer problemas específicos de móvil (safe areas, fuentes, gestos) que requieren iteraciones.

---

### 3-11 junio · Preparación de la presentación

| Tarea | Horas |
|---|---|
| Pantallas estáticas (feed con datos ficticios, notificaciones) | 4h |
| Polish visual final de la app | 3h |
| Guion de la presentación — estructura, qué dice cada una, tiempos | 3h |
| Diseño de la presentación (diapositivas, recursos visuales) | 5h |
| Grabación y edición del vídeo de la app (Inma) | 5h |
| Coordinación con Inma — landing page + vídeo + presentación | 2h |
| Ensayos — con la app, el vídeo y el guion completo | 3h |
| **Total** | **~25h** |

---

## Resumen de horas

| Semana | Tareas planificadas | Margen incluido | Total con margen |
|---|---|---|---|
| Semana 1 | 14h | 2-4h | 18-20h |
| Semana 2 | 16h | 2-4h | 18-20h |
| Semana 3 | 16h | 2-4h | 18-20h |
| Semana 4 | 16h | 2-4h | 18-20h |
| Semana 5 | 14h | 4-6h | 18-20h |
| Semana 6 | 16h | 2-4h | 18-20h |
| Preparación presentación (horas de Sandra) | 13h | — | 13h |
| **Total horas Sandra** | **105h** | **~16-26h** | **~121-131h** |



## Estrategia para la presentación

El objetivo es que la app se vea completa y profesional, aunque algunas funcionalidades secundarias no estén operativas al 100%.

**Funcionalidades con implementación completa:**
Autenticación, grupos, miembros, eventos y asistencia.

**Funcionalidades con implementación visual (sin backend):**
- Feed de grupo — pantalla con publicaciones de ejemplo hardcodeadas
- Notificaciones — icono con badge estático

Esta estrategia es habitual en demos de producto y permite mostrar la visión completa de la app sin comprometer el tiempo de las funcionalidades core.

---

## Riesgos identificados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El calendario a medida se complica | Alto | Valorar librería ligera si supera las 8h estimadas |
| Problemas con Capacitor en dispositivo real | Alto | Reservado tiempo en semana 6; probar antes si es posible |
| Cambios de diseño de Inma tardíos | Medio | Cerrar el diseño de cada pantalla antes de implementarla |
| Bugs en Firebase en producción | Medio | Probar en dispositivo real antes de la semana de cierre |
| Semanas con menos disponibilidad | Bajo | El margen semanal y la semana 5 (holgada) lo absorben |
