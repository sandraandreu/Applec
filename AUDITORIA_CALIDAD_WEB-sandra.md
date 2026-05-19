# 🪄 Auditoría de calidad web — Applec (Falles App)

> **Fecha:** 19 de mayo de 2026 *(segunda pasada — la primera fue el 21 de abril sobre la rama `developer`)*
> **Rama auditada:** `develop` · commit `e7f4a6a`
> **URL local:** http://localhost:3002 (Create React App; se arrancó en 3002 porque el 3000 y 3001 ya estaban ocupados)
> **Herramientas usadas:** Chrome DevTools MCP · Lighthouse (desktop + mobile) · performance trace · `npm audit` · `npm run build` · `vitest run` · revisión estática del código

> ⚠️ **Antes de nada — leed esto.**
> Esta es la **segunda auditoría** del proyecto. En el mes que ha pasado desde la primera habéis cerrado **casi todos los puntos del informe anterior**, además de añadir features nuevas (eventos completos, miembros enlazados, votación, MainLayout, ErrorBoundary, vitest, Firestore rules…) y dos reglas internas en `.claude/rules/` que codifican los aprendizajes (`accessibility.md`, ampliaciones de `services-pattern.md` y `scss-bem.md`).
> Lo que viene a continuación es **otro pase de pulido**, no una corrección. La mayor parte son cosas que sólo se descubren cuando el resto ya está bien.

---

## 🎯 El progreso desde abril — para que se vea el avance

| Punto del informe anterior | Estado actual |
|---|---|
| 1. Casing `App.tsx` y `Home.scss` que rompía build | ✅ Resuelto (`6b6a966`) |
| 2. `<html lang="en">` en app bilingüe | ✅ `lang="es"` + sync dinámico al cambiar idioma |
| 3. `<a href>` internos → `<Link>` | ✅ Migrado en login, register, forgot-password |
| 4. `<a onClick>` sin href en InviteGroupPage | ✅ Reemplazado |
| 5. Icon-buttons sin `aria-label` | ✅ `BackButton` + `EyeToggleIcon` + `Search` con `.visually-hidden` |
| 6. Typo `mmembers` + `members` ausente del array `ns` | ✅ Y se añadió un test de paridad en `i18n.test.ts` |
| 7. `console.error` en servicios | ✅ Limpiado en todos los services de producción |
| 8. Textos hardcodeados (Logout, share) | ✅ Pasados a i18n |
| 9. Sin `ErrorBoundary` | ✅ `ui-kit/error-boundary` en raíz de `App.tsx` |
| 10. `<title>`, meta description, manifest sin marca | ✅ Todo actualizado, manifest dice «Applec — Falles App» |
| 11. Rutas huérfanas `/privacy` y `/terms` | ✅ Migradas a `https://applec.com/...` + `rel="noopener noreferrer"` |
| 12. Deuda con `react-scripts` / `workbox-*` | ⏸️ Aún pendiente — sin urgencia |
| 13. Color-contrast del botón secundario | ⚠️ Mejoró pero **sigue sin cumplir** (4.12 vs 4.5 mínimo) — ver §1 |
| 14. Falta `<main>` landmark | ✅ Envuelve `AppRoutes` en `App.tsx` |
| 15. CLS = 0.15 por fuentes externas | ✅ Bricolage Fallback con `size-adjust` → **CLS 0.00** |
| 16. Imagen landing no responsive | ✅ Lighthouse ya no la marca |

**Y además, sin estar en el informe anterior, habéis añadido:**

- 🆕 **Tests con Vitest** + jsdom + testing-library — **27 tests pasan**, incluidos route guards y el contrato i18n.
- 🆕 **Lazy loading** con `React.lazy` + `Suspense` en todas las páginas de `AppRoutes.tsx`. El bundle se trocea automáticamente.
- 🆕 **Reducers** (`login.reducer.ts`, `register.reducer.ts`, `create-event.reducer.ts`, `edit-event.reducer.ts`) para formularios con varias fases — y una regla en `component-patterns.md` razonando **cuándo** usarlos.
- 🆕 **Permissions modelo** (`UserPermissions`) con flags por rol que se calculan una vez (`computePermissions`) y consumen toda la UI. La separación de roles es ahora declarativa.
- 🆕 **Firestore security rules** versionadas en repo — frontend dejó de ser la única línea de defensa.
- 🆕 **Design tokens completos** en `_custom-properties.scss`: primitivos + semánticos para colores, radios, tipografía, gaps y paddings. Cero colores hardcoded en SCSS (lo verifiqué con grep, no aparece ni un `#hex`).
- 🆕 **`React.memo` en componentes de lista** (`MemberCard`, `EventCard`) y `useMemo`/`useCallback` en los providers de contexto.
- 🆕 **Reglas internas escritas**: `accessibility.md`, `useReducer vs useState`, *«sin estilos inline en JSX»*, *«sin `console.error` en services»*… son aprendizajes congelados como contrato del repo.

En resumen: el proyecto ha pasado de «código sólido de estudiante» a **«código de producto con criterio»**. Lo que sigue son las grietas finas.

---

## 📊 Lighthouse — comparativa

### Primera pasada (rama `developer`, 21 abril, con app renderizando)

| Categoría         | Desktop | Mobile |
|-------------------|---------|--------|
| Accesibilidad     | 89      | 89     |
| Mejores prácticas | 77      | 73     |
| SEO               | 91      | 91     |

### Esta pasada (rama `develop`, 19 mayo)

| Categoría         | Desktop | Mobile | Δ |
|-------------------|---------|--------|----|
| Accesibilidad     | **92**  | **92** | ▲ +3 |
| Mejores prácticas | **77**  | **77** | ▲ +4 mobile |
| SEO               | **100** | **100** | ▲ +9 ¡perfecto! |
| Agentic Browsing  | **100** | **96**  | 🆕 categoría nueva |

### Performance trace (esta pasada)

