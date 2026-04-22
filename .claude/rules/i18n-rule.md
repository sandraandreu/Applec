---
paths:
  - "src/locales/**"
---

# Reglas de i18n

## Siempre ambos idiomas a la vez

Cada vez que se añade o modifica una clave, debe actualizarse en `es` y `ca` simultáneamente. No dejar ningún idioma sin su traducción.

## Formato de clave

`namespace:seccion.clave`

Ejemplos:
- `members:members.title`
- `common:buttons.close`
- `events:events.status.activo`

## Namespaces existentes

| Archivo | Contenido |
|---|---|
| `common.json` | Botones, campos, errores genéricos |
| `auth.json` | Register, login, forgot password |
| `groups.json` | Crear grupo, unirse, invitar |
| `members.json` | Lista de miembros, roles, búsqueda |
| `onboarding.json` | Landing, welcome, language, group choice |
| `events.json` | Eventos, estados, asistencia |

Antes de crear un namespace nuevo, verificar que no encaja en uno existente.

## Sin strings hardcodeados en JSX

Toda cadena de texto visible para el usuario debe pasar por `t()`. No hay strings pequeños que no importen — importa la consistencia.

```tsx
// ✗ Mal
<button>Logout</button>

// ✓ Bien
<button>{t("buttons.logout")}</button>
```
