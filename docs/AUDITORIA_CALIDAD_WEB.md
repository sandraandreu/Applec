# Auditoría de calidad web — Applec (Falles App)

> **Fecha:** 21 de abril de 2026
> **Rama auditada:** `developer` · commit `9a00915`
> **URL local:** http://localhost:3000 (Create React App, no Vite, os lo cuento en la sección 1)
> **Herramientas usadas:** Chrome DevTools MCP · Lighthouse (desktop + mobile) · performance trace · `npm audit` · `npm run build` · revisión estática del código

> **Nota de la iteración (21/04/2026, segunda pasada).**
> En la primera pasada, Lighthouse medía el overlay de error de CRA porque la app no renderizaba (los detalles están en la sección 1). Para poder daros métricas de verdad, se aplicaron **en local — sin commit — dos ajustes mínimos**:
> 1. `src/App.tsx:3` → `./routes/AppRoutes/AppRoutes` (A mayúscula).
> 2. Renombre de `src/pages/home/Home.scss` → `home.scss` (minúscula, respetando vuestra propia convención de kebab-case).
>
> El fix oficial lo hacéis vosotros en vuestro PR. Los cambios locales están **fuera del índice de git** (`git status` os lo confirma). Tratad la sección 1 como la lección principal.

---

## Antes de empezar: vuestro punto de partida

Antes de entrar en lo que se puede pulir, quiero que veáis todo lo que ya hacéis bien. Esto no es relleno: son decisiones de arquitectura que muchos proyectos «de verdad» no tienen.

1. **BEM consistente en todo el SCSS.** `.member-card__info`, `.members-page__filter-btn--active`… se ve un criterio sostenido, no improvisación.
2. **Separación `ui-kit/` vs `components/` vs co-ubicación en la página.** Es exactamente la convención que recomendamos en clase, y la estáis respetando.
3. **i18n bien montado con namespaces** (`auth`, `groups`, `members`, `onboarding`, `common`) y los dos idiomas (`es`, `ca`) en paralelo.
4. **Formularios con `react-hook-form`** en todas las pantallas de auth y grupos, validación declarativa, no `useState` por campo.
5. **Firebase centralizado en `src/plugins/firebase.ts`** y los servicios consumen esa instancia única. Nada de `getAuth()` suelto por ahí.
6. **Contextos bien separados**: `AuthContextProvider` y `GroupContextProvider`, con estados de carga explícitos (`isLoading`).
7. **Guardas de ruta** (`PrivateRoutes` / `PublicRoutes`) que redirigen según sesión, verificación de email y existencia de grupo. Es un patrón correcto.
8. **`<dialog>` nativo en `Alert.tsx`** con `showModal()` y `close()`. Elegisteis el elemento semántico adecuado en vez de un div hecho a mano.
9. **`Input.tsx` con `<label htmlFor={id}>`** correctamente asociado. Esto es accesibilidad silenciosa que mucha gente rompe.
10. **StyleGuide interna (`/style-guide`)** — tener una página donde ver el UI kit renderizado es oro puro.
11. **TypeScript estricto de verdad**: cero `any`, cero `as any` en todo `src/`. En serio, esto es raro de ver en proyectos de estudiantes.
12. **Conventional Commits** en el historial (`feat(groups):`, `fix(routes):`, `style(onboarding):`…). Se ve disciplina.

Partís de una base muy sólida. Lo que viene a continuación son pulidos, no reconstrucciones.

---

## Lighthouse, scores actuales

Dos tablas: **antes** y **después** del fix local de la sección 1. Guardad las dos, porque la comparación es más didáctica que cualquiera por separado.

### Reporte

| Categoría         | Desktop | Mobile | Auditorías falladas                                                                                                  |
|-------------------|---------|--------|-----------------------------------------------------------------------------------------------------------------------|
| Accesibilidad     | **89**  | **89** | `color-contrast`, `landmark-one-main`                                                                                 |
| Mejores prácticas | **77**  | **73** | `third-party-cookies`, `inspector-issues`                                                                             |
| SEO               | **91**  | **91** | `meta-description`                                                                                                    |
| *(solo mobile)*   | —       | —      | `image-size-responsive`                                                                                               |

### Performance trace

