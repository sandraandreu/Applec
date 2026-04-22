---
paths:
  - "src/ui-kit/**"
  - "src/components/**"
  - "src/pages/**"
---

# Accesibilidad

## Navegación interna: `<Link>` no `<a>`

Para navegar entre rutas de la app usar siempre `<Link to="...">` de React Router. Un `<a href>` interno hace un full reload de React.

```tsx
// ✗ Mal — recarga toda la app
<a href="/forgot-password">Recuperar contraseña</a>

// ✓ Bien — navegación de SPA
<Link to="/forgot-password">Recuperar contraseña</Link>
```

Regla: si el destino está en `AppRoutes.tsx` → `<Link>`. Si va a otro dominio → `<a target="_blank" rel="noopener noreferrer">`.

## Botones-icono: siempre `aria-label`

Todo elemento interactivo sin texto visible necesita `aria-label` describiendo lo que **hace**, no lo que **es**.

```tsx
// ✗ Mal — el lector de pantalla dice «botón»
<button><svg>...</svg></button>

// ✓ Bien
<button aria-label={t("buttons.back")}><svg aria-hidden="true">...</svg></button>
```

## SVGs decorativos: `aria-hidden="true"`

Los SVGs dentro de botones o elementos interactivos deben llevar `aria-hidden="true"` para que el lector de pantalla no los duplique.

## Inputs sin label visible: `.visually-hidden`

Si un input no tiene `<label>` visible, usar un `<span className="visually-hidden">` dentro del label. El `placeholder` no sustituye al label.

```tsx
<label className="search">
  <span className="visually-hidden">{t("search.label")}</span>
  <input type="search" placeholder={placeholder} />
</label>
```

La clase `.visually-hidden` está definida en `src/scss/utilities/_helpers.scss`.

## Landmark `<main>` obligatorio

Toda página debe tener exactamente un `<main>`. Ya está envuelto en `App.tsx` — no añadir otro `<main>` dentro de las páginas.

## Semántica HTML

Botón = ejecuta una acción. Enlace = lleva a un destino. No usar `<a>` sin `href` como botón ni `<div>` con `onClick` como elemento interactivo.
