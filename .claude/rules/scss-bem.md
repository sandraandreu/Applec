---
paths:
  - "src/**/*.scss"
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# SCSS — BEM y consolidación de estilos

## Nomenclatura BEM obligatoria

Todas las clases siguen BEM sin excepciones:
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

## Un archivo SCSS por carpeta funcional

Cada carpeta tiene un único archivo SCSS con el mismo nombre que la carpeta:
- `member-card/member-card.scss` ✓
- `member-card/card.scss` ✗
- `member-card/avatar.scss` + `member-card/name.scss` ✗

No atomizar estilos por micro-componente. Si la carpeta tiene varios componentes relacionados, todos sus estilos van en el único archivo de la carpeta.

## Sin estilos inline en JSX — prohibido

Nunca usar `style={{ ... }}` en componentes React. Todo estilo va en el archivo SCSS de la carpeta con su clase BEM correspondiente.

```tsx
// ✗ Mal
<div style={{ height: "100%", overflow: "hidden" }}>

// ✓ Bien
<div className="create-event">
// y en create-event.scss:
// .create-event { height: 100%; overflow: hidden; }
```

La única excepción permitida son estilos calculados dinámicamente en JavaScript que no pueden expresarse en CSS estático (por ejemplo, un `translateY` calculado en tiempo real por un gesto táctil).