| Métrica | Valor   | Umbral «bueno» | Estado                     |
|---------|---------|----------------|----------------------------|
| **LCP** | 345 ms  | < 2 500 ms     | ✅ excelente                |
| **CLS** | 0.15    | < 0.10         | ⚠️ «needs improvement»      |
| TTFB    | 6 ms    | —              | —                          |



---

## Cómo leer este documento

Cada sección sigue siempre el mismo esquema:

- **Qué pasa** — descripción del patrón y un fragmento real de vuestro código.
- **Por qué importa** — el porqué didáctico. No «está mal», sino «qué aprendéis al entenderlo».
- **Cómo lo arregláis** — el código concreto copy-pasteable.
- **Aprendizaje** — la regla mental que vale para este proyecto **y para los próximos 10 que hagáis**.

Las secciones están **ordenadas por valor didáctico**, no por severidad técnica. Entender por qué un `<a href="/home">` rompe una SPA os servirá más tiempo que parchear una vulnerabilidad transitiva de una dependencia.

---

## 1. El build falla en CI: rutas con mayúsculas distintas

### Qué pasa

Al ejecutar `npm run build` (producción) **el compilador se detiene** y el dev server muestra el overlay rojo de CRA:

```
TS1261: Already included file name
  '.../src/routes/appRoutes/AppRoutes.tsx'
  differs from file name '.../src/routes/AppRoutes/AppRoutes.tsx'
  only in casing.
```

En realidad hay dos bugs del mismo tipo, uno descubierto tras arreglar el otro:

**1º — `src/App.tsx:3`:**

```tsx
import AppRoutes from "./routes/appRoutes/AppRoutes";
//                           ^^^^^^^^^ carpeta real: 'AppRoutes'
```

**2º — `src/pages/home/Home.tsx:1`:**

```tsx
import "./home.scss";
// archivo real en disco: 'Home.scss' (H mayúscula)
```

El segundo no apareció en el primer intento porque el primero hacía que ni se llegara a cargar la ruta de Home. Al corregir `App.tsx`, Webpack pudo resolver Home y ahí saltó el segundo. **Son bugs en cadena, muy típicos del case-sensitivity.**

En Windows y macOS (APFS por defecto), el sistema de ficheros es **case-insensitive**: `appRoutes` y `AppRoutes` son el mismo directorio, así que no notáis nada en vuestra máquina. Pero **CI y Linux sí distinguen mayúsculas**, y CRA lleva activado el `case-sensitive-paths-webpack-plugin` justamente para atrapar esto antes de desplegar.

### Por qué importa

Esto es la **clásica bomba de tiempo** que pasa local, se mergea, y explota en el pipeline de despliegue a las 7 de la tarde un viernes. Los bugs no están en ningún servicio ni en ninguna lógica: están en una letra mayúscula, dos veces. Y justo por eso son tan interesantes como caso: os enseñan que **«funciona en mi máquina» no es un estándar de calidad**, y que los errores de casing vienen en familia — corregir uno suele destapar otro.

### Cómo lo arregláis

En el PR real, aplicáis estos dos cambios:

```tsx
// src/App.tsx
import AppRoutes from "./routes/AppRoutes/AppRoutes";
//                           ^^^^^^^^^^ coincide con la carpeta en disco
```

Y renombráis el SCSS de la página Home para que siga vuestra propia convención de **kebab-case minúsculas** (tal y como dice `.claude/rules/scss-bem.md`):

```bash
git mv src/pages/home/Home.scss src/pages/home/home.scss
```

> En sistemas case-insensitive, `git mv` es el único método fiable para renombrar mayúsculas/minúsculas: un `mv` normal ni siquiera detecta el cambio. Si no usáis `git mv`, el truco es renombrar primero a un nombre intermedio (`_tmp.scss`) y luego al definitivo.

Y para blindaros para el futuro, en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

### 💡 Aprendizaje

**Los imports son strings que viajan a otro sistema de ficheros.** Acostumbraos a copiar el nombre exacto de la carpeta (o mejor: dejad que el autoimport del editor los escriba). Cuando hagáis PRs, mirad siempre el log del pipeline CI, no solo el resultado local. Y cuando encontréis un typo de casing, **buscad todos los demás al mismo tiempo** — nunca vienen solos.

---

## 2. `<html lang="en">` en una app bilingüe es-CA

### Qué pasa

En `public/index.html`:

```html
<html lang="en">
```

