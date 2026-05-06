# Skills y comandos disponibles

## Slash commands del proyecto

Comandos personalizados en `.claude/commands/`. Se invocan escribiendo `/nombre` en el chat.

| Comando | Cuándo usarlo |
|---|---|
| `/brainstorming` | Antes de crear cualquier feature, componente o funcionalidad nueva — explora requisitos, roles, datos y diseño antes de tocar código |
| `/sync-docs` | Al final de una sesión de trabajo para actualizar los `.md` con los cambios que se hayan hecho |

---

## Plugins instalados

Plugins globales instalados en Claude Code. Se invocan con `/nombre` o se activan automáticamente según el contexto.

| Plugin | Qué hace |
|---|---|
| `superpowers` | Conjunto de skills para planificación, debugging, TDD, revisión de código, worktrees y más |
| `frontend-design` | Genera interfaces frontend de calidad de producción con criterio de diseño |
| `typescript-lsp` | Integración con el servidor de lenguaje TypeScript para diagnósticos en el IDE |

### Skills de superpowers más útiles para este proyecto

| Skill | Cuándo usarlo |
|---|---|
| `/brainstorming` | Antes de crear una feature nueva — explora requisitos y diseño antes de tocar código |
| `/writing-plans` | Cuando tienes una spec para una tarea de varios pasos, antes de implementar |
| `/executing-plans` | Para ejecutar un plan ya escrito con checkpoints de revisión |
| `/systematic-debugging` | Ante cualquier bug o comportamiento inesperado, antes de proponer fixes |
| `/test-driven-development` | Al implementar cualquier feature o fix |
| `/verification-before-completion` | Antes de dar una tarea por terminada — obliga a verificar con evidencia real |
| `/security-review` | Revisión de seguridad de los cambios del branch actual |
| `/review` | Revisión de un pull request |