| Métrica | Valor   | Umbral «bueno»  | Estado     |
|---------|---------|------------------|------------|
| **LCP** | 519 ms  | < 2 500 ms       | ✅ excelente |
| **CLS** | 0.00    | < 0.10           | ✅ perfecto — el `size-adjust` funciona |
| **TTFB**| 300 ms  | —                | OK (dev server) |

**Lo que aún penaliza el score** (3-4 audits):

- `color-contrast` — el botón secundario. La sección 1 lo explica con números.
- `third-party-cookies` + `inspector-issues` — Firebase carga `apis.google.com` que pone cookies de tercero (bloqueadas por defecto en Chrome). **Esto no es bug vuestro**, es el SDK de Google. Penaliza «Best Practices» pero no se puede arreglar sin migrar de Firebase.
- `cumulative-layout-shift: score 0.91` en mobile — el CLS real es 0.00, pero Lighthouse marca un pequeñísimo shift al cargar la fuente. Score 0.91/1.0 es **bueno**, no fallo grave.

---

## 🧭 Cómo leer este documento

Cada sección sigue siempre el mismo esquema:

- **Qué pasa** — descripción del patrón y un fragmento real de vuestro código.
- **Por qué importa** — el porqué didáctico.
- **Cómo lo arregláis** — el código concreto copy-pasteable.
- **💡 Aprendizaje** — la regla mental que vale para este proyecto **y para los próximos**.

**11 secciones** esta vez (frente a 16 del informe anterior), más un bloque visual con capturas de los recorridos por las dos cuentas. Ordenadas **por valor didáctico**. La diferencia respecto al primer informe es que aquí casi todo se podría llamar «detalles» — pero son los detalles que separan un producto bueno de uno excelente. Las dos últimas (10 y 11) son las únicas «realmente urgentes» del informe.

---

## 🖼️ Recorrido visual — lo que descubrí navegando

Tras el análisis estático y Lighthouse, hice un recorrido completo por la app **iniciando sesión con las dos cuentas reales** (admin Maria Ortega + miembro Sandra Andreu) y capturé cada pantalla. Lo que **solo se ve renderizando**:

### ✅ Lo que renderiza con criterio profesional

- **El sistema de permisos funciona en pantalla**, no solo en código. Como miembro: desaparece el `+ Crear evento` del TopBar, desaparecen los iconos de editar de cada `EventCard`, y aparece el indicador naranja «Sin respuesta» en los eventos que requieren confirmación. Como admin: editar disponible en eventos no finalizados, badge "Finalizado" en los pasados, sin indicadores de asistencia personal porque admin no asiste él mismo. **Esto es un sistema de permisos vivo**, no un `if` suelto en una página.
- **El gradient del header cambia según el rol** (`useLayoutBackground(profile?.role)`): admin entra a `/events` con gradient rosa; miembro a `/events` con gradient azul. Detalle minúsculo que muchos productos «de verdad» no se permiten.
- **Indicador naranja en eventos pendientes** con `role="img" aria-label="Sin respuesta"` — perfecto para lectores de pantalla.
- **Vista admin de miembros agrupada por rol** (Administrador 3 / Organizadores 2 / Miembros 5), chips por color, avatares con iniciales. El `MemberCard` con todos sus variantes se ve coherente en todas las pantallas.
- **Acompañantes (linked members)**: header teal pastel, lista, CTA «+ Añadir acompañante» con borde punteado, formulario `Nombre / Apellidos / Parentesco` con dos botones. Feature compleja, bien resuelta.
- **CreateEvent wizard** (admin): stepper de 3 puntos arriba, fondo orange pastel, toggle «Especial / Normal», campos con etiqueta «(opcional)» cuando procede. Único detalle: el botón «Continuar» tiene estilo *outline* — visualmente parece secundario cuando es la acción principal del paso.

### ⚠️ Lo que descubrí solo al navegar

1. **`/home` está roto visualmente** (refuerza la sección 6). Tanto como admin como miembro, la pantalla es **un rectángulo negro casi vacío**. El `<h1>Bienvenido a Applec</h1>` está en el DOM (lo confirma el árbol de accesibilidad) pero **no se ve**: el texto es oscuro sobre fondo oscuro. Lo único visible es un «Cerrar sesión» blanco arriba a la izquierda, sin estilo de botón. Capturas: `.audit-v2/auth-05-home-admin.png` y `auth-14-home-member.png`. **Esto no debería estar accesible** en una build de demo: cualquier reload accidental cae aquí.

2. **El tab bar lleva a tres pantallas en blanco** (refuerza la sección 4). Pulsar **Feed** → pantalla negra total. Pulsar **Perfil** → pantalla negra total. Pulsar **Calendario** → cae en `/events/:id` con `id="calendar"` y redirige a `/events` (al menos no rompe). Capturas: `.audit-v2/auth-06-feed-NONEXISTENT.png` y `auth-07-profile-NONEXISTENT.png`. **Tres de las cinco pestañas no llevan a ningún sitio.**

3. **`/members` se renderiza con fondo negro** mientras `/events` lo hace con gradient claro. Probablemente `useLayoutBackground` no se llama desde `MembersPage` y la página hereda el `body` oscuro. Los chips y los avatares ganan contraste, pero **el placeholder gris del input «Buscar miembro…» queda con muy bajo contraste**. Capturas: `.audit-v2/auth-03-members-admin.png` y `auth-11-members-member.png`. Hallazgo nuevo, lo trato en la sección 9.

4. **Vista del miembro en `/events/:id`**: la sección de Asistentes desaparece (correcto, no tiene `canSeeAttendees`), pero **deja un hueco blanco de unos 300 px** entre la descripción y el sticky de Votar. Captura: `.audit-v2/auth-10-event-detail-member.png`. Idea para rellenarlo: tu respuesta + tus acompañantes, o un recordatorio del plazo.