Pero la app arranca en español (`fallbackLng: "es"`) y ofrece catalán como segundo idioma. El `lang="en"` **nunca** refleja la realidad.

### Por qué importa

`<html lang>` no es decorativo. Los lectores de pantalla (VoiceOver, NVDA) cambian la voz y la pronunciación según este atributo. Con `lang="en"`, un VoiceOver leerá «Iniciar sesión» con acento inglés. Google también lo usa como señal de SEO para saber a qué audiencia servir la página.

Como vuestra app es bilingüe en runtime, el valor correcto no es fijo: debe sincronizarse con i18next.

### Cómo lo arregláis

Opción simple: poner un valor por defecto honesto en el HTML…

```html
<!-- public/index.html -->
<html lang="es">
```

…y actualizarlo dinámicamente cuando cambie el idioma, dentro de `src/plugins/i18n.ts`:

```ts
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});
```

### 💡 Aprendizaje

**Los atributos del `<html>` también son estado de la aplicación.** Si algo del usuario cambia (idioma, tema, modo oscuro), hay que actualizarlos. Cualquier cosa renderizada fuera de React (incluido `<html>`, `<title>`, `<meta>`) sigue necesitando mantenimiento.

---

## 3. Navegación con `<a href>` en vez de `<Link>`

### Qué pasa

En `LoginPage`, `RegisterPage` y `ForgotPasswordPage` tenéis enlaces internos hechos así:

```tsx
// src/pages/auth/login/LoginPage.tsx:130
<a className="login-page__forgot margin-buttom48px" href="/forgot-password">
  {t("login.forgotPassword")}
</a>

// src/pages/auth/register/RegisterPage.tsx:260-262
<a href="/privacy">{t("register.termsPrivacy")}</a>
<a href="/terms">{t("register.termsConditions")}</a>
```

Y en otros cinco sitios más.

### Por qué importa

Un `<a href="/foo">` dentro de una SPA **hace un full reload del navegador**: se descarga HTML de nuevo, se reinstancia React, se reinicializan los contextos de Auth y Group, y la URL pega un parpadeo. Con `<Link>` de React Router, solo cambia lo que React necesita repintar.

Resumiendo: estáis saliendo y volviendo a entrar a la app cada vez que pulsáis «Recuperar contraseña».

Bonus: `/privacy` y `/terms` no existen como rutas. Son enlaces muertos. Si alguien los pulsa hoy, va a aterrizar en `Navigate to="/landing"` y el usuario no entenderá por qué ha vuelto al inicio.

### Cómo lo arregláis

```tsx
import { Link } from "react-router-dom";

<Link to="/forgot-password" className="login-page__forgot margin-buttom48px">
  {t("login.forgotPassword")}
</Link>
```

Y en los legales, hasta que creéis las páginas, dejad claro que son externos (o definid las rutas):

```tsx
<a href="https://applec.com/privacy" target="_blank" rel="noopener noreferrer">
  {t("register.termsPrivacy")}
</a>
```

### 💡 Aprendizaje

**`<a href>` para salir de la app; `<Link to>` para moverse dentro.** Regla mental: si el destino es una ruta declarada en `AppRoutes.tsx`, usáis `<Link>`. Si va a otro dominio, `<a>`.

---

## 4. Un `<a>` sin `href` usado como botón

### Qué pasa

En `src/pages/groups/invite-group/InviteGroupPage.tsx:61`:

```tsx
<a className="invite-group__skip" onClick={() => navigate("/home")}>
  {t("invite.skip")}
</a>
```

Un ancla sin `href` pierde muchas cosas: no aparece en la tab order, los lectores de pantalla no la anuncian como enlace, no se puede abrir con Enter, y el cursor ni siquiera cambia a «mano».

### Por qué importa

Este patrón existe porque visualmente un botón primario «Saltar» no quedaba bien. La tentación de maquillarlo con un `<a>` es grande. Pero la semántica HTML no es una decisión estética, es una **promesa al navegador** de qué hace cada elemento. Romper esa promesa deja fuera a usuarios de teclado y de lectores de pantalla.

### Cómo lo arregláis

Si es navegación interna, `<Link>`:

```tsx
<Link to="/home" className="invite-group__skip">
  {t("invite.skip")}
</Link>
```

Si preferís mantener un estilo tipo «link fantasma», usad un `<button type="button">` y estilizadlo en SCSS:

```tsx
<button
  type="button"
  className="invite-group__skip invite-group__skip--link"
  onClick={() => navigate("/home")}
>
  {t("invite.skip")}
</button>
```

```scss
.invite-group__skip--link {
  appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--color-link);
  text-decoration: underline;
}
```

### 💡 Aprendizaje

La etiqueta HTML es semántica, no es una excusa para el estilo. Botón = acción; enlace = destino.

---

## 5. Botones-icono sin `aria-label`

### Qué pasa

Varios botones no tienen texto visible y tampoco texto accesible:

```tsx
// src/ui-kit/icons/BackButton.tsx:7
<button className="back-button" type="button" onClick={() => navigate(-1)}>
  <svg>...</svg>
</button>

// src/ui-kit/icons/EyeToggleIcon.tsx:8
<button type="button" onClick={onToggle}>
  <svg>...</svg>
</button>
```

Y el `Search.tsx` tiene un `<input>` sin `<label>` ni `aria-label`:

```tsx
// src/ui-kit/search/Search.tsx:32
<input className="search__input" type="text" placeholder={placeholder} onChange={...} />
```

### Por qué importa

Para un usuario con lector de pantalla, `BackButton` se lee literalmente como «botón». No «atrás», no «volver»: **botón**, a secas. Imaginad navegar la app con los ojos cerrados y que cada acción se anuncie solo como «botón, botón, botón». Es exactamente esa experiencia.

El `placeholder` de un input **no sustituye al label**: desaparece cuando escribes y los lectores de pantalla lo tratan como texto decorativo, no como nombre del campo.

### Cómo lo arregláis

```tsx
// BackButton.tsx
<button
  type="button"
  className="back-button"
  aria-label={t("common:actions.back")}
  onClick={() => navigate(-1)}
>
  <svg aria-hidden="true">...</svg>
</button>

// EyeToggleIcon.tsx
<button
  type="button"
  aria-label={showPassword ? t("common:actions.hidePassword") : t("common:actions.showPassword")}
  aria-pressed={showPassword}
  onClick={onToggle}
>
  <svg aria-hidden="true">...</svg>
</button>

// Search.tsx
<label className="search">
  <span className="visually-hidden">{placeholder}</span>
  <svg aria-hidden="true">...</svg>
  <input className="search__input" type="search" placeholder={placeholder} onChange={...} />
</label>
```

Y la clase `.visually-hidden` en vuestro SCSS global:

```scss
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 💡 Aprendizaje

**Si un elemento interactivo no tiene texto visible, necesita texto accesible.** Dos reglas mentales:
- Iconos decorativos → `aria-hidden="true"` (para que el lector los ignore).
- Acción sin texto → `aria-label` describiendo lo que hace, no lo que es.

---

## 6. Typo silencioso en `i18n.ts`

### Qué pasa

En `src/plugins/i18n.ts`:

```ts
const resources = {
  es: { common: esCommon, auth: esAuth, onboarding: esOnboarding, groups: esGroups, members: esMembers },
  ca: { common: caCommon, auth: caAuth, onboarding: caOnboarding, groups: caGroups, mmembers: caMembers },
  //                                                                               ^^^^^^^^ typo
};

i18n.init({
  ns: ["common", "auth", "onboarding", "groups"],
  //  falta "members"
});
```

Dos detalles minúsculos con consecuencia grande: en catalán, el namespace de miembros se registra como `mmembers` (con doble m) — así que cuando el idioma está en `ca`, **ninguna traducción de miembros carga** y se muestran las claves en crudo. Y el namespace `members` ni siquiera está en el array `ns`, así que i18next no lo precarga.

### Por qué importa

Los bugs silenciosos son peores que los ruidosos: no generan un error en consola, solo degradan sutilmente la experiencia para una parte concreta de usuarios (en este caso, quien tenga el navegador en catalán y entre a la pantalla de miembros). Son el tipo de bug que acaba reportado como «la app se ve rara a veces».

### Cómo lo arregláis

```ts
const resources = {
  es: { common: esCommon, auth: esAuth, onboarding: esOnboarding, groups: esGroups, members: esMembers },
  ca: { common: caCommon, auth: caAuth, onboarding: caOnboarding, groups: caGroups, members: caMembers },
};

