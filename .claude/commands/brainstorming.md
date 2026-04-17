Antes de implementar cualquier feature, componente o funcionalidad nueva, guía un análisis completo. No escribas código hasta que el diseño esté aprobado.

## Paso 1 — Entiende el contexto

Lee los documentos relevantes antes de hacer ninguna pregunta:
- `docs/reglas-de-negocio.md` — reglas que afectan a la feature
- `docs/funcionalidades-mvp.md` — estado actual de la funcionalidad
- `CLAUDE.md` — patrones de arquitectura del proyecto

## Paso 2 — Haz preguntas (una a la vez)

Explora la idea con preguntas enfocadas en este proyecto. Cubre en orden:

1. **Qué** — ¿qué problema resuelve exactamente esta feature?
2. **Quién** — ¿qué roles la usan? (admin / organizer / member) ¿cada rol ve o puede hacer lo mismo?
3. **Datos** — ¿necesita nuevos campos en Firestore? ¿afecta a `users`, `groups`, `events` o `attendances`?
4. **Estados** — ¿qué estados de UI tiene? (vacío, cargando, error, con datos)
5. **Restricciones** — ¿hay reglas de negocio que la limiten? ¿guards de ruta?
6. **i18n** — ¿necesita nuevas claves de traducción en `es` y `ca`?

Una sola pregunta por mensaje. Espera la respuesta antes de continuar.

## Paso 3 — Propón 2-3 enfoques

Presenta opciones con sus trade-offs y tu recomendación. Ten en cuenta:
- Los patrones existentes del proyecto (servicios con try/catch, Firebase singleton, AuthContext)
- Mobile-first
- No añadir complejidad que no sea necesaria para el MVP

## Paso 4 — Presenta el diseño

Presenta sección a sección y pide confirmación:

1. **Componentes y estructura** — qué archivos se crean o modifican, dónde van
2. **Modelo de datos** — cambios en Firestore si los hay
3. **Lógica y servicio** — métodos nuevos en qué servicio
4. **UI por rol** — qué ve y puede hacer cada rol
5. **Traducciones** — claves nuevas necesarias
6. **Criterios de aceptación** — lista concreta de qué tiene que funcionar

## Paso 5 — Guarda el diseño

Cuando el diseño esté aprobado, guárdalo en `docs/specs/YYYY-MM-DD-nombre-feature.md` con las secciones del paso 4.

## Reglas

- No escribas código hasta que el diseño esté aprobado explícitamente
- Si la feature afecta a múltiples roles, describe el comportamiento de cada uno por separado
- Si hay reglas de negocio en `docs/reglas-de-negocio.md` que aplican, cítalas explícitamente
- YAGNI: descarta cualquier idea que no sea necesaria para el MVP