5. **`/events/:id/edit` muestra los campos prefilled como invisibles** (hallazgo del segundo pase de la navegación). Al entrar a editar el evento «Taller de Pirotècnia», los `<input>` de Nombre, Descripción y Lugar **aparecen visualmente vacíos**, pero el árbol de accesibilidad confirma que **sí tienen valor** (`value="Taller de Pirotècnia"`, `value="Carrer de la Pau, 12, València"`, etc.). El texto se está pintando con un color que se confunde con el fondo (probablemente blanco sobre blanco o muy claro sobre el `--color-surface`). **Bug crítico**: un admin pulsa «Editar», cree que el formulario está vacío, y empieza a perder datos. Capturas: `.audit-v2/auth-15-edit-event-admin.png`. Lo trato como sección 10 abajo.

6. **Issue del panel de Chrome al cargar `/events/:id/edit`**: «No label associated with a form field» (registrado en Chrome DevTools Issues). Mirando el a11y tree, los `<input type="time">` exponen sus spinbuttons como `"Hours Hours"` y `"Minutes Minutes"` — etiqueta duplicada. Lo trato como sección 11.

> **Sobre las relaciones de acompañantes:** en una pasada anterior pensé que «Marc Soriano · Fill» estaba truncado. **No lo está**: «Fill» es la palabra completa en catalán para «hijo» (Filla = hija). Mantengo la observación de capturas para que veáis el diseño, pero no hay nada que arreglar ahí.

> **Cómo replicar el recorrido**: las capturas están en `.audit-v2/auth-*.png`, ordenadas en el orden de captura. Cuentas usadas: admin `sandreum08@gmail.com` (Maria Ortega) + miembro `sandraandreumartinez08@gmail.com` (Sandra Andreu, con dos acompañantes Júlia y Marc Soriano).

---

## 1. Color-contrast: el último 0.38 que queda

### Qué pasa

Lighthouse (desktop y mobile) sigue marcando el botón secundario «Ya tengo cuenta» de la landing:

```
Element has insufficient color contrast of 4.12
foreground: #0068ff   (--blue-500)
background: #e5f0ff   (--blue-100)
font size: 15.0pt (20px), weight: normal
Expected contrast ratio of 4.5:1
```

En la auditoría anterior el ratio era 3.56:1 (sobre `#cce1ff`). Ha mejorado a 4.12:1, pero **sigue por debajo** del mínimo WCAG AA (4.5:1).

### Por qué importa

Es un fallo de **menos de medio punto** en el ratio, pero el umbral 4.5:1 no es arbitrario: es el punto donde la mayoría de personas con cataratas, deuteranopía o brillo de pantalla bajo pueden leer texto normal. Quedarse en 4.12 es como aprobar un examen con un 4.8 sobre 5: técnicamente has hecho casi todo bien, pero no entra en la nota.

Y este botón no es decoración: es uno de los dos CTAs principales de la landing.

### Cómo lo arregláis

Tres caminos, elegid según cuánto queráis tocar:

- **Subir el peso del texto** a `font-weight: 600` (semibold). Con texto «grande» (≥18px) y peso ≥700, el umbral baja a **3:1** y cumple sobrado. Vuestro botón está en 20px, así que con bold ya pasa. Cambio en `--font-weight-button` o en `.button.secondary`.
- **Oscurecer ligeramente el foreground:** `#0058d6` sobre `#e5f0ff` da **4.52:1**. Cambio quirúrgico: cambia `--blue-500` o añadid un token `--color-link-on-pastel` para no afectar al resto del sistema.
- **Oscurecer el background:** `#c5dfff` (≈ `--blue-150` si lo añadís) con `#0068ff` da **4.71:1**. Más invasivo porque toca el token de fondo.

Comprobad siempre con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### 💡 Aprendizaje

**El contraste se chequea con números, no con la vista.** Y los design tokens son donde se gana la batalla: si los tokens cumplen, todo lo demás los hereda. Una vez tengáis los pares de `(foreground, background)` validados, podéis añadir un comentario en el SCSS:

```scss
// Validated AA: --blue-500 on --blue-100 → ratio 4.52
```

Y cualquier cambio futuro al token ya se mira con esa expectativa.

---

## 2. `<div onClick>` en `MemberCard` — vuestra propia regla os pilla

### Qué pasa

En `src/components/members/MemberCard.tsx:35`:

```tsx
<div
  className={classes}
  onClick={isExpandable ? onToggle : onClick}
  role={isExpandable || onClick ? "button" : undefined}
>
```

El `role="button"` ayuda al lector de pantalla a anunciar el elemento, pero **falta lo demás**: `tabIndex={0}` (para que reciba foco con `Tab`) y `onKeyDown` (para activarlo con `Enter` y `Espacio`). Sin esos dos, un usuario de teclado no puede usar la tarjeta.

Es justo la situación que cubre vuestra propia regla `accessibility.md`:

> Botón = ejecuta una acción. Enlace = lleva a un destino. **No usar `<a>` sin `href` como botón ni `<div>` con `onClick` como elemento interactivo.**

### Por qué importa

Las regla que tú mismo escribes son las que más se cumplen — y las más fáciles de olvidar. Este es el único caso del repo donde sigue habiendo un `<div onClick>` como botón (el grep `<(div|article|span|li|td)[^>]*onClick` solo encontró este).

### Cómo lo arregláis

La opción más limpia es **convertirlo a `<button type="button">`** y resetear estilos en SCSS:

```tsx
<button
  type="button"
  className={classes}
  onClick={isExpandable ? onToggle : onClick}
  // si no es interactivo, no se renderiza como button
  disabled={!isExpandable && !onClick}
>
```

```scss
.member-card {
  // reset del botón
  appearance: none;
  background: none;
  border: 0;
  width: 100%;
  text-align: inherit;
  // resto de estilos…
}
```

Si por motivos de DOM/cards anidadas no queréis cambiar a `<button>`, la alternativa correcta es teclado completo:

```tsx
<div
  className={classes}
  onClick={isExpandable ? onToggle : onClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (isExpandable ? onToggle : onClick)?.();
    }
  }}
  role={isExpandable || onClick ? "button" : undefined}
  tabIndex={isExpandable || onClick ? 0 : undefined}
>
```

### 💡 Aprendizaje