i18n.init({
  ns: ["common", "auth", "onboarding", "groups", "members"],
  // resto igual
});
```

Para protegeros en el futuro, un test tontito vale una tarde de debug:

```ts
// src/plugins/__tests__/i18n.test.ts
it("debería tener los mismos namespaces en es y ca", () => {
  expect(Object.keys(resources.es).sort()).toEqual(Object.keys(resources.ca).sort());
});
```

### 💡 Aprendizaje

**Cualquier estructura que se duplica (es/ca, dev/prod, light/dark) merece un test de paridad.** Si cambia uno y el otro no, queréis enteraros en el PR, no por un ticket de soporte tres meses después.

---

## 7. `console.error` dentro de los `catch` de los servicios

### Qué pasa

Casi todos los servicios siguen este patrón:

```ts
// src/services/group.service.ts:27-35
export const getGroupById = async (groupId) => {
  try {
    // ...
    return { groupId, name: data.name, ... };
  } catch (error) {
    console.error("getGroupById error:", error);
    return null;
  }
};
```

Y `auth.service.ts` va al otro extremo: **no tiene ningún try/catch**, aunque vuestro `CLAUDE.md` dice que los servicios deben tenerlos (reads → `null`, writes → `throw`).

### Por qué importa

- **El `console.error` dentro del catch siempre se dispara en producción.** La consola de los usuarios reales (y la de Sentry, si algún día lo integráis) se llena de mensajes en cada caída de red pasajera. Eso enmascara los errores de verdad.
- **Vuestra propia regla en `CLAUDE.md`** dice: *«Lectura → devuelve `null` en error; Escritura → re-lanza»*. El patrón es bueno. Solo hay que aplicarlo en `auth.service.ts` y quitar los `console.error` de los demás.
- **El logging es responsabilidad del consumidor**, no del servicio. El componente decide si el error merece un `<Alert>`, un toast, un `console.error` en dev, o un reintento silencioso.

### Cómo lo arregláis

```ts
// Lecturas: null en error, sin console
export const getGroupById = async (groupId: string): Promise<GroupData | null> => {
  try {
    const snap = await getDoc(doc(db, "groups", groupId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return { groupId, name: data.name, imageUrl: data.imageUrl, inviteCode: data.inviteCode, adminId: data.adminId, members: data.members };
  } catch {
    return null;
  }
};

// Escrituras: rethrow, sin console
export const createGroup = async (data: CreateGroupData): Promise<string> => {
  try {
    const inviteCode = crypto.randomUUID();
    const ref = await addDoc(collection(db, "groups"), { ... });
    return ref.id;
  } catch (error) {
    throw error;
  }
};

// auth.service.ts: aplicar el mismo patrón a loginUser, registerUser, etc.
```

Y si queréis logging en dev, sacadlo a una utilidad:

```ts
// src/utils/logger.ts
export const logDev = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.warn(...args);
};
```

### 💡 Aprendizaje

**Las capas no comparten opiniones sobre errores.** La capa de datos sabe *qué* ha fallado; la capa de UI decide *qué hacer con ello*. Cuando un servicio hace `console.error`, está tomando una decisión de UI (mostrar algo al usuario) que no le corresponde.

---

## 8. Textos hardcodeados en medio del flujo i18n

### Qué pasa

Dos casos pequeños, muy visibles para usuarios en catalán:

```tsx
// src/pages/home/Home.tsx:13
<button onClick={logout}>Logout</button>
```

```tsx
// src/pages/groups/invite-group/InviteGroupPage.tsx:29-31
await navigator.share({
  title: "Applec",
  text: `Únete a mi falla con el código: ${inviteCode}`,
});
```

Dos strings que no pasan por `useTranslation`. Uno en inglés, otro en español.

### Por qué importa

Habéis montado una infraestructura de i18n muy buena, con 5 namespaces y 2 idiomas… y luego un «Logout» suelto la rompe. Para un usuario en catalán, ver «Bienvenido a Applec» en una pantalla y «Logout» en otra es lo que en UX llaman *rough edge*: no impide usar la app, pero rompe la sensación de producto acabado.

### Cómo lo arregláis

```tsx
// Home.tsx
const { t } = useTranslation("common");
<button onClick={logout}>{t("buttons.logout")}</button>

// InviteGroupPage.tsx
const { t } = useTranslation("groups");
await navigator.share({
  title: t("invite.shareTitle"),     // "Applec" o localizado
  text: t("invite.shareText", { inviteCode }),
});
```

Y en `src/locales/{es,ca}/groups.json`:

```json
{
  "invite": {
    "shareTitle": "Applec",
    "shareText": "Únete a mi falla con el código: {{inviteCode}}"
  }
}
```

Un `grep` que os puede salvar en futuros PRs:

```bash
# Texto visible sin t(): buscar strings con letras dentro de JSX
grep -rn ">[A-Za-z]\{3,\}" src/pages src/components | grep -v "t("
```

### 💡 Aprendizaje

**Si una parte del proyecto usa i18n, toda la UI de usuario tiene que pasar por i18n.** No hay «strings pequeños que no importan»: importa la consistencia, no la longitud.

---

## 9. `<title>` genérico y sin `<meta name="description">`

### Qué pasa

En `public/index.html`:

```html
<title>Applec</title>
<!-- no hay meta description -->
```

Y en `public/manifest.json`:

```json
{
  "short_name": "Ionic App",
  "name": "My Ionic App",
}
```

### Por qué importa

Estos valores son lo que Google, el buscador de WhatsApp, y la pantalla de inicio del móvil usan para representar vuestra app. Con el manifest actual, si alguien instala la PWA (cosa que actualmente no puede, ver sección 12), el icono diría «Ionic App».

Es el equivalente a entregar un dossier con la plantilla sin rellenar.

### Cómo lo arregláis

```html
<!-- public/index.html -->
<title>Applec - gestiona tu falla</title>
<meta name="description" content="Applec es la app para fallers y falleres: gestiona miembros, eventos y asistencias de tu falla." />
```

```json
// public/manifest.json
{
  "short_name": "Applec",
  "name": "Applec — Falles App",
  "description": "Gestiona tu falla: miembros, eventos y asistencias.",
  "theme_color": "#1d1d1d",
  "background_color": "#ffffff"
}
```

Y si queréis localizar `<title>` por página, se hace con `document.title` en `useEffect` (o con una librería como `react-helmet-async`).

### 💡 Aprendizaje

**El marketing de vuestra app vive fuera del bundle.** `index.html` y `manifest.json` son lo que se ve **antes** de que React arranque. Merecen la misma revisión de copy que una pantalla de onboarding.

---

## 10. Contraste insuficiente en el botón secundario

### Qué pasa

Lighthouse (desktop y mobile) marca como fallo el botón «Ya tengo cuenta» de la landing:

```
Element has insufficient color contrast of 3.56
foreground: #0068ff
background: #cce1ff
font size: 15pt (20px), weight: normal
Expected contrast ratio of 4.5:1
```

Es el `<button class="button secondary">` de `LandingPage.tsx`.

### Por qué importa

El ratio **4.5:1** es el mínimo para texto normal en WCAG AA. Con 3.56:1, una persona con visión baja (catarata, deuteranopía, simplemente pantalla con poco brillo al sol) puede no llegar a leer el texto del botón. Y este botón no es decoración: es uno de los dos CTAs principales del onboarding.

El azul vibrante sobre azul pálido se ve precioso en Figma y en pantallas nuevas, pero suspende la accesibilidad.

### Cómo lo arregláis

Tres caminos, elegid según cuánto queráis tocar el diseño:

- **Subir el peso de la tipografía:** si lo ponéis a `font-weight: 600` o más, el umbral WCAG baja a 3:1 y ya cumplís. Cambio minimal en el token del botón.
- **Oscurecer el foreground:** `#0056d6` sobre `#cce1ff` da 4.55:1. Cambia levemente el tono pero respeta la paleta.
- **Oscurecer el background:** `#a8d0ff` con `#0068ff` da también >4.5:1.

Comprobadlo siempre en [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) antes de mergear.

### 💡 Aprendizaje

**El contraste no es un criterio de «se ve bien», es una métrica numérica.** Antes de dar por buena una paleta, el equipo de diseño debería pasarla por un checker. Y una vez definidos los tokens, el contraste forma parte del *design system*: si cambia el token del botón secundario, toca recalcular.

---

## 11. Ninguna página tiene `<main>`

### Qué pasa

Todas las páginas se montan dentro de un `<div className="x-page">`, sin usar ningún landmark semántico:

```tsx
// src/pages/onboarding/landing/LandingPage.tsx:12
<div className="landing-page">
  <div className="landing-page__header">
    <h1>...</h1>
  </div>
  ...
</div>
```

Lighthouse lo marca como `landmark-one-main`.

### Por qué importa

Los **landmarks** (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`) son los puntos de navegación rápida de un lector de pantalla. Un usuario de VoiceOver/NVDA pulsa `D` (en NVDA) o `VO+U` (en VoiceOver) y salta directamente al `<main>` para leer el contenido real. Sin `<main>`, tiene que tabular por toda la página desde arriba, cada vez.

Es el equivalente a una biblioteca sin sección «Ficción»: el libro está, pero hay que recorrerla entera para encontrarlo.

### Cómo lo arregláis

Una vez por página - es literalmente cambiar el `div` raíz:

```tsx
// Antes
<div className="landing-page">
  ...
</div>

// Después
<main className="landing-page">
  ...
</main>
```

Si queréis hacerlo en un solo sitio, envolved `<AppRoutes />` dentro de `App.tsx`:

```tsx
const App = () => (
  <AuthContextProvider>
    <GroupContextProvider>
      <div className="app">
        <main className="app__main">
          <AppRoutes />
        </main>
      </div>
    </GroupContextProvider>
  </AuthContextProvider>
);
```

### 💡 Aprendizaje

**HTML tiene elementos que significan algo más que `<div>` y `<span>`**. `<main>`, `<nav>`, `<header>`, `<section>`, `<article>`, `<aside>`, `<footer>`. Cada uno es gratis y cada uno mejora la navegación asistida. Regla mental: **nunca una página sin un `<main>`**.

---

## 12. CLS = 0.15 — el layout «salta» al cargar las fuentes

### Qué pasa

El trace de performance, una vez la app renderiza de verdad, da:

```
LCP: 345 ms   ← excelente, se ve rápido
CLS: 0.15     ← en el rango «needs improvement»
```

El culpable más probable son las dos tipografías externas cargadas en `public/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:..." rel="stylesheet" />
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600..." rel="stylesheet" />
```

El navegador muestra primero una fuente del sistema, y al llegar Bricolage/General Sans **reescribe todo el layout** con las nuevas métricas (altura de línea, kerning, ascender). Cada línea de texto se mueve un par de pixels → CLS acumulado.

### Por qué importa

**CLS (Cumulative Layout Shift)** es una de las tres Core Web Vitals que Google usa para rankear. El umbral «bueno» es < 0.10; vosotros estáis en 0.15. Más allá del SEO, para el usuario es la sensación de que la pantalla «pega un bote» justo cuando iba a pulsar un botón — y acaba pulsando otra cosa.

### Cómo lo arregláis

Dos medidas baratas:

**1. `font-display: swap` + preconnect explícito** (ya lo tenéis bien). Confirmad que la URL incluye `&display=swap`:

```html
<!-- ya está: ...&display=swap" rel="stylesheet" /> -->
```

**2. Reservar métricas con `size-adjust` y `ascent-override`** para que la fuente del sistema y la definitiva ocupen el mismo alto. Se declara una `@font-face` «fallback» en SCSS:

```scss
@font-face {
  font-family: "Bricolage Fallback";
  src: local("Arial");
  size-adjust: 105%;         /* ajustad hasta que cuadren */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "Bricolage Grotesque", "Bricolage Fallback", sans-serif;
}
```

Herramienta para calcular esos números: [Fallback Font Generator de Malte Ubl](https://malte-ubl.github.io/font-fallback-generator/). Le metéis la fuente real y os da el snippet exacto.

**3. Alternativa más simple**: hospedar las fuentes vosotros mismos (`@font-face` con archivos locales) en vez de Google Fonts + Fontshare. Quita el tiempo de DNS + TLS de dos dominios terceros.

### 💡 Aprendizaje

**Las fuentes web son performance y accesibilidad, no solo branding.** Cada tipografía externa que añadís es una apuesta entre elegancia y Core Web Vitals. Si una fuente merece cargarse, merece que os peleéis con sus métricas de fallback.

---

## 13. La imagen de la landing no es responsive en mobile

### Qué pasa

Lighthouse mobile marca `image-size-responsive`:

```
src/assets/images/landing-ilustration.png
displayed: 344×344
actual:    344×344
expected:  516×516  (para pantallas de alta densidad)
```

La imagen se sirve a resolución exacta (344 pixels CSS), pero **los móviles modernos tienen densidad 2x/3x** (un iPhone Pro va a 3x). Al ampliar para llenar esos pixels físicos, se ve borrosa.

Además, los tres ilustraciones de onboarding están en PNG. Para ilustraciones planas tipo «vector», PNG es la peor elección en peso.

### Por qué importa

- La primera impresión de vuestra app es una ilustración borrosa en el 60% de los móviles que la van a ver.
- El PNG de la landing pesa ≈ 50-80 KB por ilustración; en SVG serían 5-15 KB, y además **escalan perfectamente** en cualquier densidad.

### Cómo lo arregláis

**Plan A (recomendado):** convertir las tres ilustraciones a SVG. Si las diseñáis en Figma, es «Export as SVG». Una ilustración plana es exactamente lo que SVG existe para representar.

**Plan B (si el SVG no es viable, p. ej. son fotografías):** ofrecer varios tamaños con `srcset`:

```tsx
<img
  src={landingIlustration344}
  srcSet={`${landingIlustration344} 344w, ${landingIlustration516} 516w, ${landingIlustration1032} 1032w`}
  sizes="(max-width: 400px) 344px, 516px"
  alt=""
/>
```

**Plan C (mínimo esfuerzo):** exportar el PNG a 2x (688×688) y dejarlo. Gana calidad a costa de peso. No es lo ideal, pero resuelve el audit.

### 💡 Aprendizaje

**Mobile ≠ desktop reducido.** Las pantallas de los móviles tienen más píxeles por pulgada que las de escritorio, así que los assets que se ven «bien» en el navegador grande quedan pixelados en el móvil real. Regla mental: **para ilustraciones, SVG por defecto; para fotos, `srcset` siempre**.

---

## Recursos para profundizar

Los que siempre recomiendo, ordenados por proximidad a lo que hemos visto:

- **Accesibilidad práctica** — [The A11y Project · Checklist](https://www.a11yproject.com/checklist/). Checklist cortita, orientada a hacer, no a leer.
- **WebAIM · Contrast Checker** — [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/). Para verificar los colores de vuestros tokens.
- **axe DevTools (extensión del navegador)** — busca «axe DevTools Chrome». Detecta un 40-60% de los problemas de a11y automáticamente. Muy útil antes de un PR.
- **WCAG 2.2 en castellano** — [W3C · WCAG 2.2](https://www.w3.org/TR/WCAG22/). Para cuando queráis el rigor completo.
- **web.dev · Learn Performance** — [web.dev/learn/performance](https://web.dev/learn/performance/). Curso oficial de Google, con vídeos cortos.
- **web.dev · Core Web Vitals** — [web.dev/explore/learn-core-web-vitals](https://web.dev/explore/learn-core-web-vitals). LCP, CLS, INP explicados sin paja.
- **React Router v7 docs** — [reactrouter.com](https://reactrouter.com). Lectura especialmente recomendada: «Navigating» y «Links».
- **MDN · `<html lang>`** — [developer.mozilla.org/docs/Web/HTML/Element/html](https://developer.mozilla.org/docs/Web/HTML/Element/html). La sección de «Accessibility concerns».
- **React · Error Boundaries** — [react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Oficial, con ejemplos.

---

## Cierre

Habéis construido una app **con criterio**. Se ve arquitectura pensada, no improvisación: guardas de ruta, contextos con loading, servicios centralizados, BEM sostenido, i18n con namespaces, TypeScript sin trampas. Esto **no es lo normal** en un proyecto de estudiantes, y merece que lo reconozcáis.

Lo que os he señalado en este documento no contradice nada de eso. Son pulidos: detalles que separan un proyecto *que funciona* de un proyecto *que podríais enseñar en una entrevista*. La lista parece larga porque he querido ser exhaustivo, pero si miráis el plan de tres semanas veréis que casi todo son arreglos de 5-30 minutos.

Un consejo final que me ha servido a mí: **arreglad primero lo que desbloquea medir**. La sección 1 es la obvia (sin ella no hay app que auditar), pero la regla vale siempre. No optimicéis lo que no podéis medir; no midáis lo que no podéis ver renderizar; no renderizéis lo que no podéis compilar.

🪅

---
