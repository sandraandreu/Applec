Analiza el estado actual del proyecto y actualiza los archivos markdown que lo necesiten.

## Pasos

1. Ejecuta `git diff --name-only HEAD` y `git status` para ver qué ha cambiado en esta sesión.

2. Lee los archivos de docs que puedan verse afectados:
   - `CLAUDE.md` — convenciones, patrones de arquitectura, comandos
   - `docs/proyecto.md` — tech stack, modelos de datos, diseño
   - `docs/funcionalidades-mvp.md` — estado de implementación de cada funcionalidad
   - `docs/reglas-de-negocio.md` — reglas del sistema
   - `docs/plan-mvp.md` — plan semanal de tareas

3. Compara los cambios de código con el contenido actual de los docs e identifica qué está desactualizado o falta.

4. Actualiza solo lo que haya cambiado. Criterios:
   - **CLAUDE.md**: si se añadió un nuevo patrón de arquitectura, convención de código o comando
   - **docs/proyecto.md**: si cambiaron modelos de datos, tech stack o decisiones de diseño
   - **docs/funcionalidades-mvp.md**: si una funcionalidad pasó de pendiente a implementada (o viceversa)
   - **docs/reglas-de-negocio.md**: si se implementó o modificó una regla de negocio
   - **docs/plan-mvp.md**: si se completaron tareas o cambiaron prioridades

5. Informa qué archivos actualizaste y qué cambios hiciste. Si no hay nada que actualizar, dilo.

## Reglas

- No añadas estructura de carpetas ni listas de componentes a ningún doc (se quedan obsoletas)
- No añadas estado efímero (bugs actuales, trabajo en curso puntual)
- Mantén el tono y formato existente de cada archivo
- Si hay duda sobre si algo merece documentarse, no lo añadas