**Si pones `role="button"`, asume el contrato completo del botón.** Un botón nativo trae: foco, Tab, Enter, Espacio, anuncio del lector de pantalla. Si pones el role pero no el resto, prometes algo que no entregas. Regla mental:

> ¿Esto es un botón? → Que sea un `<button>`.
> ¿No puedo porque el DOM no me deja? → `role` + `tabIndex` + `onKeyDown`. Las tres, no una.

---

## 3. El build con `CI=true` falla por tres warnings

### Qué pasa

Si ejecutáis `npm run build` localmente, **pasa**. Si lo hace un pipeline CI (que pone `CI=true` automáticamente), **falla**:

```
Treating warnings as errors because process.env.CI = true.

src\components\layout\TabBar.tsx
  Line 18:11:  'user' is assigned a value but never used  @typescript-eslint/no-unused-vars

src\pages\seed\SeedPage.tsx
  Line 304:7:  Unexpected console statement  no-console
  Line 392:7:  Unexpected console statement  no-console
```

Tres warnings; CRA los promociona a error en CI. Es la misma especie de bomba que la sección 1 del informe anterior (casing): **en mi máquina funciona, en CI no**.

### Por qué importa

Si todavía no estáis desplegando con CI, esto está adormecido. El día que conectéis Vercel/Netlify/GitHub Actions con `applec.com`, el primer despliegue cae. Y vais a estar persiguiendo «mi build funciona localmente» durante una hora antes de descubrirlo.

### Cómo lo arregláis

```tsx
// TabBar.tsx:18 — quitar `user` del destructuring si no se usa
const { profile } = useAuthContext();
// (estaba: const { user, profile } = useAuthContext();)
```

```tsx
// SeedPage.tsx — si el console.error es intencional (que lo es: es una página de seed
// de admin, queréis ver el error en consola), silenciad el lint puntualmente:
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  setStatus("error");
}
```

Y para detectarlo siempre antes de mergear, añadid el flag en el script de lint del repo:

```json
// package.json
"scripts": {
  "build:ci": "CI=true react-scripts build",
  "lint:strict": "eslint --ext .ts,.tsx --max-warnings=0 src"
}
```

Y en el futuro pipeline:

```yaml
# .github/workflows/ci.yml (cuando exista)
- run: npm run lint:strict
- run: npm run build
```

### 💡 Aprendizaje

**Los warnings no son adornos.** Vuestro linter os está avisando de cosas reales: variables muertas (señal de copy-paste descuidado), console.logs olvidados (señal de debug que se quedó). En desarrollo conviven con el código; en CI **deben fallar**. La regla `--max-warnings=0` os obliga a tratarlos: o los arregláis, o los marcáis explícitamente con `eslint-disable` y un motivo.

---

## 4. El `TabBar` enlaza a rutas que no existen

### Qué pasa

En `src/components/layout/TabBar.tsx` el menú inferior tiene cinco pestañas:

```tsx
<Link to="/feed"             aria-label={t("nav.feed")}>...</Link>
<Link to="/events/calendar"  aria-label={t("nav.calendar")}>...</Link>
<Link to="/events"           aria-label={t("nav.events")}>...</Link>
<Link to="/members"          aria-label={t("nav.members")}>...</Link>
<Link to="/profile"          aria-label={t("nav.profile")}>...</Link>
```

Pero en `AppRoutes.tsx` solo existen `/events` y `/members`. Las otras tres (`/feed`, `/events/calendar`, `/profile`) **no están declaradas**: si el usuario las pulsa, cae en la `<Route path="/" element={<Navigate to="/landing" replace />} />` y acaba en la landing (o en una página vacía, según el contexto).

Es el mismo patrón que el `/privacy` y `/terms` del informe anterior, pero esta vez **en la navegación principal**: el sitio donde un usuario realmente va a pulsar.

### Por qué importa

Las pestañas vacías son una promesa rota. Y romper una promesa de navegación es peor que no hacerla: si el icono está ahí, el usuario va a pulsar — y cuando vuelva sin entender qué ha pasado, ya no va a confiar en el resto de la app.

### Cómo lo arregláis

Tres opciones, según el roadmap:

- **Si las páginas están a punto** (siguiente sprint): mantened los enlaces y abrid un PR-stub para cada ruta con la página esqueleto.
- **Si están a medio plazo**: ocultad las pestañas que aún no funcionan, comentando el bloque o con un flag:

  ```tsx
  const TABS_ENABLED = {
    feed: false,
    calendar: false,
    events: true,
    members: true,
    profile: false,
  } as const;

  {TABS_ENABLED.feed && <Link to="/feed">...</Link>}
  ```

- **Si están lejanas**: convertidlas en placeholders desactivados visualmente con `aria-disabled="true"` y `tabIndex={-1}`:

  ```tsx
  <span className="tab-bar__item tab-bar__item--disabled" aria-disabled="true">
    <Icon name="feed" size={32} />
  </span>
  ```

### 💡 Aprendizaje

**La interfaz no miente.** Si pintáis un botón, ese botón hace algo. Si pintáis un enlace, ese enlace lleva a un sitio real. Una buena costumbre: cada componente de navegación nuevo abre un PR que **debe** referenciar a rutas existentes — y si añadís una ruta, hay un test que la visita. Ya tenéis `routes.test.tsx`: extenderlo a probar que cada `<Link>` del TabBar resuelve a una ruta válida es una victoria barata y duradera.

---

## 5. `SeedPage` viola la regla de «sin estilos inline»

### Qué pasa

Vuestro `.claude/rules/scss-bem.md` dice:

> **Sin estilos inline en JSX — prohibido.** Nunca usar `style={{ ... }}` en componentes React. Todo estilo va en el archivo SCSS de la carpeta con su clase BEM correspondiente. La única excepción permitida son estilos calculados dinámicamente en JavaScript que no pueden expresarse en CSS estático.

Y en `src/pages/seed/SeedPage.tsx`:

```tsx
<div style={{ padding: "32px", fontFamily: "sans-serif", maxWidth: "480px" }}>
  <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Seed de datos de demo</h1>
  ...
  <button onClick={handleSeed} style={btnStyle("#0068FF")}>Crear datos de demo</button>
```

