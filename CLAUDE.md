# CLAUDE.md — Falles App

## Comandos

```bash
npm start        # servidor de desarrollo
npm run lint     # ESLint sobre src/ (.ts y .tsx)
npm test         # tests (jest + testing-library)
npm run build    # build de producción
```

## Convenciones de nombres

- Carpetas: kebab-case (`forgot-password/`, `member-card/`)
- Componentes: PascalCase (`MemberCard.tsx`)
- Archivos SCSS: kebab-case, mismo nombre que la carpeta (`member-card.scss`)
- Campo nombre de usuario: siempre `username` (nunca `userName`) — se refactorizó en todo el proyecto

**Clases CSS/SCSS — BEM obligatorio:**
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```
Ejemplo: `.member-card`, `.member-card__avatar`, `.member-card__name--highlighted`, `.member-card--inactive`

**Unidades px — siempre pares:** nunca usar valores impares (`11px`, `13px`). Usar siempre `12px`, `14px`, etc.

## Flujo de trabajo

**Nunca escribir código sin aprobación previa.** Antes de implementar cualquier cambio hay que proponer el enfoque y esperar confirmación explícita de la usuaria.

## Arquitectura

**Firebase:** `auth` y `db` se exportan exclusivamente desde `src/plugins/firebase.ts`. Nunca instanciar `getAuth()` ni `getFirestore()` en otros archivos.

**Servicios:** solo los métodos de lectura tienen try/catch.
- Lectura → devuelve `null` en error
- Escritura → sin try/catch, el error sube solo al componente

**AuthContext:** expone `{ user, profile, isLoading, logout }`. `profile` es `UserProfile | null`.

**Co-ubicación:** componentes específicos de una página van dentro de su carpeta de página. Reutilizables → `src/components/`. Primitivas UI sin lógica de dominio → `src/ui-kit/`.

## i18n

Archivos en `src/locales/{es,ca}/{namespace}.json`. Namespaces: `common`, `auth`, `groups`, `members`, `onboarding`.

Formato de clave: `namespace:seccion.clave` (ej. `members:members.title`, `common:buttons.close`).

Siempre añadir la traducción en **ambos idiomas** al mismo tiempo.

## Git

Flujo: `feature/nombre` → `developer` → `main`

Commits (Conventional Commits, descripción en inglés):
```
feat(members): add role filter and grouped list
fix(auth): handle email already in use error
refactor(group): centralize firebase instances
style(members): update card layout spacing
chore(deps): update firebase sdk
docs(readme): update setup instructions
```

**Autoría:** nunca añadir `Co-Authored-By: Claude` ni ninguna referencia a la IA en los commits. El autor es siempre Sandra.

**Push:** hacer siempre `git push` después de cada commit.

## Rules automáticas

Se cargan automáticamente según el archivo que se edite:

- @.claude/rules/scss-bem.md — BEM y consolidación de estilos
- @.claude/rules/services-pattern.md — patrón try/catch, Firebase singleton, sin console.error
- @.claude/rules/i18n-rule.md — claves en ambos idiomas, namespaces, sin strings hardcodeados
- @.claude/rules/component-patterns.md — co-ubicación, umbral de components/, nombres
- @.claude/rules/accessibility.md — aria-label, Link vs a, landmarks, semántica HTML

## Contexto del proyecto

- Visión, stack, arquitectura, modelos de datos, diseño: `docs/proyecto.md`
- Funcionalidades MVP y estado de implementación: `docs/funcionalidades-mvp.md`
- Reglas de negocio (roles, eventos, asistencia, grupos): `docs/reglas-de-negocio.md`
- Plan de implementación: `docs/superpowers/plans/2026-04-17-mvp-falles-app.md`
- Herramientas y checklist de calidad (a11y, contraste, performance): `docs/recursos-calidad.md`