Hay ~15 `style={{...}}` en esa página, y un helper `btnStyle()` que devuelve un objeto de estilo. Es **exactamente lo que la regla prohíbe**.

> Nota: `StyleGuide.tsx` también tiene inline styles pero **son la excepción válida** (`style={{ background: \`var(${variable})\` }}` — el valor depende de una variable JS). Aquí no.

### Por qué importa

`SeedPage` es una utilidad interna, sólo accesible para admin, y el código se nota que era «código rápido para tener algo funcionando». **Eso es perfectamente legítimo durante el desarrollo**. Lo que no es legítimo es dejarlo así una vez la regla está escrita.

Pasa lo mismo con las paredes blancas de cualquier piso compartido: si la norma es «no clavar nada», la primera persona que clava se convierte en la justificación de todas las siguientes.

### Cómo lo arregláis

Migrar a un `seed.scss` con BEM:

```scss
// src/pages/seed/seed.scss
.seed {
  padding: 32px;
  font-family: var(--font-body);
  max-width: 480px;
}

.seed__title { font-size: 24px; margin-bottom: 8px; }
.seed__section { margin-bottom: 32px; }
.seed__hint { color: var(--color-text-muted); font-size: 14px; }
.seed__status--ok    { color: var(--color-accent-teal); font-weight: bold; }
.seed__status--error { color: var(--color-error); }
.seed__btn          { padding: 12px 24px; border-radius: 8px; border: 0; cursor: pointer; }
.seed__btn--admin   { background: var(--blue-500); color: #fff; }
.seed__btn--member  { background: var(--blue-400); color: #fff; }
```

Y `SeedPage.tsx` queda mucho más legible:

```tsx
<div className="seed">
  <h1 className="seed__title">Seed de datos de demo</h1>
  ...
  <button className="seed__btn seed__btn--admin" onClick={handleSeed}>
    Crear datos de demo
  </button>
```

### 💡 Aprendizaje

**Las reglas internas valen lo que su cumplimiento.** Una regla escrita en `.claude/rules/` no es decoración: es contrato. La forma sana de gestionarlas es:

1. Si la regla aplica → cumplirla.
2. Si hay excepción legítima → documentarla en la propia regla *(como ya hacéis con «estilos calculados dinámicamente»)*.
3. Si la regla ya no tiene sentido → cambiarla, pero conscientemente.

Lo que no funciona es dejar incumplimientos sueltos: erosionan la confianza en todas las reglas a la vez.

---

## 6. `Home.tsx` es un placeholder con clave i18n legacy

### Qué pasa

```tsx
// src/pages/home/Home.tsx
const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <header className="toolbar">
        <h1>{t("bienvenida")}</h1>
        <button onClick={logout}>{t("buttons.logout")}</button>
      </header>
    </div>
  );
};
```

Dos cosas:

1. La clave `bienvenida` está en `common.json` en raíz, sin namespace. Es la última clave del proyecto que no sigue el patrón `namespace:section.key`. Quedó del primer prototipo.
2. La página entera parece un placeholder — solo un saludo + logout. En `AppRoutes`, `/home` solo se usa como destino tras login en algunos casos; la mayoría va a `/events`.

### Por qué importa

`Home` puede estar inacabada por motivos válidos (todavía no hay diseño de feed), pero **el `<h1>{t("bienvenida")}</h1>` es lo primero que ve un usuario verificado cuando entra**. Si entra a `/home` directamente (refrescando F5 desde otra pantalla, por ejemplo), aterriza en una pantalla con un título y un botón de cerrar sesión. Sin contexto.

Y la clave `bienvenida` es el último resto del proyecto pre-i18n. Lo limpio sería retirarla.

### Cómo lo arregláis

**Si Home aún no tiene diseño:**

```tsx
// Redirigir como las otras rutas ambiguas
<Route path="/home" element={<Navigate to="/events" replace />} />
```

Y si lo dejáis activo, al menos mover la clave a un namespace:

```json
// src/locales/es/common.json
{
  "home": {
    "welcome": "Bienvenido a Applec"
  }
}
```

```tsx
const { t } = useTranslation("common");
<h1>{t("home.welcome")}</h1>
```

Y borrar la clave plana `"bienvenida": "..."` en ambos idiomas. Vuestro test `i18n.test.ts` os avisará si dejáis alguna inconsistencia.

### 💡 Aprendizaje

**Las páginas placeholder son deuda visible, no técnica.** Cualquier persona que entre por error a `/home` saca conclusiones del estado del producto. Mejor un `Navigate` honesto que una pantalla con tres elementos sin diseño. Y los restos del prototipo (claves planas, comentarios obsoletos, archivos `OLD_*`) merecen su PR de limpieza una vez al mes.

---

## 7. `Input.tsx` declara `required` pero no lo usa

### Qué pasa

```tsx
// src/ui-kit/input/Input.tsx
interface InputProps {
  // ...
  required?: boolean;
  optional?: boolean;
  // ...
}

const Input = ({
  // ...
  optional,         // ← sí destructured
  endIcon,
  multiline = false,
}: InputProps) => {
  // `required` nunca aparece dentro del componente
```

`required` está declarado en el `interface` pero nunca se destructura ni se usa en el render. Lo siguen pasando los consumidores (login, register, forgot-password) sin que pase nada.

Es **dead code** silencioso: TypeScript no se queja porque la interfaz lo declara como opcional.

### Por qué importa

Componente sin contrato fiable. Un día alguien va a leer el código pensando que pasar `required` activará una validación HTML — y se va a llevar una sorpresa cuando descubra que el flag no hace nada.

Además, **falta el atributo nativo `required` en el `<input>`**, que ayudaría a la a11y (los lectores de pantalla anuncian campos required).

### Cómo lo arregláis

Decidir qué quiere significar la prop, y hacerla coherente:

```tsx
const Input = ({
  label,
  required = false,
  optional,
  // ...
}: InputProps) => {
  // ...
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
        {optional && <span className="field__optional"> ({t("fields.optional")})</span>}
      </label>
      <div className="field__input-wrapper">
        <input
          id={id}
          type={type}
          required={required}
          aria-required={required || undefined}
          placeholder={placeholder}
          {...registration}
        />
        ...
```

Y si la conclusión es que no hace falta porque ya validáis con react-hook-form, entonces **borrad la prop** del interface — que el TypeScript falle en los call sites es la forma sana de descubrir dónde se usaba.

### 💡 Aprendizaje

**Las props no usadas son mentiras del API.** Cada `?` en una `interface` es una promesa: «si me pasas esto, tendrá efecto». No cumplirla ensucia la confianza en todos los demás componentes. Cuando refactoricéis algo, **comprobad siempre si lo que quitáis está limpio en la interfaz pública** — props que ya no hacen nada, exports que nadie importa, archivos `.scss` huérfanos.

---

## 8. Deuda técnica de herramientas — repaso anual

### Qué pasa

Cosas que arrastráis desde abril y que conviene mantener en el radar:

| Cosa | Estado | Urgencia |
|---|---|---|
| `react-scripts` 5.0 | sin mantener desde 2022 | baja |
| `typescript` 4.1.3 | de finales de 2020 — 5 años atrás | media |
| `workbox-*` (11 paquetes) | la PWA está `unregister()`-ed pero los deps siguen | baja |
| `npm audit`: 37 vulns | 1 critical + 20 high, todas transitivas | irrelevante a usuario, ruidoso |

### Por qué importa

Ninguna de estas cosas afecta al usuario final: todas son de build-time. **Pero crecen con el tiempo y un día tendréis que migrar todo a la vez.** Una hora cada dos o tres meses ahora os ahorra una semana entera dentro de un año.

Además, `typescript` 4.1 os impide usar features modernas (`satisfies`, `using`, mejoras de inferencia, plantillas mejoradas en error messages) que ya son habituales.

### Cómo lo arregláis

Sin prisa, pero con calendario:

1. **Limpieza gratis ahora** (15 min):
   ```bash
   npm uninstall workbox-background-sync workbox-broadcast-update workbox-cacheable-response \
     workbox-core workbox-expiration workbox-google-analytics workbox-navigation-preload \
     workbox-precaching workbox-range-requests workbox-routing workbox-strategies workbox-streams
   ```
   Y borrad `src/service-worker.ts` y `src/serviceWorkerRegistration.ts`. Volved a correr `npm audit` para ver cuántas vulns caen.

2. **Subir TypeScript** (probable, 1 h):
   ```bash
   npm install --save-dev typescript@latest
   npx tsc --noEmit
   ```
   CRA 5 acepta TS 5.x sin pelearse. Algunos types se pueden quejar — id resolviendo.

3. **Plan de migración a Vite** (decisión, no acción): pensad cuándo dais el salto. Es un día de trabajo y os resuelve la mayoría de las vulnerabilidades de un saque. Probablemente cuando entreguéis el MVP.

### 💡 Aprendizaje

**Las dependencias envejecen aunque vuestro código no cambie.** Costumbre sana: el primer lunes de cada mes, `npm outdated` + `npm audit` + sentaos a leer los release notes de las cosas mayores. No actualizar nada — solo saber dónde estáis. Las decisiones se toman con información, no con presión.

---

## 9. `/members` se renderiza con fondo negro

### Qué pasa

Al navegar a `/members` (con cualquiera de las dos cuentas), la página se monta dentro del `MainLayout` con `TopBar` arriba y `TabBar` abajo… pero **el área central es completamente negra**. Las `MemberCard` flotan sobre ese negro, los chips ganan contraste pero el placeholder del input «Buscar miembro…» se vuelve casi ilegible.

En `/events` no pasa, porque la página llama a:

```tsx
// src/pages/events/events-list/EventsListPage.tsx:32
useLayoutBackground(profile?.role);
```

Ese hook pinta el `body` con un gradient pastel según el rol. **`MembersPage` no llama al hook**, así que la página hereda el `--background` por defecto del `body` (que en vuestra paleta semántica es oscuro porque arrastrasteis del primer prototipo).

Captura: `.audit-v2/auth-03-members-admin.png`.

### Por qué importa

Es una inconsistencia visual que el usuario nota inmediatamente. Lo que **enseña** es algo más grande: «el fondo de la página no es de la página, es de la app». Si dependéis de un hook que cada página tiene que recordar llamar, **es fácil olvidarlo en la siguiente** — exactamente como ha pasado aquí.

Y el problema secundario (el placeholder «Buscar miembro…» con bajo contraste sobre el oscuro) es **un fallo de a11y oculto**: Lighthouse no lo pilla porque sólo escanea la landing, pero un test manual con axe DevTools en `/members` sí lo marcaría.

### Cómo lo arregláis

Hay dos formas, según vuestra preferencia de arquitectura:

**Opción A — llamar al hook desde `MembersPage`** (mínimo cambio):

```tsx
// src/pages/members/members-list/MembersPage.tsx
import useLayoutBackground from "../../../hooks/useLayoutBackground";
// ...
const MembersPage = () => {
  const { profile } = useAuthContext();
  useLayoutBackground(profile?.role);   // ← una línea
  // ...
```

**Opción B — mover la responsabilidad al `MainLayout`** (mejor a largo plazo): hacer que el layout sea quien aplica el gradient, y las páginas ya no tengan que recordar nada.

```tsx
// src/components/layout/MainLayout.tsx
const MainLayout = ({ children }) => {
  const { profile } = useAuthContext();
  useLayoutBackground(profile?.role);
  return (
    <div className="main-layout">
      <TopBar />
      <div className="main-layout__content">{children}</div>
      <TabBar />
    </div>
  );
};
```

Y entonces se borra el `useLayoutBackground` de `EventsListPage` (y de cualquier otra página que lo llame). Lo del Layout lo cubre todo.

### 💡 Aprendizaje

**Lo que no está en el layout, hay que recordarlo en cada hoja.** Como regla práctica: cuando un comportamiento se repite en 3+ páginas, sube al layout. Si solo aplica a una página, déjalo donde está. El umbral mágico no es «cuando se repite por segunda vez» (premature abstraction), sino «cuando olvidarlo causa un bug visible» — y aquí ya pasó.

---

## 10. `/events/:id/edit` no muestra los valores prefilled (bug visual crítico)

### Qué pasa

Como admin, al entrar a editar el evento «Taller de Pirotècnia», los inputs `Nombre del evento`, `Descripción` y `Lugar` **se ven completamente vacíos**. Captura: `.audit-v2/auth-15-edit-event-admin.png`.

Pero el árbol de accesibilidad de Chrome **sí ve los valores correctos**:

```
textbox "Nombre del evento" value="Taller de Pirotècnia"
textbox "Descripción (opcional)" value="Taller per aprendre els secrets de la pirotècnia valenciana."
textbox "Lugar" value="Carrer de la Pau, 12, València"
```

Es decir: **el texto está, pero no se ve**. Lo que el a11y tree «sí ve» es lo que confirma React Hook Form: los `defaultValues` se aplican. El problema es puramente visual.

Lo más probable es que `EditEventPage` esté usando `<Input>` con algún wrapper SCSS que pone `color: var(--white)` o `color: transparent` cuando hay valor prefilled, o que `useReducer` esté arrancando el estado vacío y la hidratación posterior pinte el texto con un color heredado mal calculado. Sin tocar el código no puedo asegurarlo, pero el síntoma es inequívoco.

> Pequeña duda metodológica: este bug **no aparece en Lighthouse**, no aparece en el Issues panel, no aparece en consola. Solo se ve **mirando la pantalla**. Lo descubrí gracias al recorrido visual con login. Es exactamente la clase de problema que la auditoría automática no atrapa.

### Por qué importa

Un admin abre el editor, ve **el formulario vacío** y piensa: «¿debo escribirlo todo de nuevo?». Posibles caminos del usuario, todos malos:

- Reescribe el nombre y guarda → **pisa el dato anterior**, o lo reemplaza con algo más corto.
- Pulsa «Cancelar» dudando si ha tocado algo.
- Reporta «no se puede editar».

En todos los casos pierde confianza en el botón **«Guardar cambios»**. Es el clásico bug que produce miedo a tocar.

### Cómo lo arregláis

El primer paso es reproducirlo y diagnosticarlo. Sugerencia ordenada:

1. Inspector → seleccionar el `<input>` de `Nombre del evento` → **comprobar el `value` en el DOM** (no en el a11y tree).
2. Si el value DOM está correcto → el bug es **CSS** (color). Mirad la cascada del `color` para `.field__input` en el contexto de `EditEvent` — quizá hereda de un padre con `color: var(--color-surface)` o algo similar.
3. Si el value DOM está vacío → el bug es **estado**: `register("name", { value: event.name })` no se está aplicando, o `useReducer` está vaciando el estado en cada render.

Mi corazonada, vista la página dibujada, es la primera: CSS. Casi seguro hay una regla específica para el form en edición que pisa el color del texto.

Mientras investigáis, una mitigación rápida en SCSS:

```scss
// src/pages/events/edit-event/edit-event.scss
.edit-event .field__input {
  color: var(--color-text-primary);  // forzar el color visible
}
```

### 💡 Aprendizaje

**Un valor que se anuncia pero no se ve es peor que un valor ausente.** El a11y tree puede mentirte sobre la experiencia: una pantalla *invisible para los ojos* puede ser perfectamente accesible para un lector. Por eso una auditoría completa siempre incluye **una pasada con humano mirando la pantalla**, además de los tests automatizados.

Y como hábito de equipo: cuando un PR toca un formulario con `defaultValues` / `setValue`, el reviewer debería abrir la pantalla en local antes de aprobar. Un screenshot en el PR vale más que mil checks verdes.

---

## 11. «Hours Hours» — la etiqueta del input de tiempo está duplicada

### Qué pasa

Al entrar a `/events/:id/edit`, Chrome registra un issue en el panel `Issues`:

```
No label associated with a form field (count: 1)
```

Mirando el a11y tree, los `<input type="time">` exponen sus controles internos así:

```
InputTime "Hora de inicio" value="17:00"
  spinbutton "Hours Hours" value="17" valuemax="23" valuemin="0" valuetext="17"
  StaticText ":"
  spinbutton "Minutes Minutes" value="0" valuemax="59" valuemin="0" valuetext="00"
```

«Hours Hours», «Minutes Minutes». La etiqueta accesible está duplicada en cada spinbutton.

Esto suele pasar cuando un `<input type="time">` recibe **`aria-label`** + un **`<label htmlFor>`** asociado **+ una invocación del componente con prop label**. El navegador concatena las etiquetas y el spinbutton interno la hereda dos veces.

### Por qué importa

Para un usuario con lector de pantalla, oír «Hora de inicio, horas horas, 17, 17 de 23» en lugar de «Hora de inicio, horas, 17 de 23» no es un fallo grave — se entiende. Pero es la diferencia entre «esta app está cuidada» y «esta app tiene rebabas». Y es justo el tipo de detalle que se acumula si no se ataja a tiempo.

### Cómo lo arregláis

Lo más probable: en el `<Input>` de tipo `time` se está pasando tanto el `label` (que dentro de `Input.tsx` genera un `<label htmlFor>`) **como** un `aria-label` extra, o el wrapper duplica el texto. Mirad el componente concreto donde se rendea el time picker — los candidatos son los `step2` y `step3` del `CreateEvent` y el `EditEvent`.

Patrón seguro:

```tsx
// Si usáis vuestro Input:
<Input id="event-start" label={t("create.startTime")} type="time" registration={register("startTime")} />
// y dentro de Input.tsx, el <input> NO debe llevar aria-label adicional
```

Verificadlo abriendo Chrome DevTools → seleccionar el `<input type="time">` → pestaña «Accessibility» → mirar «Name source». Si veis dos fuentes contribuyendo al nombre, ahí está el problema.

### 💡 Aprendizaje

**El Issues panel de Chrome DevTools es vuestro amigo silencioso.** Lighthouse audita en navegación; Issues vigila mientras navegáis. Vale la pena dejarlo abierto durante una sesión normal de uso de la app — encontraréis cosas que Lighthouse no detecta porque solo aparecen en flujos concretos. Este issue, por ejemplo, no aparece en `/landing` ni en `/login`: solo cuando entráis a editar un evento.

---

## 📋 Plan de acción sugerido

Mucho más corto que el del informe anterior — la mayoría son cosas de < 30 min.

### 🔴 Semana 0 — apagar los dos fuegos visibles

- [ ] **Sección 10:** investigar y arreglar el texto invisible en `/events/:id/edit`. Es el bug más grave de toda esta auditoría. *(30 min de diagnóstico + el fix que toque)*
- [ ] **Sección 11:** quitar la duplicación de label en los `<input type="time">`. *(15 min)*

### 🟢 Semana 1 — el último 8% de Lighthouse

- [ ] **Sección 1:** subir el contraste del botón secundario (3 opciones, elegid una). *(20 min)*
- [ ] **Sección 2:** convertir `MemberCard` a `<button>` o añadir `tabIndex` + `onKeyDown`. *(30 min)*
- [ ] **Sección 3:** arreglar los 3 warnings que rompen `CI=true`. *(15 min)*
- [ ] **Re-correr Lighthouse** y vigilar que a11y suba a 95+ y el botón ya no aparezca.

### 🟡 Semana 2 — coherencia con vuestras propias reglas

- [ ] **Sección 4:** decidir qué hacer con `/feed`, `/events/calendar`, `/profile` (esconder, placeholder o implementar).
- [ ] **Sección 5:** migrar `SeedPage` a SCSS para cumplir vuestra regla `scss-bem.md`.
- [ ] **Sección 6:** decidir destino de `Home.tsx` y limpiar la clave `bienvenida`.
- [ ] **Sección 7:** decidir si `Input.required` se implementa o se borra.

### 🟣 Semana 3 — mantenimiento de herramientas y consistencia visual

- [ ] **Sección 8:** limpieza de `workbox-*` + subida de TypeScript.
- [ ] **Sección 9:** mover `useLayoutBackground` al `MainLayout` (recomendado) o llamarlo desde `MembersPage` (mínimo).
- [ ] **Hallazgo visual 4:** rellenar el hueco del `EventDetail` para miembro con algún resumen útil (su respuesta, sus acompañantes, deadline…).
- [ ] **Hallazgo visual 5:** elipsis sobre `relationship` en `MemberCard` linked.
- [ ] Conversación sobre migración a Vite (decisión, no acción).

---

## 🎓 Recursos para profundizar

- **WebAIM · Contrast Checker** — [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/). Imprescindible para la sección 1.
- **axe DevTools (extensión Chrome)** — detecta el 40-60% de problemas de a11y automáticamente. Pasadla antes de cada PR.
- **The A11y Project · Checklist** — [a11yproject.com/checklist](https://www.a11yproject.com/checklist/). Cortita, accionable.
- **MDN · Keyboard-navigable JavaScript widgets** — [developer.mozilla.org](https://developer.mozilla.org/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets). Justo para la sección 2.
- **web.dev · Learn Performance** — curso oficial gratis. Ya tenéis CLS 0.00, ahora a por LCP < 2.5 en mobile real.
- **TypeScript 5 — what's new** — [typescriptlang.org/docs/handbook/release-notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html). Para cuando hagáis la subida de la sección 8.
- **CRA → Vite migration** — [vite.dev/guide/migration-from-cra](https://vite.dev/guide/migration-from-cra). Concreto y sin paja.

---

## ✨ Cierre

Hace un mes os dije «partís de una base muy sólida» y os dejé un informe de **16 secciones**. Hoy os dejo uno de **8**, casi todas pulidos finos, y casi cada apartado del anterior tiene un commit con su nombre y apellidos en `git log`.

Lo más impresionante no es que hayáis arreglado todo: es **cómo** lo habéis arreglado. Habéis convertido cada lección en una regla escrita (`accessibility.md`, `services-pattern.md`, `scss-bem.md`, `component-patterns.md`) y un test (`i18n.test.ts`, `routes.test.tsx`). Eso significa que el aprendizaje no vive en vuestra memoria, vive en el repo — y se va a aplicar a las features que aún no habéis empezado.

El gran salto cualitativo de esta iteración no es el +3 en accesibilidad ni el +9 en SEO. Es que el proyecto **ya tiene anticuerpos**: tests que protegen, reglas que documentan, contextos memoizados, lazy loading que escala, ErrorBoundary que resiste, security rules que defienden. La estructura sostiene. Cuando añadáis las pantallas de feed, calendar y profile encima, la calidad **se va a heredar**, no se va a improvisar.

Las 11 secciones de hoy son mayormente detalles, salvo las dos últimas: el texto invisible del editor de eventos (sección 10) es la única cosa que merece atención «ahora mismo». Si os dedicáis primero a esas dos y luego dos tardes de un viernes al resto del plan, en menos de un mes os ponéis en ≥ 95 en todas las categorías de Lighthouse, las pestañas del tab bar van a sitios reales, y la app se ve coherente vaya el usuario por donde vaya. Y ahí sí podéis enseñar el proyecto en una entrevista sin disculparos por nada.

Seguid así, fallers 🪅

---

<sub>*Auditoría generada con Chrome DevTools MCP + Lighthouse + Vitest + npm audit. Los informes HTML completos están en `.audit-v2/lighthouse-desktop/report.html` y `.audit-v2/lighthouse-mobile/report.html`. El trace de performance en `.audit-v2/trace.json`. Las capturas del recorrido visual (públicas + autenticadas como admin + autenticadas como miembro) están en `.audit-v2/page-*.png` y `.audit-v2/auth-*.png`. La auditoría anterior (21 abril) está stasheada como `stash@{1}` por si queréis verla en paralelo.*</sub>
